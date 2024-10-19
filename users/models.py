from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from phonenumber_field.modelfields import PhoneNumberField
from utils.constants import GROUPS

class UserManager(BaseUserManager):

    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        if not extra_fields.get('phone_number'):
            raise ValueError("Phone number is required")
        
        

        
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        if extra_fields.get('is_superuser'):
            admin_group, created = Group.objects.get_or_create(name=GROUPS["ADMIN"])
            user.groups.add(admin_group)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)

        return self.create_user(email, password, **extra_fields)


class UserUnisource(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = PhoneNumberField(region='ET', blank=True, null=True, unique=True)
    student_id = models.CharField(max_length=30, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number', 'username']

    def __str__(self):
        return self.email



