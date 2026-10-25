from rest_framework import serializers
from api.models import Announcement
import cloudinary.uploader


class AnnouncementSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 
            'title', 
            'image_url', 
            'cloudinary_public_id',
            'description', 
            'is_active', 
            'order', 
            'created_at', 
            'updated_at',
            'image_file'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url', 'cloudinary_public_id']
    
    def create(self, validated_data):
        image_file = validated_data.pop('image_file', None)
        
        if image_file:
            # Upload image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_file,
                folder='announcements'
            )
            validated_data['image_url'] = upload_result['secure_url']
            validated_data['cloudinary_public_id'] = upload_result['public_id']
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        
        if image_file:
            # Delete old image from Cloudinary if exists
            if instance.cloudinary_public_id:
                try:
                    cloudinary.uploader.destroy(instance.cloudinary_public_id)
                except Exception as e:
                    pass  # Continue even if deletion fails
            
            # Upload new image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_file,
                folder='announcements'
            )
            validated_data['image_url'] = upload_result['secure_url']
            validated_data['cloudinary_public_id'] = upload_result['public_id']
        
        return super().update(instance, validated_data)
