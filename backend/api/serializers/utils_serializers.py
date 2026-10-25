from users.models import Organization
from ..models import Contact, Responsability, Qualification, Opportunity, SolidarityRequest
from rest_framework import serializers


class ResponsabilitySerializer(serializers.ModelSerializer):
      class Meta:
            model = Responsability
            fields = ['title']


class QualificationSerializer(serializers.ModelSerializer):
      class Meta:
            model = Qualification
            fields = ['title']
            

class OrganizationForOpportunitySerializer(serializers.ModelSerializer):
      class Meta:
            model = Organization
            fields = ['id', 'organization_name','logo']


class OpportunityForParticipationSerializer(serializers.ModelSerializer):
      organization = OrganizationForOpportunitySerializer()
      class Meta:
            model = Opportunity
            fields = ['id', 'title','organization','created_at']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']


class SolidarityRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)

    class Meta:
        model = SolidarityRequest
        fields = [
            'id', 'requester_name', 'user', 'title', 'category', 'urgency',
            'urgency_display', 'description', 'wilaya', 'daira',
            'contact_phone', 'status', 'status_display', 'admin_note',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'status_display', 'admin_note', 'created_at', 'updated_at']
