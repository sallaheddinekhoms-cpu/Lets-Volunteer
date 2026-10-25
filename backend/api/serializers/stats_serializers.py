from rest_framework import serializers
from users.models import Volunteer
from rest_framework import serializers
from django.db.models import Avg, Sum
from users.models import Volunteer
from api.models import Participation


class VolunteerStatsSerializer(serializers.ModelSerializer):
    total_hours = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_participations = serializers.IntegerField(read_only=True)
    completed_participations = serializers.IntegerField(read_only=True)
    participation_rate = serializers.FloatField(read_only=True)
    top_categories = serializers.ListField(read_only=True)
    recent_feedback = serializers.ListField(read_only=True)

    class Meta:
        model = Volunteer
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'total_hours', 'average_rating', 'total_participations',
            'completed_participations', 'participation_rate',
            'top_categories', 'recent_feedback','phone_number','wilaya','daira','avatar'
        ]




class TopVolunteerSerializer(serializers.ModelSerializer):
    hours = serializers.IntegerField(read_only=True)
    comments = serializers.CharField(source='latest_feedback', read_only=True)
    rating = serializers.IntegerField(read_only=True)

    class Meta:
        model = Volunteer
        fields = ['id', 'first_name', 'last_name', 'hours', 'comments', 'rating', 'avatar']
