from rest_framework import generics, status
from ..serializers.volunteer_serializers import VolunteerProfileSerializer, VolunteerUpdateProfileSerializer
from users.models import Volunteer
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from ..permissions import IsOwnerOrReadOnly
from ..pagination import CustomPageNumberPagination
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from ..filters import VolunteerFilter
from rest_framework.parsers import FormParser, MultiPartParser



class VolunteerProfileList(generics.ListAPIView):
    serializer_class = VolunteerProfileSerializer
    queryset = Volunteer.objects.all()
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdminUser]
    filterset_class = VolunteerFilter
    parser_classes = [FormParser, MultiPartParser]
    
    def get_queryset(self):
        print("user",self.request.user)
        queryset = Volunteer.objects.all().order_by('-created_at')
        return queryset


class VolunteerProfileViewDeleteUpdate(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = [FormParser, MultiPartParser]
    
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH' or self.request.method == 'PUT':
            return VolunteerUpdateProfileSerializer
        return VolunteerProfileSerializer

    def get_object(self):
        volunteer_id = self.kwargs.get('volunteer_id',self.request.user)
        
        # print("data",self.request.data)
        
        
        if str(volunteer_id) != str(self.request.user.id) and not self.request.user.is_staff and self.request.method != 'GET':
            raise PermissionDenied("You are not allowed to perform this action.")

        volunteer_data = get_object_or_404(Volunteer, id=volunteer_id)
        print("volunteer avatar", volunteer_data.avatar)
        return volunteer_data

    def update(self, request, *args, **kwargs):
        print("request.data", request.data)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle avatar deletion if old avatar exists and new one is being uploaded
        if 'avatar' in request.FILES and instance.avatar:
            print("Deleting old avatar")
            try:
                # Delete old avatar using storage backend
                instance.avatar.delete(save=False)
            except Exception as e:
                print(f"Error deleting old avatar: {e}")
        
        # Handle explicit avatar removal (when empty string is sent)
        elif 'avatar' in request.data and isinstance(request.data['avatar'], str):
            if not request.data['avatar']:
                # User wants to remove avatar
                if instance.avatar:
                    try:
                        instance.avatar.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting avatar: {e}")
            else:
                # String value provided (existing avatar URL), remove from request to avoid overwriting
                request.data._mutable = True
                request.data.pop('avatar')
                request.data._mutable = False
        
        # Let Django's ImageField and storage backend handle the upload automatically
        return super().update(request, *args, **kwargs)
    


    def perform_destroy(self, instance):
        instance.delete()
        return instance
    






