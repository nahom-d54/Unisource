# Generated by Django 5.0.6 on 2024-05-25 13:27

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0004_resource_description'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together={('resource', 'user')},
        ),
    ]
