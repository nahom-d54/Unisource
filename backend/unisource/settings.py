from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-j+j*7y)a#uy6f6mf(yzx87@-^e=b=z=v65s+ccxprflln0$o#u"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "unisource.onrender.com",
    "127.0.0.1",
    "localhost",
] + os.environ.get("ALLOWED_HOSTS", "").split(",")


# Application definition

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",  # Default
    "guardian.backends.ObjectPermissionBackend",  # Guardian for object-level permissions
)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "resource",
    "rest_framework",
    "users",
    "phonenumber_field",
    "rest_framework_simplejwt",
    "guardian",
    "drf_spectacular",
    "corsheaders",
]

SPECTACULAR_SETTINGS = {
    "TITLE": "Unisource API",
    "DESCRIPTION": "API for Unisource",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

ROOT_URLCONF = "unisource.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "unisource.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


DATABASES = {
    "default": dj_database_url.config(
        # Replace this value with your local database's connection string.
        default=os.environ.get(
            "DJ_DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/unisource"
        ),
        conn_max_age=600,
    )
}

if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Email stuff

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# EMAIL_HOST = os.environ.get("EMAIL_HOST","smtp.gmail.com")
# EMAIL_HOST_USER = "youremail@gmail.com"
# EMAIL_HOST_PASSWORD = "your email password"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# DEFAULT_FROM_EMAIL = "Delight youremail@gmail.com"

AUTH_USER_MODEL = "users.UserUnisource"


# if not DEBUG:
#     STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
#     STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STORAGE_TYPE = "local"

if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, "uploads")
    STATIC_URL = "/static/"
    MEDIA_URL = "/uploads/"
    STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
else:
    STORAGE_TYPE = "S3"
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
        },
        "staticfiles": {
            "BACKEND": "storages.backends.s3.S3Storage",
        },
    }

    AWS_STORAGE_BUCKET_NAME = os.environ.get("_AWS_STORAGE_BUCKET_NAME", "")
    AWS_QUERYSTRING_AUTH = True
    AWS_S3_REGION_NAME = os.environ.get("_AWS_S3_REGION_NAME", "us-east-1")
    AWS_S3_ENDPOINT_URL = os.environ.get("_AWS_S3_ENDPOINT_URL", "")
    AWS_S3_ACCESS_KEY_ID = os.environ.get("_AWS_ACCESS_KEY", "")
    AWS_SECRET_ACCESS_KEY = os.environ.get("_AWS_SECRET_KEY", "")
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("_AWS_S3_CUSTOM_DOMAIN", "")

    AWS_S3_OBJECT_PARAMETERS = {
        "CacheControl": "max-age=86400",
    }

    if AWS_S3_CUSTOM_DOMAIN:
        STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/static/"
        MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/uploads/"
