import io
from django.views import View
from rest_framework import generics
from ..models import Aid , AidType
from rest_framework import filters
from ..serializers.aid_serializers import AidListCreateSerializer , AidTypeSerializer
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsOrganization
from ..pagination import CustomPageNumberPagination
from django.db.models import Count
from ..filters import AidsFilter

class AidListCreate(generics.ListCreateAPIView):
    queryset = Aid.objects.all()
    serializer_class = AidListCreateSerializer
    # permission_classes = [IsAuthenticated, IsOrganization]
    filterset_class = AidsFilter
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        queryset = Aid.objects.all()
        print(f"Filter parameters: {self.request.query_params}")
        
        if hasattr(self.request.user, 'organization'):
            queryset = queryset.filter(organization=self.request.user.organization)
     
        
        
        return queryset
    
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization'):
            serializer.save(organization=self.request.user.organization)
        else:
            serializer.save()

class AidTypeListCreate(generics.ListCreateAPIView):
    queryset = AidType.objects.annotate(
        beneficiary_count=Count('aid__beneficiary', distinct=True)
    )
    serializer_class = AidTypeSerializer
    permission_classes = [IsAuthenticated, IsOrganization]
    filter_backends = [filters.SearchFilter]
    search_fields = ['label','year']  
    
    
class AidTypeRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = AidType.objects.all()
    serializer_class = AidTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = AidType.objects.all()
        print("User:", self.request.user)
        return queryset
    
    



from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from io import BytesIO
import pandas as pd
import xlsxwriter
from ..serializers.aid_serializers import ExcelUploadSerializer
from ..permissions import IsOrganization
from django.core.cache import cache

class ExcelTemplateDownloadView(View):
    """
    View to generate and download Excel template for volunteers import
    """
    
    def get(self, request):
        # Create a DataFrame with sample data and column names
        data = {
            'beneficiary_id': ['12345678901234', '98765432109876', '11223344556677'],
        }
        
        df = pd.DataFrame(data)
        
        # Create Excel file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='VolunteerTemplate', index=False)
            
            # Get the xlsxwriter workbook and worksheet objects
            workbook = writer.book
            worksheet = writer.sheets['VolunteerTemplate']
            
            # Add a header format
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#D7E4BC',
                'border': 1
            })
            
            # Write the column headers with the header format
            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)
                
            # Add a note about required and optional fields
            
            # Set column widths
            for i, col in enumerate(df.columns):
                column_width = max(len(col) + 2, df[col].astype(str).map(len).max() + 2)
                worksheet.set_column(i, i, column_width)
        
        # Set up the Http response
        output.seek(0)
        
        # Generate response
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=benficiary_template.xlsx'
        
        return response

class ExcelUploadView(views.APIView):
    permission_classes = [IsAuthenticated, IsOrganization]
    
    def post(self, request, *args, **kwargs):
        serializer = ExcelUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            organization = request.user.organization if hasattr(request.user, 'organization') else None
            result = serializer.process_file(organization)
            print("Result:", result)
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class DuplicatesView(views.APIView):
#     permission_classes = [IsAuthenticated, IsOrganization]
    
#     def get(self, request, *args, **kwargs):
#         aid_type_id = request.query_params.get('aid_type')
        
#         if not aid_type_id:
#             return Response({"error": "يرجى تحديد نوع المساعدة"}, status=status.HTTP_400_BAD_REQUEST)
        
#         organization = request.user.organization if hasattr(request.user, 'organization') else None
#         cache_key = f"duplicates_aid_{aid_type_id}_{organization.id if organization else 'admin'}"
        
#         duplicates = cache.get(cache_key, [])
        
#         return Response({
#             "duplicates": duplicates,
#             "count": len(duplicates)
#         })