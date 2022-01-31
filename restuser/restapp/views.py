from multiprocessing.sharedctypes import Value
from django.db import IntegrityError
from django.shortcuts import render

# Create your views here.
from django.http import Http404
from django.core import serializers
from django.contrib.auth.models import User

from restapp.serializers import BookSerializer
from restapp.models import Book
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

class BookListGeneric(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer  

    def post(self, request):
        serializer = BookSerializer(data=request.data, many=True)  
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        ret_serializer = BookSerializer(serializer.update(), many=True)
        return Response(ret_serializer.data, status=200)