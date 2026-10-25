import re
from ..models import Opportunity, Responsability, Qualification
from rest_framework import serializers
from .utils_serializers import ResponsabilitySerializer, QualificationSerializer , OrganizationForOpportunitySerializer
from .category_serializers import CategorySerializer
from users.models import Volunteer



class OpportunityListSerializer(serializers.ModelSerializer):
      category = CategorySerializer()
      organization  = serializers.CharField(source='organization.organization_name', read_only=True)
      already_applied  = serializers.SerializerMethodField()
      class Meta:
            model = Opportunity
            fields = ['id', 'title' , 'created_at', 'updated_at', 'organization', 
                      'wilaya', 'daira', 'latitude', 'longitude', 'location_address', 'category' , 'is_urgent', 'is_remote', 'duration',
                      'description','is_available','already_applied','image','date_of_opportunity','is_active'
                      ]
      
      
      def get_already_applied(self,obj) :
            user = self.context['request'].user
            
            if user.is_authenticated and isinstance(user,Volunteer):
                  return obj.participations.filter(volunteer=user).exists()
            
            return False
            





class OpportunityRetrieveSerializer(serializers.ModelSerializer):
      responsabilities = ResponsabilitySerializer(many=True,read_only=True)
      qualifications = QualificationSerializer(many=True,read_only=True)
      category = CategorySerializer(read_only=True)
      organization = OrganizationForOpportunitySerializer(read_only=True)
      already_applied  = serializers.SerializerMethodField()
      
      
      class Meta:
            model = Opportunity
            fields = [
            'id', 'title', 'description', 'organization','date_of_opportunity',
            'responsabilities', 'qualifications', 'category', 'wilaya', 'daira', 'latitude', 'longitude', 'location_address',
            'is_urgent', 'is_remote', 'is_available', 'duration', 'created_at', 'updated_at','email','phone_number',
            'already_applied','is_active', 'image'
            
        ]
            
            read_only_fields = ['created_at', 'updated_at']
      
      def get_already_applied(self,obj) :
            user = self.context['request'].user
            
            
            
            if user.is_authenticated and hasattr(user,'volunteer') :

                  return obj.participations.filter(volunteer=user).exists()
            
            return False
            

import re
from django.db import transaction

class OpportunityCreateSerializer(serializers.ModelSerializer):
    organization = OrganizationForOpportunitySerializer(read_only=True)
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Opportunity
        fields = [
            'id', 'title', 'description', 'organization',
            'category', 'wilaya', 'daira', 'latitude', 'longitude', 'location_address', 'is_urgent', 'is_remote', 
            'duration', 'created_at', 'updated_at',
            'email', 'phone_number', 'image','date_of_opportunity'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        request = self.context.get('request')
        if request and hasattr(request.user, 'organization'):
            if not request.user.organization.is_confirmed:
                raise serializers.ValidationError(
                    "Your organization must be confirmed by an admin before creating opportunities."
                )
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):

        request = self.context.get('request')
        

        opportunity = Opportunity.objects.create(**validated_data)
        
        if request and hasattr(request, 'data'):

            resp_indices = set()
            qual_indices = set()
            

            for key in request.data.keys():
                if '[title]' not in key:
                    continue
                    
                if 'responsabilities[' in key:
                    match = re.search(r'responsabilities\[(\d+)\]', key)
                    if match:
                        resp_indices.add(int(match.group(1)))
                elif 'qualifications[' in key:
                    match = re.search(r'qualifications\[(\d+)\]', key)
                    if match:
                        qual_indices.add(int(match.group(1)))
            

            for idx in resp_indices:
                key = f'responsabilities[{idx}][title]'
                if key in request.data:
                    value = request.data[key]

                    title = value[0] if isinstance(value, (list, tuple)) else value
                    if title:  # Skip empty values
                        Responsability.objects.create(
                            opportunity=opportunity,
                            title=title
                        )
            
            # Create qualifications
            for idx in qual_indices:
                key = f'qualifications[{idx}][title]'
                if key in request.data:
                    value = request.data[key]
                    # Handle both single values and lists
                    title = value[0] if isinstance(value, (list, tuple)) else value
                    if title:  # Skip empty values
                        Qualification.objects.create(
                            opportunity=opportunity,
                            title=title
                        )
        
        return opportunity


class OpportunityUpdateSerializer(serializers.ModelSerializer):
    organization = OrganizationForOpportunitySerializer(read_only=True)
    image = serializers.ImageField(required=False)
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    wilaya = serializers.CharField(required=False)
    daira = serializers.CharField(required=False)
    
    class Meta:
        model = Opportunity
        fields = [
            'id', 'title', 'description', 'organization',
            'category', 'wilaya', 'daira', 'latitude', 'longitude', 'location_address', 'is_urgent', 'is_remote', 
            'duration', 'created_at', 'updated_at', 'is_available', 'is_active',
            'email', 'phone_number', 'image','date_of_opportunity'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    @transaction.atomic
    def update(self, instance, validated_data):
        # Update the instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        request = self.context.get('request')
        
        if request and hasattr(request, 'data'):
            # Clear existing responsibilities and qualifications
            instance.responsabilities.all().delete()
            instance.qualifications.all().delete()
            
            resp_indices = set()
            qual_indices = set()
            
            # Parse request data for nested arrays
            for key in request.data.keys():
                if '[title]' not in key:
                    continue
                    
                if 'responsabilities[' in key:
                    match = re.search(r'responsabilities\[(\d+)\]', key)
                    if match:
                        resp_indices.add(int(match.group(1)))
                elif 'qualifications[' in key:
                    match = re.search(r'qualifications\[(\d+)\]', key)
                    if match:
                        qual_indices.add(int(match.group(1)))
            
            # Create new responsibilities
            for idx in resp_indices:
                key = f'responsabilities[{idx}][title]'
                if key in request.data:
                    value = request.data[key]
                    title = value[0] if isinstance(value, (list, tuple)) else value
                    if title and title.strip():  # Skip empty values
                        Responsability.objects.create(
                            opportunity=instance,
                            title=title.strip()
                        )
            
            # Create new qualifications
            for idx in qual_indices:
                key = f'qualifications[{idx}][title]'
                if key in request.data:
                    value = request.data[key]
                    title = value[0] if isinstance(value, (list, tuple)) else value
                    if title and title.strip():  # Skip empty values
                        Qualification.objects.create(
                            opportunity=instance,
                            title=title.strip()
                        )
        
        return instance