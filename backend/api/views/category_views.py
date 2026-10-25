from rest_framework import generics
from api.models import Category
from ..serializers.category_serializers import CategorySerializer
from rest_framework.permissions import IsAdminUser

class CategoryListCreateAPIView(generics.ListCreateAPIView):
      queryset = Category.objects.all()
      serializer_class = CategorySerializer
      
      def get_permissions(self):
            if self.request.method == 'GET':
                  self.permission_classes = []
            else:
                  self.permission_classes = [IsAdminUser]
            return super(CategoryListCreateAPIView, self).get_permissions()
      

class CategoryUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
      queryset = Category.objects.all()
      serializer_class = CategorySerializer
      permission_classes = [IsAdminUser]


