from rest_framework import serializers
from users.models import Organization
import logging

logger = logging.getLogger(__name__)


class OrganizationProfileSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField(read_only=True)
    logo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Organization
        fields = ['id','email','organization_name','logo','logo_url',
                  'wilaya','daira','phone_number','facebook','instagram','website','description','is_confirmed']
        read_only_fields = ['id','email','is_confirmed']
    
    def to_representation(self, instance):
        """Customize the representation to return logo URL in logo field for backward compatibility"""
        data = super().to_representation(instance)
        # For read operations, replace logo with the URL
        if instance.logo and hasattr(instance.logo, 'url'):
            data['logo'] = instance.logo.url
        elif instance.logo:
            data['logo'] = str(instance.logo)
        return data
    
    def get_logo_url(self, obj):
        """Convert logo path to full URL"""
        if not obj.logo:
            return None
            
        try:
            # Cloudinary provides the URL directly
            if hasattr(obj.logo, 'url'):
                return obj.logo.url
            return str(obj.logo)
        except Exception as e:
            logger.error(f"Error generating logo URL: {e}")
            return None
   