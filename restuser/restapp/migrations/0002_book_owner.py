# Generated by Django 4.0.1 on 2022-01-18 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='owner',
            field=models.CharField(default='', max_length=255),
        ),
    ]