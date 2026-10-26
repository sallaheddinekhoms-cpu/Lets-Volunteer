from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import models
from ..models import (
    ResponsabilityTemplate,
    OrganizationContact,
    SupportTicket,
    TrainingCourse,
    SolidarityItem,
    SolidarityRequest,
    Opportunity,
)
from users.models import Profile, Organization
from ..serializers.utils_serializers import SolidarityRequestSerializer


class ResponsibilityTemplateListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        templates = ResponsabilityTemplate.objects.all().values('id', 'title', 'category_id')
        return Response(list(templates), status=status.HTTP_200_OK)


class OrganizationContactsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'organization'):
            return Response({"detail": "Only organizations can access contacts."}, status=status.HTTP_403_FORBIDDEN)
        contacts = OrganizationContact.objects.filter(organization=request.user.organization).values(
            'id', 'name', 'role_title', 'phone_number', 'is_default'
        )
        return Response(list(contacts), status=status.HTTP_200_OK)

    def post(self, request):
        if not hasattr(request.user, 'organization'):
            return Response({"detail": "Only organizations can add contacts."}, status=status.HTTP_403_FORBIDDEN)
        name = request.data.get('name') or request.data.get('contact_name')
        phone_number = request.data.get('phone_number')
        role_title = request.data.get('role_title', '')
        is_default = request.data.get('is_default', False)
        if not name or not phone_number:
            return Response({"error": "الاسم ورقم الهاتف مطلوبان."}, status=status.HTTP_400_BAD_REQUEST)
        contact = OrganizationContact.objects.create(
            organization=request.user.organization,
            name=name,
            phone_number=phone_number,
            role_title=role_title,
            is_default=is_default,
        )
        return Response({
            "id": contact.id,
            "name": contact.name,
            "phone_number": contact.phone_number,
            "role_title": contact.role_title,
            "is_default": contact.is_default,
        }, status=status.HTTP_201_CREATED)


class SupportTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            tickets = SupportTicket.objects.all().select_related('user')
        else:
            tickets = SupportTicket.objects.filter(user=request.user)
        results = [
            {
                "id": str(t.id),
                "subject": t.subject,
                "message": t.message,
                "status": t.status,
                "priority": t.priority,
                "admin_response": t.admin_response,
                "created_at": t.created_at,
                "user_email": t.user.email,
            }
            for t in tickets
        ]
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        priority = request.data.get('priority', 'medium')
        if not subject or not message:
            return Response({"error": "الموضوع والرسالة مطلوبان."}, status=status.HTTP_400_BAD_REQUEST)
        ticket = SupportTicket.objects.create(
            user=request.user,
            subject=subject,
            message=message,
            priority=priority,
        )
        return Response({"id": str(ticket.id), "message": "تم إرسال بطاقة الشكوى بنجاح"}, status=status.HTTP_201_CREATED)


class TrainingCourseListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        courses = TrainingCourse.objects.filter(is_active=True)
        user = request.user
        volunteer = getattr(user, 'volunteer', None) if user.is_authenticated else None

        results = []
        for c in courses:
            is_enrolled = False
            is_completed = False
            if volunteer:
                enrollment = c.enrollments.filter(volunteer=volunteer).first()
                if enrollment:
                    is_enrolled = True
                    is_completed = enrollment.is_completed

            results.append({
                "id": str(c.id),
                "title": c.title,
                "trainer_or_provider": c.trainer_or_provider,
                "description": c.description,
                "is_online": c.is_online,
                "location": c.location,
                "meeting_link": c.meeting_link,
                "start_date": c.start_date,
                "duration_hours": c.duration_hours,
                "max_participants": c.max_participants,
                "enrolled_count": c.enrollments.count(),
                "is_enrolled": is_enrolled,
                "is_completed": is_completed,
            })
        return Response(results, status=status.HTTP_200_OK)


