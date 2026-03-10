from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsApprovedClient(BasePermission):
    """Client must be approved by admin to access any resource."""
    message = "Your account is pending admin approval."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.can_access


class IsCaseParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == "admin":
            return True
        return user in [obj.client, obj.judge, obj.client_advocate, obj.opposition_advocate]
