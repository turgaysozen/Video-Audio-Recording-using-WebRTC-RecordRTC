from django.db import models


class Recording(models.Model):
    filename = models.CharField(max_length=100)
    path = models.CharField(max_length=300)
    extension = models.CharField(max_length=10)
    created = models.DateTimeField(auto_now_add=True)
    length = models.FloatField()
    record_type = models.CharField(max_length=10)
