# Generated by Django 5.1.6 on 2025-02-28 09:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0006_alter_resource_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='featured',
            field=models.BooleanField(default=False),
        ),
    ]
