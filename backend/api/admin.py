from django.contrib import admin
from users.models import Skill, VolunteerSkill
from .models import (
    Category,
    Opportunity,
    Responsability,
    Qualification,
    Participation,
    Aid,
    Beneficiary,
    AidType,
    Article,
    Video,
    Announcement,
    SolidarityItem,
    SolidarityRequest,
    TrainingCourse,
    TrainingEnrollment,
    VolunteerCreditLog,
    OrganizationImpact,
)

admin.site.register(Category)
admin.site.register(Opportunity)
admin.site.register(Responsability)
admin.site.register(Qualification)
admin.site.register(Aid)
admin.site.register(Beneficiary)
admin.site.register(AidType)
admin.site.register(Article)
admin.site.register(Video)
admin.site.register(Announcement)
admin.site.register(SolidarityItem)
admin.site.register(Skill)
admin.site.register(VolunteerSkill)
admin.site.register(TrainingCourse)
admin.site.register(TrainingEnrollment)


@admin.register(VolunteerCreditLog)
class VolunteerCreditLogAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'credit_type', 'hours', 'description', 'created_at')
    list_filter = ('credit_type', 'created_at')
    search_fields = ('volunteer__first_name', 'volunteer__last_name', 'description')


@admin.register(OrganizationImpact)
class OrganizationImpactAdmin(admin.ModelAdmin):
    list_display = ('organization', 'impact_points', 'tier', 'avg_volunteer_rating', 'opportunities_completed', 'trainings_organized')
    list_filter = ('tier', 'badge_volunteer_friendly', 'badge_training_incubator')
    search_fields = ('organization__organization_name',)



@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'opportunity', 'status', 'hours_worked', 'rating', 'completed_at')
    list_filter = ('status', 'completed_at')
    search_fields = ('volunteer__first_name', 'volunteer__last_name', 'opportunity__title')


@admin.register(SolidarityRequest)
class SolidarityRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'requester_name', 'wilaya', 'urgency', 'status', 'created_at')
    list_filter = ('status', 'urgency', 'wilaya', 'created_at')
    search_fields = ('title', 'requester_name', 'description', 'contact_phone')
