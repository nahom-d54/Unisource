from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions, exceptions, pagination
from resource.models import Category,Resource, Review, Rating
from rest_framework.generics import CreateAPIView
from .serializers import *
from django.contrib.auth import get_user_model
from django.db.models import Q
from .permissions import IsAdminUserOrReadonly


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserOrReadonly]
    serializer_class = CategorySerializer
    def get_queryset(self):
        sub = self.request.GET.get('sub')
        if sub:
            queryset = Category.objects.filter(parent=sub)
            return queryset
        queryset = Category.objects.filter(parent__isnull=True)

        return queryset


class ResourcePagination(pagination.PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100


class ResourceViewset(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAdminUserOrReadonly]
    queryset = Resource.objects.all()
    pagination_class = ResourcePagination

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)
    
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by('published_date')
        query = self.request.GET.get('query')
        category = self.request.GET.get('category')
        sub_category = self.request.GET.get('sub_category')
        
        
        if category:
            queryset = queryset.filter(category=int(category))
        if sub_category:
            queryset = queryset.filter(category_parent=int(sub_category))        
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(author__icontains=query) | Q(file__icontains=query) )
        
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
    
class ReviewViewset(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Review.objects.all()
    #pagination_class = ResourcePagination
    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        if obj.user != self.request.user:
            raise exceptions.PermissionDenied("You are not allowed to update this object.")
        return obj
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RatingViewset(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        resource_id = self.request.GET.get('resource')
        if not resource_id:
            raise exceptions.ErrorDetail("resource query not specified")
        queryset = Rating.objects.filter(resource=int(resource_id))
        return queryset
    def perform_create(self, serializer):
        resource_id = self.request.GET.get('resource')
        serializer.save(user=self.request.user, resource=int(resource_id))
    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        if obj.user != self.request.user:
            raise exceptions.PermissionDenied("You are not allowed to update this object.")
        return obj

class RegisterView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]




