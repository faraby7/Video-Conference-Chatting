from django.db import models

# Create your models here.

class Room(models.Model):
    room = models.CharField(max_length=30)
    username = models.CharField(max_length=30)