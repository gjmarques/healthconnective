from django.contrib.gis.db import models

class MedFacility(models.Model):
    name = models.CharField(max_length=100,unique=True)
    coords = models.PointField(unique=True)
