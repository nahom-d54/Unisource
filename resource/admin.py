from django.contrib import admin
from .models import *

admin.site.register([Resource,Category, Rating, Review])
