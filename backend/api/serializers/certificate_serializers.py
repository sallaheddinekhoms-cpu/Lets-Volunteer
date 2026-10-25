from rest_framework import serializers
from ..models import Certificate


class CertificateActivitySerializer(serializers.Serializer):
      title = serializers.CharField(max_length=150)
      date = serializers.DateField(required=False, allow_null=True)


class CertificateSerializer(serializers.ModelSerializer):
      activities = CertificateActivitySerializer(many=True, required=False)
      skills = serializers.ListField(
            child=serializers.CharField(max_length=60), required=False, max_length=6
      )

      class Meta:
            model = Certificate
            fields = ['id', 'serial_number', 'place_of_birth', 'activities', 'skills', 'hours',
                      'partners', 'issued_at', 'sent_at']
            read_only_fields = ['id', 'serial_number', 'issued_at', 'sent_at']

      def validate_activities(self, value):
            if len(value) > 3:
                  raise serializers.ValidationError("A certificate can list at most 3 activities.")
            return [
                  {'title': a['title'], 'date': a['date'].isoformat() if a.get('date') else ''}
                  for a in value
            ]


class CertificateSummarySerializer(serializers.ModelSerializer):
      class Meta:
            model = Certificate
            fields = ['id', 'serial_number', 'issued_at', 'sent_at']


class CertificateVerifySerializer(serializers.ModelSerializer):
      volunteer_name = serializers.SerializerMethodField()
      organization_name = serializers.CharField(source='participation.opportunity.organization.organization_name')
      opportunity_title = serializers.CharField(source='participation.opportunity.title')

      class Meta:
            model = Certificate
            fields = ['serial_number', 'volunteer_name', 'organization_name', 'opportunity_title',
                      'hours', 'activities', 'skills', 'issued_at']

      def get_volunteer_name(self, obj):
            volunteer = obj.participation.volunteer
            return f"{volunteer.first_name or ''} {volunteer.last_name or ''}".strip()
