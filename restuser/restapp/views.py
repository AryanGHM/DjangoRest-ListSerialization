from ast import excepthandler
from multiprocessing.sharedctypes import Value
from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.http import Http404
from django.core import serializers

from restapp.serializers import BookSerializer
from restapp.models import Book
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class BookList(APIView):
    """ List all books or create new books """

    # Expects a list of ids if many is True or a single
    #id integer if many is False.
    def get_object(self, pk, many=False):
        if not many:
            try:
                return Book.objects.get(id=pk)
            except Book.DoesNotExist:
                raise Http404
        else:
            books = []
            try:
                for key in pk:
                    books.append(Book.objects.get(id=key))
            except Book.DoesNotExist:
                raise Http404

            return books

    # Validates ids exist in db, raises Http404 if an
    #id doesn't exist in db.
    def validate_ids(self, ids):
        try:
            for id in ids:
                Book.objects.get(id=id)
        except(Book.DoesNotExist):
            raise Http404

        return True

    # Responds with all books.
    def get(self, request, format=None):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    # Post supports multiple functionality.
    def post(self, request, format=None):
        serializer = BookSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Expects data to have at least one common key 
    #with the object, expects obj to be a model.
    # Raises status.HTTP_400_BAD_REQUEST if there is 
    #an unmatching key in obj and data.
    def update_object(self, obj, data):
        try:
            for (k, v) in data.items():
                setattr(obj, k, v)
        except(KeyError):
            raise status.HTTP_400_BAD_REQUEST
        
    # Accepts multiple objects, if an object is given
    #with an id it will be updated by the given keys.
    # If a complete object is supplied without an id 
    #a new object will be created. If and id less object
    #cannot be serialized HTTP_400 is raised.
    def put(self, request):
        _data = request.data
        instances = []
        try:
            for book in _data:
                if 'id' in book.keys():
                    #update
                    self.validate_ids([book['id']])
                    instance = self.get_object(book['id'])
                    self.update_object(instance, book)
                    instance.save()
                    instances.append(instance)
                else:
                    #create
                    serializer = BookSerializer(data=book)
                    if serializer.is_valid():
                        instances.append(serializer.save())
                    else:
                        raise status.HTTP_400_BAD_REQUEST
                
            # @todo return created/updated objects in response
            return Response(status=status.HTTP_201_CREATED)
            # res_serializer = BookSerializer(data=instances, many=True)
            # if res_serializer.is_valid():
            #     res_serializer.save()
            #     return Response(res_serializer.data, status=status.HTTP_201_CREATED)
            # else:
            #     return Response(data=res_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except(KeyError, Book.DoesNotExist):
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # Accepts a single pk supplied in url for single
    #deletion, for bulk deletion accepts a list of 
    #id integers supplied as request.data.
    def delete(self, request, pk=None, format=None):
        if pk:
            book = self.get_object(pk)
            book.delete()
        elif request.data:
            try:
                books = self.get_object(request.data, True)
                for book in books:
                    book.delete()
            except ValueError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)