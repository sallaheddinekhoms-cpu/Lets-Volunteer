import logging
import threading

from .models import Profile, Volunteer , Organization

logger = logging.getLogger(__name__)


def send_mail_async(subject, message, from_email, recipient_list, html_message=None, attachments=None):
      """Send email on a background thread so a slow/unreachable SMTP server
      never blocks the request worker (and risks a gunicorn WORKER TIMEOUT).
      `attachments` is a list of (filename, content, mimetype) tuples."""
      def _send():
            from django.core.mail import EmailMultiAlternatives
            try:
                  email = EmailMultiAlternatives(subject, message, from_email, recipient_list, attachments=attachments)
                  if html_message:
                        email.attach_alternative(html_message, "text/html")
                  email.send(fail_silently=False)
            except Exception:
                  logger.exception("Failed to send email to %s", recipient_list)

      threading.Thread(target=_send, daemon=True).start()


class Utils :
      @staticmethod
      def get_user_type(user_type):
            if user_type == 'volunteer':
                  return Volunteer
            elif user_type == 'organization':
                  return Organization
            elif user_type == 'admin':
                  return Profile
            else:
                  return None