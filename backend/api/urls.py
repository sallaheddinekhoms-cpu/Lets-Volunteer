from django.urls import path, include

from api.views.admin_utils_views import ContactFormView, DownloadVolunteerTemplateView, ImportExcelView
from api.views.skills_views import SkillListCreateView, SkillRetrieveUpdateDestroyView
from .views.opportunity_views import OpportunityListCreate, OpportunityRetrieveUpdateDestroy
from .views.volunteer_views import VolunteerProfileViewDeleteUpdate, VolunteerProfileList
from .views.organization_views import OrganizationProfileViewUpdate, OrganizationList, OrganizationConfirm, OrganizationUnconfirm
from .views.category_views import CategoryListCreateAPIView, CategoryUpdateDestroyAPIView
from .views.participation_views import AcceptInvitation, InviteVolunteer, ParticipationListCreate, ParticipationRetrieveUpdateDestroy
from .views.aid_views import AidListCreate, AidTypeListCreate, AidTypeRetriveUpdateDestroy, ExcelTemplateDownloadView, ExcelUploadView
from .views.stats_views import VolunteerStatsView, TopVolunteersView
from .views.article_views import ArticleListCreateAPIView, ArticleRetrieveAPIView
from .views.partners_views import PartnerListCreate, PartnerRetrieveUpdateDestroy
from .views.video_views import VideoListCreateView, VideoRetrieveUpdateDestroyView
from .views.announcement_views import AnnouncementListCreateView, AnnouncementRetrieveUpdateDestroyView
from .views.certificate_views import ParticipationCertificate, CertificateDownload, CertificateVerify
from .views.extended_views import (
    ResponsibilityTemplateListView,
    OrganizationContactsView,
    SupportTicketView,
    TrainingCourseListView,
    SolidarityItemListView,
    SolidarityRequestListView,
    AdminSolidarityRequestView,
    OfficialReportPdfView,
)

volunteer_urls = [
    path('volunteer/<str:volunteer_id>/', VolunteerProfileViewDeleteUpdate.as_view(), name='volunteer-profile-update'),
    path('volunteers/', VolunteerProfileList.as_view(), name='volunteer-profile-list'),
]

opportunity_urls = [
    path('opportunities/', OpportunityListCreate.as_view(), name='opportunity-list-create'),
    path('opportunities/<uuid:opportunity_id>/', OpportunityRetrieveUpdateDestroy.as_view(), name='opportunity-retrieve-update-destroy'),
]

organization_urls = [
    path('organization/<uuid:organization_id>/', OrganizationProfileViewUpdate.as_view(), name='organization-list'),
    path('organizations/', OrganizationList.as_view(), name='organization-list'),
    path('organizations/<uuid:organization_id>/confirm/', OrganizationConfirm.as_view(), name='organization-confirm'),
    path('organizations/<uuid:organization_id>/unconfirm/', OrganizationUnconfirm.as_view(), name='organization-unconfirm'),
]

participation_urls = [
    path('participation/<int:pk>/certificate/', ParticipationCertificate.as_view(), name='participation-certificate'),
    path('participation/', ParticipationListCreate.as_view(), name='participation-list-create'),
    path('participation/<str:pk>/', ParticipationRetrieveUpdateDestroy.as_view(), name='participation-retrieve-update-destroy'),
]

category_urls = [
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryUpdateDestroyAPIView.as_view(), name='category-update-destroy'),
]

aid_urls = [
    path('aid/', AidListCreate.as_view(), name='aid-list-create'),   
    path("aid_type/", AidTypeListCreate.as_view(), name='aid-type-list-create'),
    path("aid_type/<int:pk>/", AidTypeRetriveUpdateDestroy.as_view(), name='aid-type-retrieve-update-destroy'),
    path('excel-template/', ExcelTemplateDownloadView.as_view(), name='excel-template-download'),
    path('excel-upload/', ExcelUploadView.as_view(), name='excel-upload'),
]

article_urls = [
    path('articles/', ArticleListCreateAPIView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleRetrieveAPIView.as_view(), name='article-retrieve'),
]

stats_urls = [
    path('volunteer_stats/', VolunteerStatsView.as_view(), name='volunteer-stats'),
    path('top-volunteers/', TopVolunteersView.as_view(), name='top-volunteers'),
]

skills_urls = [
    path('skills/', SkillListCreateView.as_view(), name='skill-list-create'),
    path('skills/<int:pk>/', SkillRetrieveUpdateDestroyView.as_view(), name='skill-retrieve-update-destroy'),
]

utils_urls = [
    path('contact/', ContactFormView.as_view(), name='contact-form'),
    path('download-volunteer-template/', DownloadVolunteerTemplateView.as_view(), name='download-volunteer-template'),
    path('import-volunteers/', ImportExcelView.as_view(), name='import-volunteers'),
]

invitations_urls = [
    path('invitations/accept/', AcceptInvitation.as_view(), name='accept-invitation'),
    path('invitations/invite/', InviteVolunteer.as_view(), name='invite-volunteer'),
]

partners_urls = [
    path('partners/', PartnerListCreate.as_view(), name='partner-list-create'),
    path('partners/<int:pk>/', PartnerRetrieveUpdateDestroy.as_view(), name='partner-retrieve-update-destroy'),
]

video_urls = [
    path('videos/', VideoListCreateView.as_view(), name='video-list-create'),
    path('videos/<int:pk>/', VideoRetrieveUpdateDestroyView.as_view(), name='video-retrieve-update-destroy'),
]

announcement_urls = [
    path('announcements/', AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('announcements/<int:pk>/', AnnouncementRetrieveUpdateDestroyView.as_view(), name='announcement-retrieve-update-destroy'),
]

certificate_urls = [
    path('certificates/<uuid:pk>/download/', CertificateDownload.as_view(), name='certificate-download'),
    path('certificates/verify/<str:serial_number>/', CertificateVerify.as_view(), name='certificate-verify'),
]

extended_urls = [
    path('responsibility-templates/', ResponsibilityTemplateListView.as_view(), name='responsibility-templates'),
    path('organization/contacts/', OrganizationContactsView.as_view(), name='organization-contacts'),
    path('tickets/', SupportTicketView.as_view(), name='support-tickets'),
    path('trainings/', TrainingCourseListView.as_view(), name='training-courses'),
    path('solidarity-store/', SolidarityItemListView.as_view(), name='solidarity-store'),
    path('solidarity-requests/', SolidarityRequestListView.as_view(), name='solidarity-requests'),
    path('admin/solidarity-requests/', AdminSolidarityRequestView.as_view(), name='admin-solidarity-requests'),
    path('admin/solidarity-requests/<uuid:pk>/', AdminSolidarityRequestView.as_view(), name='admin-solidarity-request-detail'),
    path('stats/report/pdf/', OfficialReportPdfView.as_view(), name='stats-report-pdf'),
]

urlpatterns = (
    volunteer_urls +
    opportunity_urls +
    organization_urls +
    participation_urls +
    category_urls + 
    aid_urls +
    article_urls +
    stats_urls +
    skills_urls +
    utils_urls +
    invitations_urls +
    partners_urls +
    video_urls +
    announcement_urls +
    certificate_urls +
    extended_urls
)
