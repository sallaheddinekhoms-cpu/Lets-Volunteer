from rest_framework import serializers
from api.models import Video
import cloudinary.uploader


class VideoSerializer(serializers.ModelSerializer):
    video_file = serializers.FileField(write_only=True, required=False)
    
    class Meta:
        model = Video
        fields = [
            'id', 
            'title', 
            'video_url', 
            'cloudinary_public_id',
            'description', 
            'is_active', 
            'order', 
            'created_at', 
            'updated_at',
            'video_file'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'video_url', 'cloudinary_public_id']
    
    def create(self, validated_data):
        video_file = validated_data.pop('video_file', None)
        
        if video_file:
            # Upload video to Cloudinary
            upload_result = cloudinary.uploader.upload(
                video_file,
                resource_type='video',
                folder='videos'
            )
            validated_data['video_url'] = upload_result['secure_url']
            validated_data['cloudinary_public_id'] = upload_result['public_id']
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        video_file = validated_data.pop('video_file', None)
        
        if video_file:
            # Delete old video from Cloudinary if exists
            if instance.cloudinary_public_id:
                try:
                    cloudinary.uploader.destroy(
                        instance.cloudinary_public_id,
                        resource_type='video'
                    )
                except Exception as e:
                    pass  # Continue even if deletion fails
            
            # Upload new video to Cloudinary
            upload_result = cloudinary.uploader.upload(
                video_file,
                resource_type='video',
                folder='videos'
            )
            validated_data['video_url'] = upload_result['secure_url']
            validated_data['cloudinary_public_id'] = upload_result['public_id']
        
        return super().update(instance, validated_data)
