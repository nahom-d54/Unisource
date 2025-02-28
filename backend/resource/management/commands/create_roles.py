# create_roles.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from resource.models import Resource  # Adjust this import to your app and model

class Command(BaseCommand):
    help = 'Create default roles and assign permissions'

    def handle(self, *args, **kwargs):
        roles = {
            'Admin': ['add_book', 'change_book', 'delete_book', 'view_book'],
            'Librarian': ['add_book', 'change_book', 'view_book'],
            'Teacher': ['view_book'],
            'Student': ['view_book'],
        }

        book_content_type = ContentType.objects.get_for_model(Resource)

        for role_name, perms in roles.items():
            group, created = Group.objects.get_or_create(name=role_name)
            for perm in perms:
                permission = Permission.objects.get(codename=perm, content_type=book_content_type)
                group.permissions.add(permission)

            self.stdout.write(self.style.SUCCESS(f'Created or updated role: {role_name}'))
