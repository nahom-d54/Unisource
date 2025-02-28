from django.urls import path
from . import views
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


router = SimpleRouter()

router.register("category", views.CategoryViewSet, basename="category")
router.register("resource", views.ResourceViewset, basename="resource")
router.register("review", views.ReviewViewset, basename="review")
# router.register('rating', views.RatingViewset, basename='rating')


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("register/", views.RegisterView.as_view(), name="register_user"),
    path(
        "rating/<int:resource>/",
        views.RatingViewset.as_view({"get": "list", "post": "create"}),
        name="rating-list",
    ),
    path(
        "rating/<int:resource>/<int:pk>/",
        views.RatingViewset.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="rating-detail",
    ),
    path(
        "resource/featured/", views.FeaturedResourceApiview.as_view(), name="featured"
    ),
]

urlpatterns += router.urls
