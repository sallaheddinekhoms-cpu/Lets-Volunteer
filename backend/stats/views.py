# stats/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Sum, F
from django.db.models.functions import TruncMonth, TruncYear

from users.models import Volunteer, Organization, Profile, Skill, VolunteerSkill
from api.models import Opportunity, Participation, Category, Aid, AidType

class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get basic summary statistics for the dashboard"""
        stats = {
            "total_volunteers": {
                "value": Volunteer.objects.count(),
                "label": "إجمالي المتطوعين"
            },
            "total_organizations": {
                "value": Organization.objects.count(),
                "label": "إجمالي المنظمات"
            },
            "total_opportunities": {
                "value": Opportunity.objects.count(),
                "label": "إجمالي الفرص التطوعية"
            },
            "total_participations": {
                "value": Participation.objects.count(),
                "label": "إجمالي المشاركات"
            },
            "completed_participations": {
                "value": Participation.objects.filter(status="done").count(),
                "label": "المشاركات المكتملة"
            },
            "total_volunteer_hours": {
                "value": Participation.objects.filter(
                    status="done"
                ).aggregate(
                    total_hours=Sum('hours_worked')
                )['total_hours'] or 0,
                "label": "إجمالي ساعات التطوع"
            },
            "average_rating": {
                "value": Participation.objects.filter(
                    rating__isnull=False
                ).aggregate(
                    avg_rating=Avg('rating')
                )['avg_rating'] or 0,
                "label": "متوسط التقييم"
            },
        }
        
        return Response(stats)

class VolunteerStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get volunteer-related statistics"""
        # Volunteers by wilaya (region)
        volunteers_by_wilaya = list(Volunteer.objects.values(
            'wilaya'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in volunteers_by_wilaya:
            if item['wilaya']:
                item['name'] = item['wilaya']
                item['label'] = item['wilaya']
            else:
                item['name'] = "غير محدد"
                item['label'] = "غير محدد"
        
        # Volunteers by skill
        skills_data = list(VolunteerSkill.objects.values(
            'skill__name'
        ).annotate(
            count=Count('volunteer', distinct=True)
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in skills_data:
            if item['skill__name']:
                item['name'] = item['skill__name']
                item['label'] = item['skill__name']
            else:
                item['name'] = "غير محدد"
                item['label'] = "غير محدد"
        
        # Top active volunteers
        top_volunteers = list(Participation.objects.values(
            'volunteer__first_name', 
            'volunteer__last_name', 
            'volunteer__id'
        ).annotate(
            participation_count=Count('id'),
            hours_worked=Sum('hours_worked')
        ).order_by('-participation_count')[:10])
        
        # Transform data for Arabic
        for item in top_volunteers:
            item['name'] = f"{item['volunteer__first_name'] or ''} {item['volunteer__last_name'] or ''}"
            item['participation_label'] = f"{item['participation_count']} مشاركة"
            item['hours_label'] = f"{item['hours_worked'] or 0} ساعة"
        
        stats = {
            "volunteers_by_wilaya": {
                "data": volunteers_by_wilaya,
                "title": "المتطوعين حسب الولاية"
            },
            "volunteers_by_skill": {
                "data": skills_data,
                "title": "المتطوعين حسب المهارة"
            },
            "top_volunteers": {
                "data": top_volunteers,
                "title": "أفضل المتطوعين"
            },
        }
        
        return Response(stats)

class OrganizationStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get organization-related statistics"""
        # Organizations by wilaya
        organizations_by_wilaya = list(Organization.objects.values(
            'wilaya'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in organizations_by_wilaya:
            if item['wilaya']:
                item['name'] = item['wilaya']
                item['label'] = item['wilaya']
            else:
                item['name'] = "غير محدد"
                item['label'] = "غير محدد"
        
        # Top organizations by opportunities created
        top_organizations = list(Organization.objects.annotate(
            opportunities_count=Count('opportunities')
        ).values(
            'organization_name', 'id', 'opportunities_count'
        ).order_by('-opportunities_count')[:10])
        
        # Transform data for Arabic
        for item in top_organizations:
            item['name'] = item['organization_name']
            item['label'] = f"{item['opportunities_count']} فرصة"
        
        stats = {
            "organizations_by_wilaya": {
                "data": organizations_by_wilaya,
                "title": "المنظمات حسب الولاية"
            },
            "top_organizations": {
                "data": top_organizations,
                "title": "أفضل المنظمات"
            },
        }
        
        return Response(stats)

class OpportunityStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get opportunity-related statistics"""
        # Opportunities by category
        opportunities_by_category = list(Opportunity.objects.values(
            'category__label'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in opportunities_by_category:
            if item['category__label']:
                item['name'] = item['category__label']
                item['label'] = item['category__label']
            else:
                item['name'] = "غير محدد"
                item['label'] = "غير محدد"
        
        # Opportunities by status
        opportunities_by_status = [
            {"name": "متاحة", "value": Opportunity.objects.filter(is_available=True).count()},
            {"name": "غير متاحة", "value": Opportunity.objects.filter(is_available=False).count()}
        ]
        
        # Remote vs on-site
        remote_vs_onsite = [
            {"name": "عن بعد", "value": Opportunity.objects.filter(is_remote=True).count()},
            {"name": "حضوري", "value": Opportunity.objects.filter(is_remote=False).count()}
        ]
        
        # Urgent vs regular
        urgent_vs_regular = [
            {"name": "عاجل", "value": Opportunity.objects.filter(is_urgent=True).count()},
            {"name": "عادي", "value": Opportunity.objects.filter(is_urgent=False).count()}
        ]
        
        # Geographic distribution
        geographic_distribution = list(Opportunity.objects.values(
            'wilaya'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in geographic_distribution:
            if item['wilaya']:
                item['name'] = item['wilaya']
                item['label'] = item['wilaya']
            else:
                item['name'] = "غير محدد"
                item['label'] = "غير محدد"
        
        stats = {
            "opportunities_by_category": {
                "data": opportunities_by_category,
                "title": "الفرص حسب الفئة"
            },
            "opportunities_by_status": {
                "data": opportunities_by_status,
                "title": "الفرص حسب الحالة"
            },
            "remote_vs_onsite": {
                "data": remote_vs_onsite,
                "title": "الفرص عن بعد مقابل الحضورية"
            },
            "urgent_vs_regular": {
                "data": urgent_vs_regular,
                "title": "الفرص العاجلة مقابل العادية"
            },
            "geographic_distribution": {
                "data": geographic_distribution,
                "title": "التوزيع الجغرافي للفرص"
            },
        }
        
        return Response(stats)

class ParticipationStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get participation-related statistics"""
        # Participation status distribution
        status_mapping = {
            "pending": "قيد الإنتظار",
            "accepted": "مقبولة",
            "refused": "مرفوضة",
            "done": "مكتملة"
        }
        
        status_distribution = list(Participation.objects.values(
            'status'
        ).annotate(
            count=Count('id')
        ))
        
        # Transform data for Arabic
        for item in status_distribution:
            item['name'] = status_mapping.get(item['status'], item['status'])
            item['value'] = item['count']
        
        # Average volunteer rating
        avg_rating = Participation.objects.filter(
            rating__isnull=False
        ).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating'] or 0
        
        # Total volunteer hours contributed
        total_hours = Participation.objects.filter(
            status="done",
            hours_worked__isnull=False
        ).aggregate(
            total_hours=Sum('hours_worked')
        )['total_hours'] or 0
        
        # Participation trends over time
        participation_trends = list(Participation.objects.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month'))
        
        # Transform data for Arabic month names
        arabic_months = [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ]
        
        for item in participation_trends:
            month_idx = item['month'].month - 1
            item['name'] = f"{arabic_months[month_idx]} {item['month'].year}"
            item['value'] = item['count']
        
        stats = {
            "status_distribution": {
                "data": status_distribution,
                "title": "توزيع حالات المشاركة"
            },
            "avg_rating": {
                "value": round(avg_rating, 1),
                "label": "متوسط التقييم"
            },
            "total_hours": {
                "value": total_hours,
                "label": "إجمالي ساعات التطوع"
            },
            "participation_trends": {
                "data": participation_trends,
                "title": "اتجاهات المشاركة عبر الزمن"
            },
        }
        
        return Response(stats)

class AidStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get aid-related statistics"""
        # Aid distribution by type
        aid_by_type = list(Aid.objects.values(
            'aid_type__label'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in aid_by_type:
            if item['aid_type__label']:
                item['name'] = item['aid_type__label']
                item['value'] = item['count']
            else:
                item['name'] = "غير محدد"
                item['value'] = item['count']
        
        # Aid distribution by organization
        aid_by_organization = list(Aid.objects.filter(
            organization__isnull=False
        ).values(
            'organization__organization_name'
        ).annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # Transform data for Arabic
        for item in aid_by_organization:
            item['name'] = item['organization__organization_name']
            item['value'] = item['count']
        
        # Aid trends over time
        aid_trends = list(Aid.objects.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month'))
        
        # Transform data for Arabic month names
        arabic_months = [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ]
        
        for item in aid_trends:
            month_idx = item['month'].month - 1
            item['name'] = f"{arabic_months[month_idx]} {item['month'].year}"
            item['value'] = item['count']
        
        stats = {
            "aid_by_type": {
                "data": aid_by_type,
                "title": "توزيع المساعدات حسب النوع"
            },
            "aid_by_organization": {
                "data": aid_by_organization,
                "title": "توزيع المساعدات حسب المنظمة"
            },
            "aid_trends": {
                "data": aid_trends,
                "title": "اتجاهات المساعدات عبر الزمن"
            },
        }
        
        return Response(stats)

class PDFReportAPIView(APIView):
#     permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Generate PDF report with statistics"""
        from .pdf_generator import generate_stats_pdf
        return generate_stats_pdf(request)