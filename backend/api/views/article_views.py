from rest_framework import generics
from api.models import Article
from api.pagination import CustomPageNumberPagination
from ..serializers.article_serializers import ListArticleSerializer, RetrievCreateArticleSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser




class ArticleListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ListArticleSerializer
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = CustomPageNumberPagination
    
    
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = []
        else:
            self.permission_classes = [IsAdminUser]
        return super(ArticleListCreateAPIView, self).get_permissions()

    def get_queryset(self):
        limit = self.request.query_params.get('limit', None)
        queryset = Article.objects.order_by('-created_at')

        if limit is not None and limit.isdigit():
            return queryset[:int(limit)]

        return queryset
    
    def perform_create(self, serializer):
        serializer.save()

      
      
class ArticleRetrieveAPIView(generics.RetrieveUpdateDestroyAPIView):
      queryset = Article.objects.all()
      serializer_class = RetrievCreateArticleSerializer
      permission_classes = [IsAdminUser]
      parser_classes = (MultiPartParser, FormParser)
      