from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions, exceptions, pagination
from resource.models import Category, Resource, Review, Rating
from rest_framework.generics import CreateAPIView, ListAPIView
from .serializers import (
    CategorySerializer,
    ResourceSerializer,
    ReviewSerializer,
    RatingSerializer,
    UserSerializer,
)
from django.db.models import Q
from .permissions import IsAdminUserOrReadonly


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserOrReadonly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ResourcePagination(pagination.PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 100


class ResourceViewset(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAdminUserOrReadonly]
    queryset = Resource.objects.all()
    pagination_class = ResourcePagination

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("published_date")
        query = self.request.GET.get("query")
        category = self.request.GET.get("category")
        sub_category = self.request.GET.get("sub_category")

        if category:
            queryset = queryset.filter(category=int(category))
        if sub_category:
            queryset = queryset.filter(category=int(sub_category))
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(author__icontains=query)
                | Q(file__icontains=query)
            )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class FeaturedResourceApiview(ListAPIView):
    serializer_class = ResourceSerializer
    queryset = Resource.objects.filter(featured=True)


class ReviewViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Review.objects.all()

    # pagination_class = ResourcePagination
    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        if obj.user != self.request.user:
            raise exceptions.PermissionDenied(
                "You are not allowed to update this object."
            )
        return obj

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RatingViewset(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        resource_id = self.kwargs.get("resource")
        if not resource_id:
            raise exceptions.NotAcceptable("query not acceptable")
        queryset = Rating.objects.filter(resource=resource_id)
        return queryset

    def perform_create(self, serializer):
        resource_id = self.kwargs.get("resource")
        resource = get_object_or_404(Resource, id=resource_id)
        user = self.request.user

        # Check if the user has already rated the resource
        existing_rating = Rating.objects.filter(user=user, resource=resource).exists()
        if existing_rating:
            raise exceptions.ValidationError("You have already rated this resource.")

        serializer.save(user=self.request.user, resource=resource)

    def get_object(self):
        # Use the pk from the URL to get the specific object
        pk = self.kwargs.get("pk")
        if pk is not None:
            obj = get_object_or_404(Rating, pk=pk)
            if obj.user != self.request.user:
                raise exceptions.PermissionDenied(
                    "You are not allowed to update this object."
                )
            return obj
        raise exceptions.NotFound("Object not found.")


class RegisterView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
