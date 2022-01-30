import uuid
from django.db import models

# Create your models here.

class Book(models.Model):
    id  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True, unique=False)
    name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255, default='')
    publish_date = models.DateField()