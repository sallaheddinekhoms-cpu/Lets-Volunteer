from rest_framework import serializers
from ..models import Participation
from .volunteer_serializers import VolunteerProfileSerializer
from .utils_serializers import OpportunityForParticipationSerializer
from .certificate_serializers import CertificateSummarySerializer


class ParticipationCreateserializer(serializers.ModelSerializer):
    volunteer = VolunteerProfileSerializer(read_only=True)

    class Meta:
        model = Participation
        fields = ['id', 'opportunity', 'volunteer']
        read_only_fields = ['id']


class ParticipationListSerializerOrg(serializers.ModelSerializer):
    opportunity = OpportunityForParticipationSerializer(read_only=True)
    volunteer = VolunteerProfileSerializer(read_only=True)
    certificate = CertificateSummarySerializer(read_only=True)

    class Meta:
        model = Participation
        fields = [
            'id', 'opportunity', 'status', 'volunteer', 'rating',
            'organization_feedback', 'volunteer_feedback', 'hours_worked',
            'skill_level', 'provided_transport', 'provided_equipment',
            'provided_donation', 'volunteer_org_rating', 'volunteer_org_feedback',
            'calculated_credit_hours', 'certificate'
        ]


class ParticipationListSerializer(serializers.ModelSerializer):
    opportunity = OpportunityForParticipationSerializer(read_only=True)
    certificate = CertificateSummarySerializer(read_only=True)

    class Meta:
        model = Participation
        fields = [
            'id', 'opportunity', 'status', 'rating',
            'organization_feedback', 'volunteer_feedback', 'hours_worked',
            'skill_level', 'provided_transport', 'provided_equipment',
            'provided_donation', 'volunteer_org_rating', 'volunteer_org_feedback',
            'calculated_credit_hours', 'certificate'
        ]


class ParticipationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = [
            'id', 'status', 'rating', 'organization_feedback',
            'volunteer_feedback', 'hours_worked', 'skill_level',
            'provided_transport', 'provided_equipment', 'provided_donation',
            'volunteer_org_rating', 'volunteer_org_feedback', 'calculated_credit_hours'
        ]
        read_only_fields = ['id', 'calculated_credit_hours']
