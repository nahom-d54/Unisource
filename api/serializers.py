from rest_framework import serializers
from resource.models import Category, Resource, Review, Rating
from django.contrib.auth import get_user_model


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        exclude = ['uploader']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

        extra_kwargs = {'user': {'read_only': True}, 'resource':  {'read_only': True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username','first_name', 'last_name', 'email', 'phone_number', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True, 'style': { 'input_type': 'password'}}}
      
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = get_user_model().objects.create(**validated_data)
        user.set_password(password)
        user.save()

        return user




