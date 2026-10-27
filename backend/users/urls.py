from django.urls import path
from .views import RegisterVolunteer, RegisterOrganization, RequestPasswordResetView, ResetPasswordView, VerifyEmailView, LoginView
from .social_auth_views import GoogleAuthView, FacebookAuthView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Social Auth (Google & Facebook)
    path('social/google/', GoogleAuthView.as_view(), name='social-google'),
    path('social/facebook/', FacebookAuthView.as_view(), name='social-facebook'),

    path('volunteer/register/', RegisterVolunteer.as_view(), name='register-volunteer'),
    path('organization/register/', RegisterOrganization.as_view(), name='register-organization'),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify_email'),
    
    path('password-reset/request/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', ResetPasswordView.as_view(), name='password-reset-confirm'),
]
