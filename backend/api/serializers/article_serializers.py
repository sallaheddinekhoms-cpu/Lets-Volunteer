from rest_framework import serializers
from ..models import Article



class ListArticleSerializer(serializers.ModelSerializer):
    article_image = serializers.ImageField(required=False)
    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image','desc', 'created_at']
        
        
class RetrievCreateArticleSerializer(serializers.ModelSerializer):
     

    class Meta:
        model = Article
        fields = '__all__'
        
    
