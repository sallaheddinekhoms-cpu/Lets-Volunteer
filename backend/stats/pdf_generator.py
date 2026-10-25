from io import BytesIO
import os
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.db.models import Count, Avg, Sum

from users.models import Volunteer, Organization
from api.models import Opportunity, Participation, Aid

def generate_stats_pdf(request):
    # Gather data for the report
    data = {
        # Basic statistics
        "total_volunteers": Volunteer.objects.count(),
        "total_organizations": Organization.objects.count(),
        "total_opportunities": Opportunity.objects.count(),
        "total_participations": Participation.objects.count(),
        "completed_participations": Participation.objects.filter(status="done").count(),
        "total_volunteer_hours": Participation.objects.filter(
            status="done"
        ).aggregate(
            total_hours=Sum('hours_worked')
        )['total_hours'] or 0,
        
        # Volunteer statistics
        "top_volunteers": Participation.objects.values(
            'volunteer__first_name', 
            'volunteer__last_name'
        ).annotate(
            participation_count=Count('id'),
            hours_worked=Sum('hours_worked')
        ).order_by('-participation_count')[:5],
        
        # Organization statistics
        "top_organizations": Organization.objects.annotate(
            opportunities_count=Count('opportunities')
        ).values(
            'organization_name', 'opportunities_count'
        ).order_by('-opportunities_count')[:5],
        
        # Opportunity statistics
        "opportunities_by_category": Opportunity.objects.values(
            'category__label'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5],
        
        # Participation statistics
        "status_distribution": Participation.objects.values(
            'status'
        ).annotate(
            count=Count('id')
        ),
        
        # Status mapping for Arabic
        "status_mapping": {
            "pending": "قيد الإنتظار",
            "accepted": "مقبولة",
            "refused": "مرفوضة",
            "done": "مكتملة"
        },
        
        # Aid statistics
        "aid_by_type": Aid.objects.values(
            'aid_type__label'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5],
    }
    
    # Load the template

    template = get_template("pdf_report_arabic.html")
    html = template.render(data)
    
    # Create the PDF with RTL support
    result = BytesIO()
    
    # Define font configuration
    pdf_options = {
        "encoding": "UTF-8",
        "fontConfig": {
            "useGlobalFonts": True,
        }
    }
    
    pdf = pisa.pisaDocument(
        BytesIO(html.encode("UTF-8")), 
        result,
        options=pdf_options
    )
    
    if not pdf.err:
        # Return the PDF as a response
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="تقرير_احصائيات_التطوع.pdf"'
        return response
    
    return HttpResponse("خطأ في إنشاء ملف PDF", status=400)