from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

def validate_file_type(value):
    # Define the allowed file types
    allowed_types = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.text',
        'application/rtf'
    ]

    # Get the file's content type
    if settings.STORAGE_TYPE != 'S3':
        content_type = value.content_type

        if content_type not in allowed_types:
            raise ValidationError('Invalid File Type')

class Resource(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='images/', blank=True, default='images/default.jpg')
    uploader = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, blank=True)
    file = models.FileField(upload_to='files/', max_length=400, blank=True, validators=[validate_file_type])
    category = models.ForeignKey("Category", on_delete=models.SET_NULL, null=True, blank=True)
    #sub_category = models.ForeignKey("SubCategory", on_delete=models.SET_NULL, blank=True, null=True)

    published_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    isbn = models.CharField(max_length=100, default="", blank=True, null=True)
    author = models.CharField(max_length=100,default="Unknown Author", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.name
    

class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        else:
            return self.name

class FavoriteResource(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

class Review(models.Model):
    title = models.CharField(max_length=100)
    review_text = models.TextField()
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title + ' > ' + self.user.username

class Rating(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='ratings')
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[
        MinValueValidator(1.0), MaxValueValidator(5.0)
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.resource.name + ' > ' + self.user.username
    