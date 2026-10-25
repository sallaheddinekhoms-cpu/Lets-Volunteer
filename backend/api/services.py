
from datetime import timezone
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from users.utils import send_mail_async



class EmailService:
      
      @staticmethod
      def send_confirmation_email(email ,**kwargs):
            context = {
                  'name': kwargs.get('name', email),
                  'verification_url': f"{settings.FRONTEND_URL}/verify-email/{kwargs.get('email_verification_token')}",
                  'logo_url': f"{settings.FRONTEND_URL}/black_logo.svg"
            }
            
            html_message = render_to_string('emails/verification_email.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail_async(
                  'تأكيد البريد الإلكتروني - لنتطوع',
                  plain_message,
                  settings.DEFAULT_FROM_EMAIL,
                  [email],
                  html_message=html_message,
            )
            
      @staticmethod
      def send_invitation_email(emails, **kwargs):
            context = {
                  'logo_url': f"{settings.FRONTEND_URL}/black_logo.svg",
                  'opportunity_title': kwargs.get('opportunity_title', ''),
                  'opportunity_description': kwargs.get('opportunity_description', ''),
                  'opportunity_start_date': kwargs.get('opportunity_start_date', ''),
                  'opportunity_duration': kwargs.get('opportunity_duration', ''),
                  'opportunity_location': kwargs.get('opportunity_location', ''),
                  'opportunity_skills': kwargs.get('opportunity_skills', ''),
                  'opportunity_url': kwargs.get('opportunity_url', ''),
                  'custom_message': kwargs.get('custom_message', ''),
                  # Social media links (optional)
                  'facebook_url': kwargs.get('facebook_url', ''),
                  'twitter_url': kwargs.get('twitter_url', ''),
                  'instagram_url': kwargs.get('instagram_url', ''),
                  'linkedin_url': kwargs.get('linkedin_url', '')
            }
            
            html_message = render_to_string('emails/invite_email.html', context)
            plain_message = strip_tags(html_message)
            
            
            send_mail_async(
                  'دعوة للمشاركة في فرصة تطوع - لنتطوع',
                  plain_message,
                  settings.DEFAULT_FROM_EMAIL,
                  emails,
                  html_message=html_message,
            )
      @staticmethod
      def send_certificate_email(certificate, pdf_bytes):
            participation = certificate.participation
            volunteer = participation.volunteer
            context = {
                  'logo_url': f"{settings.FRONTEND_URL}/black_logo.svg",
                  'volunteer_name': f"{volunteer.first_name or ''} {volunteer.last_name or ''}".strip(),
                  'organization_name': participation.opportunity.organization.organization_name,
                  'opportunity_title': participation.opportunity.title,
                  'hours': certificate.hours,
                  'serial_number': certificate.serial_number,
                  'certificates_url': f"{settings.FRONTEND_URL}/profile",
                  'verify_url': f"{settings.FRONTEND_URL}/certificates/verify/{certificate.serial_number}",
            }

            html_message = render_to_string('emails/certificate_email.html', context)
            plain_message = strip_tags(html_message)

            send_mail_async(
                  'شهادة التطوع الخاصة بك - لنتطوع',
                  plain_message,
                  settings.DEFAULT_FROM_EMAIL,
                  [volunteer.email],
                  html_message=html_message,
                  attachments=[(f"certificate-{certificate.serial_number}.pdf", pdf_bytes, "application/pdf")],
            )
