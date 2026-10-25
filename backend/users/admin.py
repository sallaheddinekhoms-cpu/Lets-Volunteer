from django.contrib import admin
from .models import Profile, Volunteer, Organization
# Register your models here.


admin.site.register(Profile)
admin.site.register(Volunteer)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'email', 'is_confirmed', 'is_active', 'created_at')
    list_filter = ('is_confirmed', 'is_active', 'wilaya')
    search_fields = ('organization_name', 'email', 'president_name')
    list_editable = ('is_confirmed',)
    actions = ['confirm_organizations', 'unconfirm_organizations']
    
    def confirm_organizations(self, request, queryset):
        updated = queryset.update(is_confirmed=True)
        self.message_user(request, f'{updated} organization(s) confirmed successfully.')
    confirm_organizations.short_description = "Confirm selected organizations"
    
    def unconfirm_organizations(self, request, queryset):
        updated = queryset.update(is_confirmed=False)
        self.message_user(request, f'{updated} organization(s) unconfirmed successfully.')
    unconfirm_organizations.short_description = "Unconfirm selected organizations"