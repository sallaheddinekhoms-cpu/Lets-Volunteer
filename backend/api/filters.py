from .models import Opportunity, Participation , Aid
from django_filters import rest_framework as filters
from users.models import Volunteer , Organization
from django.db.models import Q

class OpportunityFilter(filters.FilterSet):
      duration = filters.NumberFilter(field_name='duration', lookup_expr='lte')
      class Meta:
            model = Opportunity
            fields = ['organization','is_urgent','duration','wilaya','daira','category','is_remote','is_available']


class ParticipationFilter(filters.FilterSet):
      class Meta:
            model = Participation
            fields = ['opportunity', 'volunteer']
            


class AidsFilter(filters.FilterSet):
    identity = filters.CharFilter(field_name='beneficiary__identity', lookup_expr='icontains')
    is_duplicated = filters.BooleanFilter(field_name='is_duplicated')
    aid_type = filters.NumberFilter(field_name='aid_type', lookup_expr='exact')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if 'is_duplicated' in self.data:
            self.data = self.data.copy()
            if self.data['is_duplicated'].lower() == 'true':
                self.data['is_duplicated'] = True
            elif self.data['is_duplicated'].lower() == 'false':
                self.data['is_duplicated'] = False
    
    class Meta:
        model = Aid
        fields = ['aid_type', 'organization', 'identity', 'is_duplicated']
        
    

class VolunteerFilter(filters.FilterSet):

      name = filters.CharFilter(method='filter_by_name')
      
      class Meta:
            model = Volunteer
            fields = ['wilaya','daira','blood_group','name']

      def filter_by_name(self, queryset, name, value):
            if value:
                  return queryset.filter(
                        Q(first_name__icontains=value) | Q(last_name__icontains=value)
                  )
            return queryset


class OrganizationFilter(filters.FilterSet):
      organization_name = filters.CharFilter(field_name='organization_name', lookup_expr='icontains')
      class Meta:
            model = Organization
            fields = ['organization_name','wilaya','daira']