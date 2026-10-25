from users.models import Skill
from ..serializers.skills_serializers import SkillSerializer
from rest_framework import generics



class SkillListCreateView(generics.ListCreateAPIView):
      queryset = Skill.objects.all()
      serializer_class = SkillSerializer
      
class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
      queryset = Skill.objects.all()
      serializer_class = SkillSerializer