from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.postgres.fields import ArrayField
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class MedFacility(models.Model):
    name = models.CharField(max_length=100,unique=True) 
    coords = models.PointField(geography=True, unique=True)
    address = models.CharField(max_length=100,unique=True) 
    tokens = ArrayField(models.CharField(max_length=20, blank=True), size=8)

class MedFacilitySerializer(GeoFeatureModelSerializer):

    class Meta:
        model = MedFacility
        geo_field = 'coords'
        fields = ('name', 'address', 'tokens')