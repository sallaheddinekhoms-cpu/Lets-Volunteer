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
            print("data",serializer.validated_data)
            if self.request.user.role == Profile.Role.VOLUNTEER:
                  serializer.save(volunteer=self.request.user.volunteer)
            serializer.save()
      
     
      
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
            