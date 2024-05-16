#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py makemigrations
python manage.py migrate

email="$DJANGO_SUPERUSER_EMAIL"
phone="$DJANGO_SUPERUSER_PHONE"
password="$DJANGO_SUPERUSER_PASSWORD"
username="$DJANGO_SUPERUSER_USERNAME"