class TrainingCourseEnrollView(APIView):
    """Volunteer enrolls in a training course."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        user = request.user
        if not hasattr(user, 'volunteer'):
            return Response({"error": "Only volunteers can enroll in training courses"}, status=403)

        try:
            course = TrainingCourse.objects.get(id=course_id, is_active=True)
        except TrainingCourse.DoesNotExist:
            return Response({"error": "Training course not found"}, status=404)

        from api.models import TrainingEnrollment
        enrollment, created = TrainingEnrollment.objects.get_or_create(
            course=course,
            volunteer=user.volunteer
        )

        return Response({
            "success": True,
            "created": created,
            "message": f"تم التسجيل بنجاح في دورة: {course.title}. عند إتمامك للدورة ستضاف {course.duration_hours} ساعات إلى رصيدك التطوعي."
        }, status=status.HTTP_200_OK)


class TrainingCourseCompleteView(APIView):
    """Mark a volunteer's training course as completed and credit the hours."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        user = request.user
        from api.models import TrainingEnrollment
        from api.impact_services import ImpactService

        # Allow volunteer self-completion or admin/organization verification
        target_volunteer = None
        volunteer_id = request.data.get('volunteer_id')

        if volunteer_id and (user.is_staff or hasattr(user, 'organization')):
            from users.models import Volunteer
            try:
                target_volunteer = Volunteer.objects.get(id=volunteer_id)
            except Volunteer.DoesNotExist:
                return Response({"error": "Volunteer not found"}, status=404)
        elif hasattr(user, 'volunteer'):
            target_volunteer = user.volunteer
        else:
            return Response({"error": "Unauthorized"}, status=403)

        try:
            course = TrainingCourse.objects.get(id=course_id)
        except TrainingCourse.DoesNotExist:
            return Response({"error": "Training course not found"}, status=404)

        enrollment, _ = TrainingEnrollment.objects.get_or_create(
            course=course,
            volunteer=target_volunteer
        )
        enrollment.is_completed = True
        enrollment.completed_at = timezone.now()
        enrollment.save()

        hours = ImpactService.award_training_credit(enrollment)

        return Response({
            "success": True,
            "hours_awarded": float(hours),
            "message": f"تهانينا! تم توثيق إتمام الدورة بنجاح وإضافة {hours} ساعات تكوين معتمدة إلى رصيد المتطوع."
        }, status=status.HTTP_200_OK)


