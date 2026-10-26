from users.models import Skill, Volunteer, VolunteerSkill
from rest_framework import serializers
from api.serializers.skills_serializers import  VolunteerSkillSerializer



class VolunteerProfileSerializer(serializers.ModelSerializer):
      avatar = serializers.SerializerMethodField()
      skills = VolunteerSkillSerializer(many=True, read_only=True)
      credit_summary = serializers.SerializerMethodField()
      
      def get_avatar(self, obj):
          if obj.avatar:
              return obj.avatar.url
          return None

      def get_credit_summary(self, obj):
          try:
              from api.impact_services import ImpactService
              return ImpactService.get_volunteer_credit_summary(obj)
          except Exception as e:
              return {
                  "total_hours": 0.0,
                  "fieldwork_hours": 0.0,
                  "training_hours": 0.0,
                  "skill_hours": 0.0,
                  "logistics_hours": 0.0,
                  "milestone_hours": 0.0,
                  "rank": "initiator",
                  "rank_ar": "متطوع مبادر",
                  "rank_color": "#f59e0b",
                  "progress_to_next": 0,
                  "next_target": 25,
                  "recent_logs": [],
              }
      
      class Meta:
            model = Volunteer
            fields = [
            'id', 'email', 'first_name', 'last_name', 'wilaya', 
            'daira', 'phone_number', 'date_of_birth', 'blood_group','avatar','skills',
            'credit_summary'
            ]
            read_only_fields = ['id','email']


        


class VolunteerUpdateProfileSerializer(serializers.ModelSerializer):
      
      
      avatar = serializers.ImageField(allow_null=True, required=False)
      skills = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    
      def to_representation(self, instance):
          """Override to return full URL for avatar in response"""
          data = super().to_representation(instance)
          if instance.avatar:
              data['avatar'] = instance.avatar.url
          return data
      
      class Meta:
            model = Volunteer
            fields = [
            'id', 'email', 'first_name', 'last_name', 'wilaya', 
            'daira', 'phone_number', 'date_of_birth', 'blood_group','avatar','skills'
            ]
            read_only_fields = ['id','email']


      def update(self, instance, validated_data):
            print("validated_data",validated_data)
            skills_data = validated_data.pop('skills', [])
            print("skills_data",skills_data)
            
            
            
            instance = super().update(instance, validated_data)
            
            instance.skills.all().delete()
            for skill_id in skills_data:
                  skill = Skill.objects.get(id=skill_id)
                  print("skill",skill)
                  v = VolunteerSkill.objects.create(volunteer=instance, skill=skill)
                  print("v",v)
                  instance.save()
            
            return instance
            
        



