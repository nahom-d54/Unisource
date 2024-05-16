from rest_framework.permissions import BasePermission


class IsAdminUserOrReadonly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD']:
            return True
        return (getattr(request.user, 'is_admin', False) or getattr(request.user, 'is_superuser', False))