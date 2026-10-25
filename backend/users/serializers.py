from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import  Profile, Volunteer, Organization , Skill
from django.conf import settings
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .utils import send_mail_async



class VolunteerSerializer(serializers.ModelSerializer):
    

      class Meta:
            model = Volunteer
            fields = ['first_name','last_name','blood_group','email','wilaya','daira','phone_number','password','role','is_active','date_of_birth']
            extra_kwargs = {
                  'password': {'write_only': True},
                  'role': {'read_only': True},
                  'is_active': {'read_only': True},
            }

      def validate_email(self, value):
            print("validating email")
            existing_users = Volunteer.objects.filter(email=value , email_verified=False)
            if existing_users.exists():
                  print("deleting")
                  existing_users.delete()
            
            if Volunteer.objects.filter(email=value, email_verified=True).exists():
                  raise ValidationError("This email is already registered and verified.")
                  
            return value


            

      def create(self, validated_data):
            user = Volunteer.objects.create_user(**validated_data)
            self.send_verification_email(user)
            return user

      def send_verification_email(self, user):
            context = {
                  'name': getattr(user, 'first_name', user.email),
                  'verification_url': f"{settings.FRONTEND_URL}/verify-email/{user.email_verification_token}",
                  'logo_url': f"{settings.FRONTEND_URL}/black_logo.svg"
            }
            print("sending email to", user.email)
            html_message = render_to_string('emails/verification_email.html', context)
            plain_message = strip_tags(html_message)

            send_mail_async(
                  'تأكيد البريد الإلكتروني - لنتطوع',
                  plain_message,
                  settings.DEFAULT_FROM_EMAIL,
                  [user.email],
                  html_message=html_message,
            )

class OrganizationSerializer(serializers.ModelSerializer):

      class Meta:
            model = Organization
            fields = ['email','wilaya','daira','phone_number','password','role',
                      'is_active','organization_name','approval_id','president_name','is_confirmed']
            extra_kwargs = {
                  'password': {'write_only': True},
                  'role': {'read_only': True},
                  'is_active': {'read_only': True},
                  'is_confirmed': {'read_only': True},
            }

      def validate_email(self, value):
            existing_users = Organization.objects.filter(email=value , email_verified=False)
            if existing_users.exists():
                  existing_users.delete()
            
            if Organization.objects.filter(email=value, email_verified=True).exists():
                  raise ValidationError("This email is already registered and verified.")
      
            return value
      
      def create(self, validated_data):
            print("creating organization")
            user = Organization.objects.create_user(**validated_data)
            self.send_verification_email(user)
            return user
      
      def send_verification_email(self, user):
            context = {
                  'name': getattr(user, '', user.email),
                  'verification_url': f"{settings.FRONTEND_URL}/verify-email/{user.email_verification_token}",
                  'logo_url': f"{settings.FRONTEND_URL}/black_logo.svg"
            }
            
            html_message = render_to_string('emails/verification_email.html', context)
            plain_message = strip_tags(html_message)

            send_mail_async(
                  'تأكيد البريد الإلكتروني - لنتطوع',
                  plain_message,
                  settings.DEFAULT_FROM_EMAIL,
                  [user.email],
                  html_message=html_message,
            )

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']
        
        
class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Check if user with this email exists
        if not Profile.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value
 
from datetime import timedelta
from django.utils import timezone

class PasswordResetSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Validate that passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords don't match."})
        
        
        
        # Validate token
        try:
            user = Profile.objects.get(password_reset_token=data['token'])
            
            # Check if token is expired (24 hours)
            if not user.password_reset_token_created_at or user.password_reset_token_created_at + timedelta(hours=24) < timezone.now():
                raise serializers.ValidationError({"token": "Reset token has expired."})
                
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid reset token."})
            
        return data