# Generated by Django 4.0.1 on 2022-01-30 14:44

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('restapp', '0002_book_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
