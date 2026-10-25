from rest_framework import permissions
from users.models import Profile

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (obj.id == request.user.id) or request.user.is_staff or getattr(request.user, "role", None) == Profile.Role.ADMIN

class IsOrganizerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and (
                request.user.is_staff
                or getattr(request.user, "role", None) == Profile.Role.ADMIN
                or request.user.role == Profile.Role.ORGANIZATION
            )
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff or getattr(request.user, "role", None) == Profile.Role.ADMIN:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == Profile.Role.ORGANIZATION
            and getattr(obj, "organization_id", None) == request.user.id
        )

    
class IsHisParticipation(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(request.user, 'volunteer'):
            return (obj.volunteer == request.user.volunteer) or request.user.is_staff
        
        if hasattr(request.user , 'organization'):
            return (obj.opportunity.organization == request.user.organization) or request.user.is_staff
    
        if request.user.is_staff or getattr(request.user, "role", None) == Profile.Role.ADMIN:
            return True


class IsOrganization(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == Profile.Role.ORGANIZATION
                or request.user.is_staff
                or getattr(request.user, "role", None) == Profile.Role.ADMIN
            )
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or getattr(request.user, "role", None) == Profile.Role.ADMIN:
            return True
        return (
            request.user.is_authenticated
            and request.user.role == Profile.Role.ORGANIZATION
        )


class IsVolunteer(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == Profile.Role.VOLUNTEER
                or request.user.is_staff
                or getattr(request.user, "role", None) == Profile.Role.ADMIN
            )
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or getattr(request.user, "role", None) == Profile.Role.ADMIN:
            return True
        return (
            request.user.is_authenticated
            and hasattr(request.user, "volunteer")
            and getattr(obj, "volunteer_id", None) == getattr(request.user.volunteer, "id", None)
        )

