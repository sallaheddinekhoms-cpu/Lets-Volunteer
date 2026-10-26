from datetime import timezone
from django.conf import settings
from rest_framework.response import Response
from rest_framework import generics, status

from api.services import EmailService
from ..pagination import CustomPageNumberPagination
from ..models import Participation
from ..serializers.participation_serializers import *
from ..filters import ParticipationFilter
from users.models import Profile, Volunteer
from ..permissions import IsHisParticipation,IsVolunteer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class ParticipationListCreate(generics.ListCreateAPIView):
      pagination_class = CustomPageNumberPagination
      serializer_class = ParticipationCreateserializer
      filterset_class = ParticipationFilter
      
      def get_serializer_class(self):
            if self.request.method == 'POST':
                  return ParticipationCreateserializer
            
            if self.request.user.role == Profile.Role.ORGANIZATION or self.request.user.is_staff:
                  return ParticipationListSerializerOrg
            
            return ParticipationListSerializer
      
      def get_permissions(self):
            if self.request.method == 'POST':
                  return [IsAuthenticated(),IsVolunteer()]
            return [IsAuthenticated()]
      
      def get_queryset(self):
            user = self.request.user
            
            if user.is_staff:
                  return Participation.objects.all()

            if user.role == Profile.Role.VOLUNTEER:
                  return Participation.objects.filter(volunteer=user.volunteer)
            
            if user.role == Profile.Role.ORGANIZATION:
                  return Participation.objects.filter(opportunity__organization=user.organization)
            
            return Participation.objects.none()
      
    
      def perform_create(self, serializer):
            if self.request.user.role == Profile.Role.VOLUNTEER:
                  serializer.save(volunteer=self.request.user.volunteer)
            

class ParticipationRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
      permission_classes = [IsAuthenticated,IsHisParticipation]
      
      
      def get_serializer_class(self):
            if self.request.method == 'PATCH' or self.request.method == 'PUT':
                  return ParticipationUpdateSerializer
            return ParticipationCreateserializer
      
      def get_queryset(self):
            user = self.request.user
            
            if user.is_staff:
                  return Participation.objects.all()
            print("user",user)
            if user.role == Profile.Role.VOLUNTEER:
                  return Participation.objects.filter(volunteer=user.volunteer)
            
            if user.role == Profile.Role.ORGANIZATION:
                  return Participation.objects.filter(opportunity__organization=user.organization)
            
            return Participation.objects.none()
      
      def perform_update(self, serializer):
            print("data", serializer.validated_data)
            if self.request.user.role == Profile.Role.VOLUNTEER:
                  serializer.save(volunteer=self.request.user.volunteer)
            instance = serializer.save()
            if instance.status == Participation.StatusChoices.DONE:
                  from api.impact_services import ImpactService
                  ImpactService.award_participation_credits(instance)


class CompleteParticipationView(APIView):
      """
      Endpoint for Organizations to complete a volunteer's participation
      with full evaluation: skill level, transport, equipment, donation, and rating.
      """
      permission_classes = [IsAuthenticated]

      def post(self, request, participation_id):
            try:
                  participation = Participation.objects.get(id=participation_id)
            except Participation.DoesNotExist:
                  return Response({'error': 'Participation not found'}, status=404)

            # Check permissions
            user = request.user
            if not user.is_staff and (user.role != Profile.Role.ORGANIZATION or participation.opportunity.organization != user.organization):
                  return Response({'error': 'Unauthorized to evaluate this participation'}, status=403)

            # Extract fields
            hours_worked = request.data.get('hours_worked', participation.opportunity.duration or 4)
            rating = request.data.get('rating', 5)
            skill_level = request.data.get('skill_level', Participation.SkillLevel.GENERAL)
            provided_transport = bool(request.data.get('provided_transport', False))
            provided_equipment = bool(request.data.get('provided_equipment', False))
            provided_donation = bool(request.data.get('provided_donation', False))
            org_feedback = request.data.get('organization_feedback', '')

            participation.status = Participation.StatusChoices.DONE
            participation.hours_worked = int(hours_worked) if hours_worked else 4
            participation.rating = int(rating) if rating else 5
            participation.skill_level = skill_level
            participation.provided_transport = provided_transport
            participation.provided_equipment = provided_equipment
            participation.provided_donation = provided_donation
            if org_feedback:
                  participation.organization_feedback = org_feedback
            participation.save()

            # Award credits
            from api.impact_services import ImpactService
            awarded = ImpactService.award_participation_credits(participation)

            return Response({
                  'success': True,
                  'participation_id': str(participation.id),
                  'status': participation.status,
                  'calculated_credit_hours': float(awarded),
                  'message': f'تم تأكيد المشاركة بنجاح ومنح {awarded} ساعة تطوعية معتمدة'
            }, status=200)


