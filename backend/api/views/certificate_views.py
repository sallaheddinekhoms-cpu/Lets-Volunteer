from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.certificate_pdf import generate_certificate_pdf
from api.services import EmailService
from users.models import Profile
from ..models import Certificate, Participation
from ..serializers.certificate_serializers import CertificateSerializer, CertificateVerifySerializer


def _is_participation_organization(user, participation):
      return user.is_staff or (
            user.role == Profile.Role.ORGANIZATION
            and participation.opportunity.organization_id == user.id
      )


def _can_view(user, participation):
      return _is_participation_organization(user, participation) or participation.volunteer_id == user.id


class ParticipationCertificate(APIView):
      """GET: current certificate (+ defaults to prefill the form).
      POST: organization issues / re-issues the certificate and emails it to the volunteer."""
      permission_classes = [IsAuthenticated]

      def _get_participation(self, pk):
            return get_object_or_404(
                  Participation.objects.select_related('volunteer', 'opportunity__organization'), pk=pk
            )

      def get(self, request, pk):
            participation = self._get_participation(pk)
            if not _can_view(request.user, participation):
                  return Response({'error': 'You are not allowed to perform this action'}, status=403)

            certificate = Certificate.objects.filter(participation=participation).first()
            opportunity = participation.opportunity
            defaults = {
                  'place_of_birth': participation.volunteer.wilaya or '',
                  'activities': [{
                        'title': opportunity.title,
                        'date': opportunity.date_of_opportunity.isoformat() if opportunity.date_of_opportunity else '',
                  }],
                  'skills': list(participation.volunteer.skills.values_list('skill__name', flat=True)[:6]),
                  'hours': participation.hours_worked or 0,
                  'partners': '',
            }
            return Response({
                  'certificate': CertificateSerializer(certificate).data if certificate else None,
                  'defaults': defaults,
            })

      def post(self, request, pk):
            participation = self._get_participation(pk)
            if not _is_participation_organization(request.user, participation):
                  return Response({'error': 'Only the organization of this opportunity can issue a certificate'}, status=403)
            if participation.status != Participation.StatusChoices.DONE:
                  return Response({'error': 'The participation must be completed before issuing a certificate'}, status=400)

            certificate = Certificate.objects.filter(participation=participation).first()
            serializer = CertificateSerializer(certificate, data=request.data, partial=certificate is not None)
            serializer.is_valid(raise_exception=True)
            certificate = serializer.save(participation=participation)

            pdf_bytes = generate_certificate_pdf(certificate)
            EmailService.send_certificate_email(certificate, pdf_bytes)
            certificate.sent_at = timezone.now()
            certificate.save(update_fields=['sent_at'])

            return Response(CertificateSerializer(certificate).data, status=status.HTTP_200_OK)


class CertificateDownload(APIView):
      permission_classes = [IsAuthenticated]

      def get(self, request, pk):
            certificate = get_object_or_404(
                  Certificate.objects.select_related(
                        'participation__volunteer', 'participation__opportunity__organization'
                  ), pk=pk
            )
            if not _can_view(request.user, certificate.participation):
                  return Response({'error': 'You are not allowed to perform this action'}, status=403)

            response = HttpResponse(generate_certificate_pdf(certificate), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="certificate-{certificate.serial_number}.pdf"'
            return response


class CertificateVerify(APIView):
      """Public: lets anyone scanning the QR code confirm the certificate is genuine."""
      permission_classes = [AllowAny]
      authentication_classes = []

      def get(self, request, serial_number):
            certificate = get_object_or_404(
                  Certificate.objects.select_related(
                        'participation__volunteer', 'participation__opportunity__organization'
                  ), serial_number=serial_number
            )
            return Response(CertificateVerifySerializer(certificate).data)
