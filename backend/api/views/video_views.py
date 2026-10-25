from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser, AllowAny
from api.models import Video
from api.serializers.video_serializers import VideoSerializer
import cloudinary.uploader


class VideoListCreateView(generics.ListCreateAPIView):
    serializer_class = VideoSerializer
    
    def get_queryset(self):
        # Non-admin users only see active videos
        if self.request.user.is_staff:
            return Video.objects.all()
        return Video.objects.filter(is_active=True)
    
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


class VideoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    
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
        # Delete video from Cloudinary when deleting from database
        if instance.cloudinary_public_id:
            try:
                cloudinary.uploader.destroy(
                    instance.cloudinary_public_id,
                    resource_type='video'
                )
            except Exception as e:
                pass  # Continue deletion even if Cloudinary deletion fails
        instance.delete()
