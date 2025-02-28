from rest_framework.permissions import BasePermission
from utils.constants import GROUPS


class IsAdminUserOrReadonly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD']:
            return True
        return (getattr(request.user, 'is_admin', False) or getattr(request.user, 'is_superuser', False))

class IsAdmin(BaseException):
    def has_permission(self, request, view):
        return request.user.groups.filter(name=GROUPS['ADMIN']).exists()
class IsLibrarian(BaseException):
    def has_permission(self, request, view):
        return request.user.groups.filter(name=GROUPS['LIBRARIAN']).exists()
    
class IsTeacher(BaseException):
    def has_permission(self, request, view):
        return request.user.groups.filter(name=GROUPS['TEACHER']).exists()
    
class IsStudent(BaseException):
    def has_permission(self, request, view):
        return request.user.groups.filter(name=GROUPS['STUDENT']).exists()