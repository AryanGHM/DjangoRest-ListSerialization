import uuid

from django.contrib.auth.models import User
from restapp.models import Book
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['url', 'username', 'email', 'is_staff']


class BookListSerializer(serializers.ListSerializer):
    def to_internal_value(self, data):
        for item in data:
            if 'id' in item.keys():
                continue
            else: 
                item['id'] = uuid.uuid4()
        
        print("to internal value: ", data)
        return super().to_internal_value(data)

    def update(self):
        instance = Book.objects.all()
        book_mapping = {book.id: book for book in instance} #database queryset
        print("validated data: ", self.validated_data)
        data_mapping = {item['id']: item for item in self.validated_data} #data queryset

        ret = []
        #update and creation
        for book_id, data in data_mapping.items():
            book = book_mapping.get(book_id, None)
            if book is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(book, data))

        #deletion
        for book_id, data in book_mapping.items():
            if book_id not in data_mapping:
                data.delete()
        
        return ret

"""
@issue: while updating in list serializer field validator
raises an exception saying object with the same id already 
exists. maybe being a model serilizer causes this?
"""
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'name', 'publish_date', 'owner')
        list_serializer_class = BookListSerializer
        extra_kwargs = {
            'id': {'read_only': False},
            'slug': {'validators': []},
        }
    
    @classmethod
    def many_init(cls, *args, **kwargs):
        kwargs['child'] = cls()
        return BookListSerializer(*args, **kwargs)
    