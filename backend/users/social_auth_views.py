import logging
import secrets
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Volunteer, Profile

logger = logging.getLogger(__name__)


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        id_token_str = request.data.get('id_token')
        access_token_str = request.data.get('access_token')
        redirect_uri = request.data.get('redirect_uri')
        user_type = request.data.get('user_type', 'volunteer')
        is_mock = request.data.get('is_mock', False)

        email = None
        first_name = ""
        last_name = ""
        picture = ""

        # Handle Mock / Dev bypass when DEBUG is True
        if is_mock and settings.DEBUG:
            email = request.data.get('email', 'google.volunteer@example.com')
            first_name = request.data.get('first_name', 'متطوع جوجل')
            last_name = request.data.get('last_name', 'التجريبي')
        elif code:
            client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
            client_secret = getattr(settings, 'GOOGLE_CLIENT_SECRET', None)
            
            if not client_id or not client_secret:
                # In debug mode without keys configured yet, give friendly fallback or instructions
                if settings.DEBUG:
                    email = request.data.get('email', 'google.volunteer@example.com')
                    first_name = request.data.get('first_name', 'متطوع جوجل')
                    last_name = request.data.get('last_name', 'التجريبي')
                else:
                    return Response({
                        'error': 'Google OAuth credentials not configured on server'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Exchange authorization code for tokens
                token_url = "https://oauth2.googleapis.com/token"
                token_data = {
                    'code': code,
                    'client_id': client_id,
                    'client_secret': client_secret,
                    'redirect_uri': redirect_uri,
                    'grant_type': 'authorization_code'
                }
                try:
                    token_resp = requests.post(token_url, data=token_data, timeout=10)
                    if token_resp.status_code != 200:
                        logger.error("Google token exchange error: %s", token_resp.text)
                        return Response({
                            'error': 'فشل التحقق من رمز Google',
                            'details': token_resp.json()
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    tokens = token_resp.json()
                    google_access_token = tokens.get('access_token')
                    
                    # Fetch profile info
                    userinfo_resp = requests.get(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
                        headers={'Authorization': f'Bearer {google_access_token}'},
                        timeout=10
                    )
                    if userinfo_resp.status_code != 200:
                        return Response({
                            'error': 'فشل جلب بيانات الحساب من Google'
                        }, status=status.HTTP_400_BAD_REQUEST)

                    info = userinfo_resp.json()
                    email = info.get('email')
                    first_name = info.get('given_name') or (info.get('name', '').split(' ')[0] if info.get('name') else 'متطوع')
                    last_name = info.get('family_name') or (' '.join(info.get('name', '').split(' ')[1:]) if info.get('name') else '')
                    picture = info.get('picture', '')
                except Exception as e:
                    logger.exception("Google OAuth exception")
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif id_token_str or access_token_str:
            try:
                if id_token_str:
                    userinfo_resp = requests.get(
                        f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token_str}",
                        timeout=10
                    )
                else:
                    userinfo_resp = requests.get(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
                        headers={'Authorization': f'Bearer {access_token_str}'},
                        timeout=10
                    )
                if userinfo_resp.status_code != 200:
                    return Response({'error': 'رمز Google غير صالح'}, status=status.HTTP_400_BAD_REQUEST)
                info = userinfo_resp.json()
                email = info.get('email')
                first_name = info.get('given_name') or (info.get('name', '').split(' ')[0] if info.get('name') else 'متطوع')
                last_name = info.get('family_name') or (' '.join(info.get('name', '').split(' ')[1:]) if info.get('name') else '')
                picture = info.get('picture', '')
            except Exception as e:
                logger.exception("Google token validation error")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'بيانات المصادقة مطلوبة'}, status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response({'error': 'تعذر الحصول على البريد الإلكتروني من Google'}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create user
        user = Profile.objects.filter(email__iexact=email.strip()).first()
        if user:
            if not user.email_verified:
                user.email_verified = True
                user.save(update_fields=['email_verified'])
        else:
            # Create new Volunteer
            random_password = secrets.token_urlsafe(24)
            user = Volunteer.objects.create_user(
                email=email.strip().lower(),
                password=random_password,
                first_name=first_name[:100] if first_name else 'متطوع',
                last_name=last_name[:100] if last_name else '',
                email_verified=True,
                is_active=True,
                blood_group='A+'
            )

        # Issue SimpleJWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role

        return Response({
            'message': 'تم تسجيل الدخول عبر Google بنجاح',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'picture': picture,
            }
        }, status=status.HTTP_200_OK)


class FacebookAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        access_token_str = request.data.get('access_token')
        redirect_uri = request.data.get('redirect_uri')
        is_mock = request.data.get('is_mock', False)

        email = None
        first_name = ""
        last_name = ""
        picture = ""

        if is_mock and settings.DEBUG:
            email = request.data.get('email', 'facebook.volunteer@example.com')
            first_name = request.data.get('first_name', 'متطوع فيسبوك')
            last_name = request.data.get('last_name', 'التجريبي')
        elif code:
            app_id = getattr(settings, 'FACEBOOK_APP_ID', None)
            app_secret = getattr(settings, 'FACEBOOK_APP_SECRET', None)

            if not app_id or not app_secret:
                if settings.DEBUG:
                    email = request.data.get('email', 'facebook.volunteer@example.com')
                    first_name = request.data.get('first_name', 'متطوع فيسبوك')
                    last_name = request.data.get('last_name', 'التجريبي')
                else:
                    return Response({
                        'error': 'Facebook App credentials not configured on server'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                token_url = "https://graph.facebook.com/v19.0/oauth/access_token"
                params = {
                    'client_id': app_id,
                    'client_secret': app_secret,
                    'redirect_uri': redirect_uri,
                    'code': code
                }
                try:
                    resp = requests.get(token_url, params=params, timeout=10)
                    if resp.status_code != 200:
                        logger.error("Facebook token exchange error: %s", resp.text)
                        return Response({
                            'error': 'فشل التحقق من رمز Facebook',
                            'details': resp.json()
                        }, status=status.HTTP_400_BAD_REQUEST)
                    data = resp.json()
                    fb_token = data.get('access_token')

                    # Fetch user profile
                    profile_resp = requests.get(
                        "https://graph.facebook.com/me",
                        params={'fields': 'id,name,first_name,last_name,email,picture.type(large)', 'access_token': fb_token},
                        timeout=10
                    )
                    if profile_resp.status_code != 200:
                        return Response({'error': 'فشل جلب بيانات الحساب من Facebook'}, status=status.HTTP_400_BAD_REQUEST)
                    info = profile_resp.json()
                    email = info.get('email') or f"fb_{info.get('id')}@facebook.letsvolunteer.dz"
                    first_name = info.get('first_name') or (info.get('name', '').split(' ')[0] if info.get('name') else 'متطوع')
                    last_name = info.get('last_name') or (' '.join(info.get('name', '').split(' ')[1:]) if info.get('name') else '')
                    picture = info.get('picture', {}).get('data', {}).get('url', '')
                except Exception as e:
                    logger.exception("Facebook OAuth exception")
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif access_token_str:
            try:
                profile_resp = requests.get(
                    "https://graph.facebook.com/me",
                    params={'fields': 'id,name,first_name,last_name,email,picture.type(large)', 'access_token': access_token_str},
                    timeout=10
                )
                if profile_resp.status_code != 200:
                    return Response({'error': 'رمز Facebook غير صالح'}, status=status.HTTP_400_BAD_REQUEST)
                info = profile_resp.json()
                email = info.get('email') or f"fb_{info.get('id')}@facebook.letsvolunteer.dz"
                first_name = info.get('first_name') or (info.get('name', '').split(' ')[0] if info.get('name') else 'متطوع')
                last_name = info.get('last_name') or (' '.join(info.get('name', '').split(' ')[1:]) if info.get('name') else '')
                picture = info.get('picture', {}).get('data', {}).get('url', '')
            except Exception as e:
                logger.exception("Facebook token validation error")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'بيانات المصادقة مطلوبة'}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create user
        user = Profile.objects.filter(email__iexact=email.strip()).first()
        if user:
            if not user.email_verified:
                user.email_verified = True
                user.save(update_fields=['email_verified'])
        else:
            random_password = secrets.token_urlsafe(24)
            user = Volunteer.objects.create_user(
                email=email.strip().lower(),
                password=random_password,
                first_name=first_name[:100] if first_name else 'متطوع',
                last_name=last_name[:100] if last_name else '',
                email_verified=True,
                is_active=True,
                blood_group='A+'
            )

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role

        return Response({
            'message': 'تم تسجيل الدخول عبر Facebook بنجاح',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'picture': picture,
            }
        }, status=status.HTTP_200_OK)
