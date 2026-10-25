from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid
from .managers import CustomUserManager
from datetime import date, timedelta
from django.core.exceptions import ValidationError


class Profile(AbstractUser):
      class Role(models.TextChoices):
            ADMIN = 'ADMIN', _('Admin')
            VOLUNTEER = 'VOLUNTEER' , _('Volunteer')
            ORGANIZATION = 'ORGANIZATION' , _('Organization')


      username = None
      id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
      first_name = models.CharField(max_length=100, null=True , blank=True)
      last_name = models.CharField(max_length=100, null=True , blank=True)
      email = models.EmailField(unique=True)
      wilaya = models.CharField(max_length=100, null=True , blank=True)
      daira = models.CharField(max_length=100, null=True , blank=True)
      phone_number = models.CharField(max_length=10, null=True , blank=True)
      password = models.CharField(max_length=100)
      role = models.CharField(max_length=50, choices=Role.choices, default=Role.VOLUNTEER)
      is_active = models.BooleanField(default=True)
      created_at = models.DateTimeField(auto_now_add=True)


      email_verification_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True , blank=True)
      email_verified = models.BooleanField(default=False)
      
      password_reset_token = models.UUIDField(null=True, blank=True)
      password_reset_token_created_at = models.DateTimeField(null=True, blank=True)



      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = []

      objects = CustomUserManager()


      def __str__(self):
              return self.email

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
  
  
class VolunteerSkill(models.Model):
    volunteer = models.ForeignKey("Volunteer", on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('volunteer', 'skill')

class Volunteer(Profile):
      avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
      date_of_birth = models.DateField(null=True,blank=True)
      blood_group = models.CharField(max_length=10, null=True, blank=True)
      imported = models.BooleanField(default=False)
      is_first_login = models.BooleanField(default=True)


      class Meta:
            verbose_name = 'Volunteer'
            verbose_name_plural = 'Volunteers'
      

      def save(self, *args, **kwargs):
            self.role = Profile.Role.VOLUNTEER
            super().save(*args, **kwargs)

      def __str__(self):
             return f"{self.first_name} {self.last_name} Volunteer"


class Organization(Profile):
      organization_name = models.CharField(max_length=100)
      description = models.TextField(null=True, blank=True)
      facebook = models.CharField(max_length=100, null=True, blank=True)
      instagram = models.CharField(max_length=100, null=True, blank=True)
      website = models.CharField(max_length=100, null=True, blank=True)
      logo = models.ImageField(upload_to='logos/', null=True, blank=True)
      approval_id = models.CharField(max_length=100, null=True, blank=True)
      president_name = models.CharField(max_length=100, null=True, blank=True)
      approval_date  = models.DateField(null=True, blank=True)
      is_confirmed = models.BooleanField(default=False)
      
      
      
      
      

      class Meta:
            verbose_name = 'Organization'
            verbose_name_plural = 'Organizations'



      def save(self, *args, **kwargs):
            if self.approval_date:
                  if self.approval_date + timedelta(days=4*365) < date.now().date():
                        raise ValidationError("Approval date cannot be more than 4 years old.")                  
                  
            self.role = Profile.Role.ORGANIZATION
            super().save(*args, **kwargs)

      def __str__(self):
             return f"{self.organization_name} Organization"
      



