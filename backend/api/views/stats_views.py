from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, F, Q , Sum , ExpressionWrapper, FloatField
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from ..serializers.stats_serializers import VolunteerStatsSerializer
from users.models import Volunteer
from ..models import Participation
from ..models import Category
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, F, Max, OuterRef, Subquery
from django.utils import timezone
from datetime import timedelta
from users.models import Volunteer
from api.models import Participation
from ..serializers.stats_serializers import TopVolunteerSerializer

class VolunteerStatsView(generics.RetrieveAPIView):
      # permission_classes = [IsAuthenticated]
      serializer_class = VolunteerStatsSerializer
      
      
      def get_queryset(self):
            return Volunteer.objects.annotate(
                  total_hours = Coalesce(
                        Sum('participations__hours_worked',
                            filter=Q(participations__status=Participation.StatusChoices.DONE)
                            ),
                        0
                  ),
                  average_rating = Coalesce(
                        Avg('participations__rating',
                            filter=Q(participations__status=Participation.StatusChoices.DONE)
                            ),
                        0,
                        output_field=FloatField()
                  ),
                  participation_rate = ExpressionWrapper(
                        Coalesce(
                              Count('participations',
                                    filter=Q(participations__status=Participation.StatusChoices.DONE)
                                    ) * 100.0 / Count('participations'),
                              0
                        ),
                        output_field=FloatField()
                  )
                  
                  
            )
      
      def retrieve(self, request, *args, **kwargs):
            instance = self.get_object()
            

            top_categories = Category.objects.filter(
            opportunity__participations__volunteer=instance,
            opportunity__participations__status=Participation.StatusChoices.DONE
            ).annotate(
            participation_count=Count('opportunity')
            ).order_by('-participation_count')[:5].values_list('label', flat=True)


            recent_feedback = instance.participations.filter(
            organization_feedback__isnull=False
            ).order_by('-completed_at')[:5].values(
            'organization_feedback',
            'rating',
            'opportunity__title',
            'completed_at'
            )

            serializer = self.get_serializer(instance)
            data = serializer.data
            data['top_categories'] = list(top_categories)
            data['recent_feedback'] = list(recent_feedback)

            return Response(data)
      



class TopVolunteersView(APIView):
    def get(self, request):
        # Get current date for time-based filtering
        now = timezone.now()
        
        # Weekly range - last 7 days
        week_start = now - timedelta(days=7)
        
        # Monthly range - last 30 days
        month_start = now - timedelta(days=30)
        
        # Get latest feedback subquery
        latest_feedback_subquery = Participation.objects.filter(
            volunteer=OuterRef('pk'),
            organization_feedback__isnull=False
        ).order_by('-completed_at').values('organization_feedback')[:1]
        
        # Get weekly top volunteers
        weekly_volunteers = self._get_top_volunteers(
            start_date=week_start,
            end_date=now,
            limit=5,
            feedback_subquery=latest_feedback_subquery
        )
        
        # Get monthly top volunteers
        monthly_volunteers = self._get_top_volunteers(
            start_date=month_start,
            end_date=now,
            limit=5,
            feedback_subquery=latest_feedback_subquery
        )
        
        # Get all-time top volunteers
        all_time_volunteers = self._get_top_volunteers(
            start_date=None,
            end_date=None,
            limit=5,
            feedback_subquery=latest_feedback_subquery
        )
        
        return Response({
            'weekly_volunteers': weekly_volunteers,
            'monthly_volunteers': monthly_volunteers,
            'all_time_volunteers': all_time_volunteers
        })
    
    def _get_top_volunteers(self, feedback_subquery, start_date=None, end_date=None, limit=5):
        # Base query for volunteers with completed participations
        volunteer_query = Volunteer.objects.filter(
            participations__status=Participation.StatusChoices.DONE
        )
        
        # Filter by date range if provided
        participation_filter = {}
        if start_date:
            participation_filter['participations__completed_at__gte'] = start_date
        if end_date:
            participation_filter['participations__completed_at__lte'] = end_date
            
        if participation_filter:
            volunteer_query = volunteer_query.filter(**participation_filter)
        
        # Get volunteers with total hours worked, average rating, and latest feedback
        top_volunteers = volunteer_query.annotate(
            hours=Sum('participations__hours_worked'),
            rating=Avg('participations__rating'),
            latest_feedback=Subquery(feedback_subquery)
        ).distinct().order_by('-hours')[:limit]
        
        # Serialize the data
        serializer = TopVolunteerSerializer(top_volunteers, many=True)
        return serializer.data