from unittest import mock

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import Organization, Volunteer
from .models import Certificate, Opportunity, Participation


@mock.patch("api.views.certificate_views.EmailService.send_certificate_email")
class CertificateTests(TestCase):

      def setUp(self):
            self.org = Organization.objects.create(
                  email="org@test.dz", organization_name="جمعية الاختبار", president_name="Ali", wilaya="Setif"
            )
            self.other_org = Organization.objects.create(email="other@test.dz", organization_name="Other")
            self.volunteer = Volunteer.objects.create(email="vol@test.dz", first_name="Amina", last_name="B")
            self.opportunity = Opportunity.objects.create(
                  title="حملة تنظيف", description="d", organization=self.org, wilaya="Setif", daira="Setif"
            )
            self.participation = Participation.objects.create(
                  opportunity=self.opportunity, volunteer=self.volunteer, status="done", hours_worked=12
            )
            self.url = f"/api/participation/{self.participation.id}/certificate/"
            self.payload = {
                  "place_of_birth": "Setif",
                  "activities": [{"title": "حملة تنظيف", "date": "2026-03-14"}],
                  "skills": ["العمل الجماعي"],
                  "hours": 12,
                  "partners": "الهلال الأحمر",
            }

      def client_for(self, user):
            client = APIClient()
            client.force_authenticate(user)
            return client

      def test_organization_issues_and_emails_certificate(self, send_email):
            res = self.client_for(self.org).post(self.url, self.payload, format="json")

            self.assertEqual(res.status_code, 200, res.data)
            certificate = Certificate.objects.get(participation=self.participation)
            self.assertTrue(certificate.serial_number.startswith("LV-"))
            self.assertIsNotNone(certificate.sent_at)
            send_email.assert_called_once()
            self.assertTrue(send_email.call_args[0][1].startswith(b"%PDF"))

      def test_resend_keeps_serial_number(self, send_email):
            client = self.client_for(self.org)
            first = client.post(self.url, self.payload, format="json").data["serial_number"]
            second = client.post(self.url, {"hours": 20}, format="json").data

            self.assertEqual(second["serial_number"], first)
            self.assertEqual(second["hours"], 20)
            self.assertEqual(Certificate.objects.count(), 1)

      def test_requires_completed_participation(self, send_email):
            self.participation.status = "accepted"
            self.participation.save()

            res = self.client_for(self.org).post(self.url, self.payload, format="json")
            self.assertEqual(res.status_code, 400)
            send_email.assert_not_called()

      def test_only_owning_organization_can_issue(self, send_email):
            self.assertEqual(self.client_for(self.other_org).post(self.url, self.payload, format="json").status_code, 403)
            self.assertEqual(self.client_for(self.volunteer).post(self.url, self.payload, format="json").status_code, 403)

      def test_volunteer_downloads_pdf_and_others_cannot(self, send_email):
            self.client_for(self.org).post(self.url, self.payload, format="json")
            certificate = Certificate.objects.get()
            download_url = f"/api/certificates/{certificate.id}/download/"

            res = self.client_for(self.volunteer).get(download_url)
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res["Content-Type"], "application/pdf")
            self.assertTrue(res.content.startswith(b"%PDF"))

            self.assertEqual(self.client_for(self.other_org).get(download_url).status_code, 403)

      def test_participation_list_exposes_certificate(self, send_email):
            self.client_for(self.org).post(self.url, self.payload, format="json")
            res = self.client_for(self.volunteer).get("/api/participation/")
            self.assertEqual(res.data["results"][0]["certificate"]["serial_number"], Certificate.objects.get().serial_number)

      def test_public_verification(self, send_email):
            self.client_for(self.org).post(self.url, self.payload, format="json")
            serial = Certificate.objects.get().serial_number

            res = APIClient().get(f"/api/certificates/verify/{serial}/")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.data["volunteer_name"], "Amina B")
            self.assertEqual(APIClient().get("/api/certificates/verify/LV-NOPE/").status_code, 404)
