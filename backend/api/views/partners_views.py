from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from api.models import Partner
from api.serializers.partner_serializers import PartnerSerializer
from rest_framework.permissions import IsAdminUser

class PartnerListCreate(generics.ListCreateAPIView):
      queryset = Partner.objects.all()
      serializer_class = PartnerSerializer
      parser_classes = [MultiPartParser, FormParser]
      
      def perform_create(self, serializer):
          serializer.save()



class PartnerRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
      queryset = Partner.objects.all()
      serializer_class = PartnerSerializer
      permission_classes = [IsAdminUser]
      parser_classes = [MultiPartParser, FormParser]
      
      def perform_update(self, serializer):
          serializer.save()


