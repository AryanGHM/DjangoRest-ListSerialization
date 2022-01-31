import uuid
from wsgiref import validate
from django.db import models

# Create your models here.

class Book(models.Model):
    #id  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    name = models.CharField(max_length=255, unique=False)
    owner = models.CharField(max_length=255, default='', unique=False)
    publish_date = models.DateField(unique=False)