class VolunteerRateOrganizationView(APIView):
      """
      Reverse evaluation: Volunteer rates and gives feedback to the organization.
      """
      permission_classes = [IsAuthenticated]

      def post(self, request, participation_id):
            try:
                  participation = Participation.objects.get(id=participation_id)
            except Participation.DoesNotExist:
                  return Response({'error': 'Participation not found'}, status=404)

            if participation.volunteer != request.user.volunteer:
                  return Response({'error': 'Only the volunteer can rate the organization'}, status=403)

            rating = request.data.get('rating')
            feedback = request.data.get('feedback', '')

            if not rating or not (1 <= int(rating) <= 5):
                  return Response({'error': 'Rating must be between 1 and 5'}, status=400)

            participation.volunteer_org_rating = int(rating)
            participation.volunteer_org_feedback = feedback
            participation.save(update_fields=['volunteer_org_rating', 'volunteer_org_feedback'])

            # Recalculate organization impact
            from api.impact_services import ImpactService
            ImpactService.recalculate_organization_impact(participation.opportunity.organization)

            return Response({
                  'success': True,
                  'message': 'شكراً لك! تم تسجيل تقييمك للجمعية بنجاح والمساهمة في مؤشر تميزها.'
            }, status=200)


class VolunteerCreditSummaryView(APIView):
      """Returns detailed breakdown of volunteer's earned credit hours and ranking."""
      permission_classes = [IsAuthenticated]

      def get(self, request):
            if request.user.role != Profile.Role.VOLUNTEER:
                  return Response({'error': 'Available only for volunteer accounts'}, status=403)

            from api.impact_services import ImpactService
            summary = ImpactService.get_volunteer_credit_summary(request.user.volunteer)
            return Response(summary, status=200)
      
     
      
class InviteVolunteer(APIView):
      
      def post(self,request,opportunity_id):
            volunteer_ids = request.data.get('volunteer_ids',[])
            emails = [] 
            
            if not volunteer_ids or not opportunity_id:
                  return Response({'error':'volunteer_ids and opportunity_id are required'},status=400)
            
            for volunteer_id in volunteer_ids:
                  volunteer = Volunteer.objects.get(id=volunteer_id)
                  if volunteer:
                        try:

                              participation,_ = Participation.objects.get_or_create(
                                    volunteer_id=volunteer_id,
                                    opportunity_id=opportunity_id,
                                    invited=True
                                    )
                              participation.save()
                              emails += [volunteer.email]
                              
                        except Exception as e:
                              print("error",e)
                              return Response({'error':str(e)},status=400)
                        
            EmailService.send_invitation_email(
                                    emails=emails,
                                    opportunity_title=participation.opportunity.title,
                                    opportunity_description=participation.opportunity.description,
                                    opportunity_start_date=participation.opportunity.date_of_opportunity,
                                    opportunity_duration=participation.opportunity.duration,
                                    opportunity_wilaya=participation.opportunity.wilaya,
                                    opportunity_url=f"{settings.FRONTEND_URL}/opportunities/{participation.opportunity.id}",
                                    custom_message=request.data.get('custom_message',''),
                                    
                              )

            
                  
            return Response({'success':True},status=200)
      

class AcceptInvitation(APIView):
      
      def post(self,request,participation_id):
            participation = Participation.objects.get(id=participation_id)
            
            if participation.volunteer != request.user.volunteer:
                  return Response({'error':'You are not allowed to perform this action'},status=403)
            
            participation.invite_accepted = True
            participation.save()
            
            return Response({'success':True},status=200)
            