# Generated by Django 5.1.6 on 2025-02-28 13:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0007_resource_featured'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='favoriteresource',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorite_resources', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Tracking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='resource.resource')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('resource', 'user', 'created_at')},
            },
        ),
    ]
