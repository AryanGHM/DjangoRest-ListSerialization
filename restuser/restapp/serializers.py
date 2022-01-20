from django.contrib.auth.models import User
from restapp.models import Book
from rest_framework import serializers

class BookListSerializer(serializers.ListSerializer):
    pass

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'name', 'publish_date', 'owner')
        list_serializer_class = BookListSerializer

