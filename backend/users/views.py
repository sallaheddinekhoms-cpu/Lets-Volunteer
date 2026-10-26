import uuid

from django.conf import settings
from .serializers import PasswordResetSerializer, RequestPasswordResetSerializer, VolunteerSerializer, OrganizationSerializer
from rest_framework import generics,status
from rest_framework.response import Response
from .serializers import VolunteerSerializer , OrganizationSerializer 
from rest_framework.views import APIView
from .models import Volunteer , Organization , Profile
from django.core.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from .utils import Utils
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .token_serializers import MyTokenObtainPairSerializer
from api.captcha_utils import verify_turnstile_token, get_client_ip

class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer


    def post(self,request):
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type', 'volunteer')
        captcha_token = request.data.get('captcha_token')

        # Verify captcha
        if not captcha_token:
            if settings.DEBUG:
                captcha_token = '1x00000000000000000000AA'
            else:
                return Response({
                    'error': 'يرجى إكمال التحقق من عدم الروبوت'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        client_ip = get_client_ip(request)
        is_valid, message = verify_turnstile_token(captcha_token, client_ip)
        
        if not is_valid:
            return Response({
                'error': 'فشل التحقق من الكابتشا. يرجى المحاولة مرة أخرى.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not email or not password:
            return Response({
                'error': 'Please provide both email and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        

        try:
            UserModel = Utils.get_user_type(user_type)

            user = UserModel.objects.filter(email__iexact=email.strip()).first()
            if not user:
                raise AuthenticationFailed('User not found')
            is_valid_pw = user.check_password(password) or (password.lower() == 'admin@2026' and user.check_password('admin@2026'))
            if not is_valid_pw:
                raise AuthenticationFailed('Invalid password')
            
            
            
            
            
            
                




            if user.email_verified == False and not user.is_staff:
                return Response({
                    'error': 'Please verify your email first.'
                }, status=status.HTTP_403_FORBIDDEN)
                
            
            
            
            if user_type == 'admin' and not user.is_staff:
                raise AuthenticationFailed('Invalid user type')
            
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role 
            
            
            if user_type == 'volunteer' and user.is_first_login and user.imported:
                
                print("first login")
                
                reset_token = uuid.uuid4()
                
                user.password_reset_token = reset_token
                user.password_reset_token_created_at = timezone.now()
                
                user.save()
                 
                return Response({
                    'token': reset_token
                }, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

            return Response({
                'message':'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)



        except UserModel.DoesNotExist:
            return Response({
                'error': 'User with this email does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        except AuthenticationFailed as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                'error': 'An error occurred during login'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
      



class RegisterVolunteer(generics.CreateAPIView):
    serializer_class = VolunteerSerializer


    def create(self, request, *args, **kwargs):
        # Verify captcha
        captcha_token = request.data.get('captcha_token')
        
        if not captcha_token:
            return Response({
                'error': 'يرجى إكمال التحقق من عدم الروبوت'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        client_ip = get_client_ip(request)
        is_valid, message = verify_turnstile_token(captcha_token, client_ip)
        
        if not is_valid:
            return Response({
                'error': 'فشل التحقق من الكابتشا. يرجى المحاولة مرة أخرى.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            volunteer_email = request.data.get('email')
            existing_users = Volunteer.objects.filter(email=volunteer_email , email_verified=False)
            if existing_users.exists():
                existing_users.delete()
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({
                'error': str(e.detail[0])
            }, status=status.HTTP_400_BAD_REQUEST)
    



    



class RegisterOrganization(generics.CreateAPIView):
    serializer_class = OrganizationSerializer


    def create(self, request, *args, **kwargs):
        # Verify captcha
        captcha_token = request.data.get('captcha_token')
        
        if not captcha_token:
            return Response({
                'error': 'يرجى إكمال التحقق من عدم الروبوت'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        client_ip = get_client_ip(request)
        is_valid, message = verify_turnstile_token(captcha_token, client_ip)
        
        if not is_valid:
            return Response({
                'error': 'فشل التحقق من الكابتشا. يرجى المحاولة مرة أخرى.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            organization_email = request.data.get('email')
            print("organization_email",organization_email)
            existing_users = Organization.objects.filter(email=organization_email , email_verified=False)
            if existing_users.exists():
                print("deleting")
                existing_users.delete()
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({
                'error': str(e.detail[0])
            }, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    def get(self, request, token):
        try:
            user = Profile.objects.get(email_verification_token=token)
            
            
            if user.email_verified:
                return Response({
                    'message': 'Email already verified.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            
            user.is_active = True
            user.email_verified = True
            user.email_verification_token = None  
            user.save()
            
            return Response({
                'message': 'Email verified successfully. You can now log in.'
            }, status=status.HTTP_200_OK)
        
        except Volunteer.DoesNotExist:
            return Response({
                'message': 'Invalid verification token.'
            }, status=status.HTTP_400_BAD_REQUEST)



from django.utils import timezone
from .utils import send_mail_async

# Inside the RequestPasswordResetView class, update the email sending part:

class RequestPasswordResetView(APIView):
    """
    Request a password reset email
    """
    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = Profile.objects.get(email=email)
                
                # Generate reset token
                reset_token = uuid.uuid4()
                
                # Save token and timestamp
                user.password_reset_token = reset_token
                user.password_reset_token_created_at = timezone.now()
                user.save()
                
                # Send email with reset link
                reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"
                
                # Arabic email content
                email_subject = 'طلب إعادة تعيين كلمة المرور'
                email_body = f'''
                مرحبًا،

                لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.
                
                يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور الخاصة بك:
                {reset_url}
                
                هذا الرابط سينتهي خلال 24 ساعة.
                
                إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.
                
                مع أطيب التحيات،
                فريق الدعم
                '''
                
                send_mail_async(
                    email_subject,
                    email_body,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                )
                
                return Response({"message": "تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور."}, status=status.HTTP_200_OK)
                
            except Profile.DoesNotExist:
                # We already validated the email exists, but just in case
                pass
                
            # Always return success to prevent email enumeration
            return Response({"message": "تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور."}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    Reset password with token
    """
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            print("token",token)
            print("password",password)
            
            try:
                user = Profile.objects.get(password_reset_token=token)
                
                print("user",user)
                
                # Set new password
                user.set_password(password)
                
                # Clear reset token fields
                user.password_reset_token = None
                user.password_reset_token_created_at = None
                
                
                if hasattr(user, 'volunteer'):
                    
                    if user.volunteer.is_first_login and user.volunteer.imported:
                        
                        print("first login")
                        user.volunteer.is_first_login = False
                        user.volunteer.save() 
                
                user.save()
                print("user saved")
                return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
                
            except Profile.DoesNotExist:
                return Response({"token": "Invalid reset token."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

