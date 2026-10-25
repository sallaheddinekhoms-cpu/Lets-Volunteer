from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from ..models import Opportunity
from ..serializers.opportunity_serializers import OpportunityListSerializer, OpportunityCreateSerializer, OpportunityRetrieveSerializer, OpportunityUpdateSerializer
from ..pagination import CustomPageNumberPagination
from ..permissions import IsOrganizerOrReadOnly
from ..filters import OpportunityFilter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class OpportunityListCreate(generics.ListCreateAPIView):
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsOrganizerOrReadOnly]
    filterset_class = OpportunityFilter
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OpportunityListSerializer
        return OpportunityCreateSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Opportunity.objects.select_related(
                'category',
                'organization'
            ).prefetch_related(
                'responsabilities',
                'qualifications'
            ).all()
        
        if hasattr(self.request.user, 'organization'):
            return Opportunity.objects.select_related(
                'category',
                'organization'
            ).prefetch_related(
                'responsabilities',
                'qualifications'
            ).filter(organization=self.request.user.organization)
        
        return Opportunity.objects.select_related(
            'category',
            'organization'
        ).prefetch_related(
            'responsabilities',
            'qualifications'
        ).filter(is_active=True)
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("يجب تسجيل الدخول أولاً.")
        if hasattr(user, 'organization'):
            if not user.organization.is_confirmed:
                raise ValidationError(
                    {"detail": "يجب تأكيد حساب المنظمة من طرف الإدارة قبل إنشاء الفرص التطوعية."}
                )
            serializer.save(organization=user.organization)
        elif user.is_staff or getattr(user, 'role', None) == Profile.Role.ADMIN:
            from users.models import Organization
            org_id = self.request.data.get('organization')
            org = None
            if org_id:
                try:
                    org = Organization.objects.get(id=org_id)
                except Exception:
                    org = None
            if not org:
                org = Organization.objects.first()
            if not org:
                org = Organization.objects.create(
                    id=user.id,
                    organization_name="إدارة منصة لنتطوع",
                    is_confirmed=True
                )
            serializer.save(organization=org)
        else:
            raise PermissionDenied("فقط المنظمات أو مسؤولو الإدارة يمكنهم إضافة فرص تطوعية.")


class OpportunityRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Opportunity.objects.all()
    permission_classes = [IsOrganizerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OpportunityUpdateSerializer
        return OpportunityRetrieveSerializer
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if hasattr(self.request.user, 'organization') and instance.organization != self.request.user.organization and not self.request.user.is_staff:
            raise PermissionDenied("You are not allowed to edit this opportunity.")
        serializer.save()
        
    def perform_destroy(self, instance):
        if hasattr(self.request.user, 'organization') and instance.organization != self.request.user.organization and not self.request.user.is_staff:
            raise PermissionDenied("You are not allowed to delete this opportunity.")
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get_object(self):
        opportunity_id = self.kwargs.get('opportunity_id')
        return get_object_or_404(Opportunity, id=opportunity_id)
