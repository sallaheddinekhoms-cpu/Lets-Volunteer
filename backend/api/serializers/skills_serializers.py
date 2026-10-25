from rest_framework import serializers
from users.models import Skill, VolunteerSkill

class SkillSerializer(serializers.ModelSerializer):
      
      class Meta:
            fields = ['id','name']
            model = Skill
            read_only_fields = ['id']
            


class VolunteerSkillSerializer(serializers.ModelSerializer):
      
      skill = SkillSerializer()
      class Meta:
            model = VolunteerSkill
            fields = ['id','skill']
            read_only_fields = ['id']