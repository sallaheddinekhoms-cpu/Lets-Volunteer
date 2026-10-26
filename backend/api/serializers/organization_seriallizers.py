from rest_framework import serializers
from users.models import Organization
from api.models import OrganizationImpact
import logging

logger = logging.getLogger(__name__)


class OrganizationImpactSerializer(serializers.ModelSerializer):
    tier_label = serializers.CharField(source='get_tier_display', read_only=True)

    class Meta:
        model = OrganizationImpact
        fields = [
            'impact_points', 'tier', 'tier_label',
            'avg_volunteer_rating', 'total_ratings_count',
            'badge_volunteer_friendly', 'badge_training_incubator',
            'badge_rapid_response', 'opportunities_completed',
            'trainings_organized', 'new_volunteers_onboarded'
        ]


class OrganizationProfileSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField(read_only=True)
    logo = serializers.ImageField(required=False, allow_null=True)
    impact = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Organization
        fields = [
            'id', 'email', 'organization_name', 'logo', 'logo_url',
            'wilaya', 'daira', 'phone_number', 'facebook', 'instagram',
            'website', 'description', 'is_confirmed', 'impact'
        ]
        read_only_fields = ['id', 'email', 'is_confirmed']

    def get_impact(self, obj):
        try:
            impact, _ = OrganizationImpact.objects.get_or_create(organization=obj)
            return OrganizationImpactSerializer(impact).data
        except Exception as e:
            logger.error(f"Error fetching organization impact: {e}")
            return {
                "impact_points": 20 if obj.is_confirmed else 0,
                "tier": "emerging",
                "tier_label": "جمعية ناشئة ومبادرة",
                "avg_volunteer_rating": 5.0,
                "total_ratings_count": 0,
                "badge_volunteer_friendly": False,
                "badge_training_incubator": False,
                "badge_rapid_response": False,
            }

    def to_representation(self, instance):
        """Customize the representation to return logo URL in logo field for backward compatibility"""
        data = super().to_representation(instance)
        if instance.logo and hasattr(instance.logo, 'url'):
            data['logo'] = instance.logo.url
        elif instance.logo:
            data['logo'] = str(instance.logo)
        return data

    def get_logo_url(self, obj):
        if not obj.logo:
            return None
        try:
            if hasattr(obj.logo, 'url'):
                return obj.logo.url
            return str(obj.logo)
        except Exception as e:
            logger.error(f"Error generating logo URL: {e}")
            return None
