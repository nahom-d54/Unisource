from rest_framework import serializers
from resource.models import Category, Resource, Review, Rating
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from utils.constants import GROUPS


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "subcategories"]

    def get_fields(self):
        fields = super().get_fields()
        if self.context.get("view").action != "retrieve":
            fields.pop("subcategories", None)

        return fields

    def get_subcategories(self, obj):
        serializer = self.__class__(obj.subcategories, many=True, context=self.context)
        return serializer.data


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        exclude = ["uploader"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"

        extra_kwargs = {"user": {"read_only": True}, "resource": {"read_only": True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "password",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": True,
                "style": {"input_type": "password"},
            }
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = get_user_model().objects.create(**validated_data)
        user.set_password(password)
        user.save()
        student_group, created = Group.objects.get_or_create(name=GROUPS["STUDENT"])
        user.groups.add(student_group)

        return user