class OrganizationLeaderboardView(APIView):
    """Leaderboard of top volunteer organizations ranked by civic impact score."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from api.models import OrganizationImpact
        impacts = OrganizationImpact.objects.select_related('organization').order_by('-impact_points')[:10]
        results = []
        for imp in impacts:
            org = imp.organization
            results.append({
                "id": str(org.id),
                "name": org.organization_name,
                "wilaya": org.wilaya or "الجزائر",
                "logo": org.logo.url if org.logo else None,
                "impact_points": imp.impact_points,
                "tier": imp.tier,
                "tier_label": imp.get_tier_display(),
                "avg_rating": float(imp.avg_volunteer_rating),
                "badge_volunteer_friendly": imp.badge_volunteer_friendly,
                "badge_training_incubator": imp.badge_training_incubator,
                "badge_rapid_response": imp.badge_rapid_response,
                "opportunities_count": imp.opportunities_completed,
            })
        return Response(results, status=status.HTTP_200_OK)


class SolidarityItemListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = SolidarityItem.objects.filter(status=SolidarityItem.ItemStatus.AVAILABLE)
        results = [
            {
                "id": str(item.id),
                "title": item.title,
                "category": item.category,
                "item_type": item.item_type,
                "description": item.description,
                "wilaya": item.wilaya,
                "daira": item.daira,
                "status": item.status,
                "contact_phone": item.contact_phone,
                "created_at": item.created_at,
            }
            for item in items
        ]
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        title = request.data.get('title')
        category = request.data.get('category', 'مستلزمات طبية وتكافلية')
        item_type = request.data.get('item_type', 'lending')
        description = request.data.get('description', '')
        wilaya = request.data.get('wilaya', '')
        daira = request.data.get('daira', '')
        contact_phone = request.data.get('contact_phone', request.user.phone_number or '')

        if not title or not wilaya or not contact_phone:
            return Response({"error": "العنوان، الولاية ورقم الاتصال مطلوبة."}, status=status.HTTP_400_BAD_REQUEST)

        item = SolidarityItem.objects.create(
            donor=request.user,
            title=title,
            category=category,
            item_type=item_type,
            description=description,
            wilaya=wilaya,
            daira=daira,
            contact_phone=contact_phone,
        )
        return Response({"id": str(item.id), "message": "تم إدراج الغرض في متجر التطوع بنجاح"}, status=status.HTTP_201_CREATED)


class SolidarityRequestListView(APIView):
    """Public view to get approved requests or submit a new need request."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        wilaya = request.query_params.get('wilaya')
        search = request.query_params.get('search')
        category = request.query_params.get('category')

        # Only approved requests are publicly visible in the store!
        qs = SolidarityRequest.objects.filter(status=SolidarityRequest.StatusChoices.APPROVED)
        if wilaya and wilaya not in ['الكل', 'all']:
            qs = qs.filter(wilaya__icontains=wilaya)
        if category and category not in ['الكل', 'all']:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(models.Q(title__icontains=search) | models.Q(description__icontains=search))

        serializer = SolidarityRequestSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        requester_name = request.data.get('requester_name') or (
            request.user.get_full_name() if request.user.is_authenticated else ''
        )
        title = request.data.get('title')
        category = request.data.get('category', 'مستلزمات طبية')
        urgency = request.data.get('urgency', 'normal')
        description = request.data.get('description', '')
        wilaya = request.data.get('wilaya', '')
        daira = request.data.get('daira', '')
        contact_phone = request.data.get('contact_phone') or (
            getattr(request.user, 'phone_number', '') if request.user.is_authenticated else ''
        )

        if not title or not wilaya or not contact_phone or not requester_name:
            return Response(
                {"error": "يرجى إدخال اسم صاحب الطلب، الغرض المطلوب، الولاية، ورقم الهاتف."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_profile = request.user if request.user.is_authenticated else None

        req = SolidarityRequest.objects.create(
            requester_name=requester_name,
            user=user_profile,
            title=title,
            category=category,
            urgency=urgency,
            description=description,
            wilaya=wilaya,
            daira=daira,
            contact_phone=contact_phone,
            status=SolidarityRequest.StatusChoices.PENDING,
        )

        return Response(
            {
                "id": str(req.id),
                "status": req.status,
                "message": "تم تقديم طلبك بنجاح! سيتم مراجعته والمصادقة عليه من قبل إدارة المنصة قبل نشره في المتجر."
            },
            status=status.HTTP_201_CREATED
        )


class AdminSolidarityRequestView(APIView):
    """Admin-only view to review, approve, reject, or delete requests."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = SolidarityRequest.objects.all().order_by('-created_at')
        if status_filter and status_filter != 'all':
            qs = qs.filter(status=status_filter)
        
        serializer = SolidarityRequestSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            req = SolidarityRequest.objects.get(pk=pk)
        except SolidarityRequest.DoesNotExist:
            return Response({"error": "الطلب غير موجود."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        admin_note = request.data.get('admin_note')

        if new_status:
            if new_status not in [c[0] for c in SolidarityRequest.StatusChoices.choices]:
                return Response({"error": "حالة غير صالحة."}, status=status.HTTP_400_BAD_REQUEST)
            req.status = new_status

        if admin_note is not None:
            req.admin_note = admin_note

        req.save()
        return Response({
            "id": str(req.id),
            "status": req.status,
            "status_display": req.get_status_display(),
            "message": "تم تحديث حالة الطلب بنجاح."
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            req = SolidarityRequest.objects.get(pk=pk)
            req.delete()
            return Response({"message": "تم حذف الطلب بنجاح."}, status=status.HTTP_200_OK)
        except SolidarityRequest.DoesNotExist:
            return Response({"error": "الطلب غير موجود."}, status=status.HTTP_404_NOT_FOUND)


from django.http import HttpResponse
from ..official_report_pdf import generate_official_report_pdf
from django.db.models import Sum


class OfficialReportPdfView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        opp_count = Opportunity.objects.count()
        total_hours = Opportunity.objects.aggregate(total_dur=Sum('duration'))['total_dur'] or 0
        vol_count = Profile.objects.filter(role=Profile.Role.VOLUNTEER).count()
        org_count = Organization.objects.count()

        recent_opps = []
        for opp in Opportunity.objects.order_by('-created_at')[:10]:
            recent_opps.append({
                "title": opp.title,
                "wilaya": opp.wilaya,
                "organization": getattr(opp.organization, 'organization_name', 'هيئة معتمدة'),
                "is_available": opp.is_available,
            })

        stats_data = {
            "opportunities_count": opp_count,
            "volunteer_hours": total_hours * 8,  # Estimated 8h per day of opportunity
            "volunteers_count": vol_count,
            "organizations_count": org_count,
            "recent_opportunities": recent_opps,
        }

        pdf_bytes = generate_official_report_pdf(stats_data, user=request.user if request.user.is_authenticated else None)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="rapport_officiel_letsvolunteer.pdf"'
        return response
