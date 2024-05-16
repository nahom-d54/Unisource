from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)


router = DefaultRouter()

router.register('category', views.CategoryViewSet,basename='category')
router.register('resource', views.ResourceViewset, basename='resource')
router.register('review', views.ReviewViewset, basename='review')
router.register('rating', views.RatingViewset, basename='rating')


urlpatterns = [
    path("", include(router.urls) , name="router_viewsets"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', views.RegisterView.as_view(), name='register_user'),
]

