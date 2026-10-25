from django.urls import path
from .views import (
    DashboardStatsAPIView,
    VolunteerStatsAPIView,
    OrganizationStatsAPIView,
    OpportunityStatsAPIView,
    ParticipationStatsAPIView,
    AidStatsAPIView,
    PDFReportAPIView
)

urlpatterns = [
    path('dashboard/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('volunteers/', VolunteerStatsAPIView.as_view(), name='volunteer-stats'),
    path('organizations/', OrganizationStatsAPIView.as_view(), name='organization-stats'),
    path('opportunities/', OpportunityStatsAPIView.as_view(), name='opportunity-stats'),
    path('participations/', ParticipationStatsAPIView.as_view(), name='participation-stats'),
    path('aids/', AidStatsAPIView.as_view(), name='aid-stats'),
    path('pdf-report/', PDFReportAPIView.as_view(), name='pdf-report'),
]