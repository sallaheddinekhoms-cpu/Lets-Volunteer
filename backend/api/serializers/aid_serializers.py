from ..models import Aid , Beneficiary , AidType
from rest_framework import serializers
from ..serializers.utils_serializers import OrganizationForOpportunitySerializer
import pandas as pd
import io


class AidListCreateSerializer(serializers.ModelSerializer):
      beneficiary = serializers.CharField(source='beneficiary.identity', write_only=True)
      organization = OrganizationForOpportunitySerializer(read_only=True)
      identity = serializers.CharField(source='beneficiary.identity', read_only=True)
          
      class Meta:
            model = Aid
            fields = ['id', 'beneficiary', 'organization', 'aid_type','created_at','identity']      
            read_only_fields = ['id', 'created_at']
            
      
      def create(self, validated_data):
            
            beneficiary = validated_data.pop('beneficiary')
            beneficiary_obj, created = Beneficiary.objects.get_or_create(identity=beneficiary["identity"])
            

            
            validated_data['beneficiary'] = beneficiary_obj
            aid = Aid.objects.create(**validated_data)

            dup = Aid.objects.filter(beneficiary=beneficiary_obj.id, aid_type=validated_data['aid_type']).exclude(id=aid.id)
            if dup:
                  aid.is_duplicated = True
                  aid.save()
            return aid
      
      def to_representation(self, instance):
            data = super().to_representation(instance)
            
            data['beneficiary'] = instance.beneficiary.identity
            
            return data


class AidTypeSerializer(serializers.ModelSerializer):
      beneficiary_count = serializers.IntegerField(read_only=True)
      class Meta:
            model = AidType
            fields = ['id','label','year','is_open','description','beneficiary_count']
            read_only_fields = ['id']


class ExcelUploadSerializer(serializers.Serializer):
      file = serializers.FileField()
      aid_type = serializers.IntegerField()


      def validate_file(self, value):
            if not value.name.endswith('.xlsx'):
                  raise serializers.ValidationError("File must be in .xlsx format")
            return value
      
      def validate_aid_type(self, value):
            try:
                  aid_type = AidType.objects.get(id=value)
            except AidType.DoesNotExist:
                  raise serializers.ValidationError("Aid type does not exist")
            return value
      
      def process_file(self, organization ):

            print("Processing file...")
            file = self.validated_data['file']
            aid_type_id = self.validated_data['aid_type']

            try:
                  df = pd.read_excel(file)
                  print("Processing rows...2")
                  if 'beneficiary_id' not in df.columns:
                        raise serializers.ValidationError("Excel file must contain a 'beneficiary' column")

                  duplicate_ids = []
                  success_count = 0
                  
                  for index,row in df.iterrows():
                        print("Identity:", row['beneficiary_id'])
                        identity = str(row['beneficiary_id']).strip()
                        

                        if not identity or pd.isna(identity):
                              print(f"Row {index} has an empty or invalid identity")
                              continue
                        
                        beneficiary, _ = Beneficiary.objects.get_or_create(identity=identity)
                        print("Beneficiary:", beneficiary)

                        aid = Aid.objects.create(
                              beneficiary=beneficiary,
                              organization=organization,
                              aid_type_id=aid_type_id
                        )


                        dup = Aid.objects.filter(beneficiary=beneficiary.id, aid_type=aid_type_id).exclude(id=aid.id)
                        if dup.exists():
                              aid.is_duplicated = True
                              aid.save()
                              duplicate_ids.append(identity)
                              print(f"Duplicate Aid for identity {identity}")

                       

                        print(f"Created Aid for identity {identity}")

                        success_count += 1

                  return {
                        'success': True,
                        'added_count': success_count
                        # 'duplicates_count': len(duplicate_ids),
                        # 'duplicates': duplicate_ids
                  }

            except Exception as e:
                  raise serializers.ValidationError(f"Error processing file: {str(e)}")