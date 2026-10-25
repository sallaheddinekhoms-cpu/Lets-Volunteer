import io
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import pandas as pd

from api.serializers.utils_serializers import ContactSerializer
from api.services import EmailService
from users.models import Volunteer

class ImportExcelView(APIView):

      def post(self, request):
            if "excel_file" not in request.FILES:
                  return Response({"message": "No file found"}, status=status.HTTP_400_BAD_REQUEST)
            excel_file = request.FILES["excel_file"]
            if not excel_file.name.endswith(('.xls', '.xlsx')):
                  return Response({'error': 'File is not in Excel format'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                  df = pd.read_excel(excel_file)
                  
                  required_columns = ['email', 'first_name', 'last_name', 'phone_number', 'wilaya', 'daira']


                  missing_columns = [col for col in required_columns if col not in df.columns]
                  if missing_columns:
                        return Response({'error': f'Missing columns: {", ".join(missing_columns)}'}, status=400)
                  
                  DEFAULT_PASSWORD = "ChangeMe123!"
                  
                  results = {
                        'success': 0,
                        'errors': []
                  }
                  
                  for _,row in df.iterrows():
                        try:
                              if Volunteer.objects.all().filter(email=row['email']).exists():
                                    results['errors'].append(f'{row["email"]} already exists')
                                    continue
                              
                              volunteer = Volunteer.objects.create(
                                    email=row['email'],
                                    first_name=row['first_name'],
                                    last_name=row['last_name'],
                                    phone_number=row['phone_number'],
                                    wilaya=row['wilaya'],
                                    daira=row['daira'],
                                    imported=True
                              )
                              
                              print("password",DEFAULT_PASSWORD)
                              
                              volunteer.set_password(DEFAULT_PASSWORD)
                              volunteer.save()
                              
                              EmailService.send_confirmation_email(
                                    email=volunteer.email, 
                                    name=volunteer.first_name, 
                                    email_verification_token=volunteer.email_verification_token)
                              
                              results['success'] += 1
                        except Exception as e:
                              results['errors'].append(f'{row["email"]}: {str(e)}')

            
                  return Response(
                        {
                              'success': True,
                              'imported': results['success'],
                              'errors': results['errors'],
                              'total': len(df)}
                , status=status.HTTP_200_OK)
            
            except Exception as e:
                  return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            


class DownloadVolunteerTemplateView(View):
    """
    View to generate and download Excel template for volunteers import
    """
    
    def get(self, request):
        # Create a DataFrame with sample data and column names
        data = {
            'email': ['volunteer1@example.com', 'volunteer2@example.com'],
            'first_name': ['John', 'Jane'],
            'last_name': ['Doe', 'Smith'],
            'phone_number': ['0123456789', '0987654321'],
            'wilaya': ['01', '31'],  # Using codes to match with algeria-wilayas package
            'daira': ['0102', '3101'],  # Using codes to match with algeria-wilayas package
            'date_of_birth': ['1990-01-01', '1995-05-15'],  # Optional
            'blood_group': ['O+', 'A-']  # Optional
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
        response['Content-Disposition'] = 'attachment; filename=volunteer_template.xlsx'
        
        return response
    
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from users.utils import send_mail_async

class ContactFormView(APIView):
    """
    API view to handle contact form submissions
    """
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            # Save the contact information to the database
            contact = serializer.save()
            
            # Optional: Send an email notification
            try:
                subject = f"اقتراح للمنصة"
                message = f"Name: {contact.name}\n"\
                          f"Email: {contact.email}\n"\
                          f"Message: {contact.message}"
                          
                send_mail_async(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                   [ "abacha3la2@gmail.com"],  # Replace with your admin email
                )
            except Exception as e:
                # Log the error but don't raise an exception
                print(f"Failed to send email notification: {e}")
            
            return Response(
                {"success": "Your message has been received. We'll contact you soon."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        contacts = Contact.objects.all().order_by('-created_at')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, format=None):
        contact_id = request.query_params.get('id') or request.data.get('id')
        if contact_id:
            try:
                contact = Contact.objects.get(id=contact_id)
                contact.delete()
                return Response({'message': 'تم حذف الرسالة بنجاح'}, status=status.HTTP_200_OK)
            except Contact.DoesNotExist:
                return Response({'error': 'الرسالة غير موجودة'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'معرف الرسالة مطلوب'}, status=status.HTTP_400_BAD_REQUEST)
