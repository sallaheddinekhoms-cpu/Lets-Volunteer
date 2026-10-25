from rest_framework import permissions
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers.volunteer_serializers import VolunteerProfileSerializer
from users.models import Volunteer,Organization
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from ..permissions import IsOwnerOrReadOnly
from ..pagination import CustomPageNumberPagination
from rest_framework.permissions import IsAdminUser
from ..serializers.organization_seriallizers import OrganizationProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from ..filters import OrganizationFilter





class OrganizationProfileViewUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = OrganizationProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    def get_object(self):
        organization_id = self.kwargs.get('organization_id',self.request.user)
        
        
        
        
        if str(organization_id) != str(self.request.user.id) and not self.request.user.is_staff and self.request.method != 'GET':
            raise PermissionDenied("You are not allowed to perform this action.")
        

        

        return get_object_or_404(Organization, id=organization_id)
    


class OrganizationList(generics.ListAPIView):
    serializer_class = OrganizationProfileSerializer
    queryset = Organization.objects.all()
    pagination_class = CustomPageNumberPagination
    permission_classes = [permissions.AllowAny]
    filterset_class = OrganizationFilter
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return Organization.objects.all().order_by('-created_at')
        return Organization.objects.filter(is_confirmed=True).order_by('-created_at')


class OrganizationConfirm(APIView):
    permission_classes = [IsAdminUser]
    
    def patch(self, request, organization_id):
        organization = get_object_or_404(Organization, id=organization_id)
        organization.is_confirmed = True
        organization.save()
        return Response(
            {"message": "Organization confirmed successfully", "is_confirmed": True},
            status=status.HTTP_200_OK
        )


class OrganizationUnconfirm(APIView):
    permission_classes = [IsAdminUser]
    
    def patch(self, request, organization_id):
        organization = get_object_or_404(Organization, id=organization_id)
        organization.is_confirmed = False
        organization.save()
        return Response(
            {"message": "Organization unconfirmed successfully", "is_confirmed": False},
            status=status.HTTP_200_OK
        )
    
