from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser, AllowAny
from api.models import Announcement
from api.serializers.announcement_serializers import AnnouncementSerializer
import cloudinary.uploader


class AnnouncementListCreateView(generics.ListCreateAPIView):
    serializer_class = AnnouncementSerializer
    
    def get_queryset(self):
        # Non-admin users only see active announcements
        if self.request.user.is_staff:
            return Announcement.objects.all()
        return Announcement.objects.filter(is_active=True)
    
    def get_parsers(self):
        # Use multipart parser only for POST requests
        if self.request.method == 'POST':
            return [MultiPartParser(), FormParser()]
        return super().get_parsers()
    
    def get_permissions(self):
        # Only admin can create
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]


class AnnouncementRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    
    def get_parsers(self):
        # Use multipart parser only for PUT/PATCH requests
        if self.request.method in ['PUT', 'PATCH']:
            return [MultiPartParser(), FormParser()]
        return super().get_parsers()
    
    def get_permissions(self):
        # Only admin can update/delete
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def perform_destroy(self, instance):
        # Delete image from Cloudinary when deleting from database
        if instance.cloudinary_public_id:
            try:
                cloudinary.uploader.destroy(instance.cloudinary_public_id)
            except Exception as e:
                pass  # Continue deletion even if Cloudinary deletion fails
        instance.delete()
