import json
import operator
from functools import reduce
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.core.exceptions import FieldDoesNotExist
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.measure import D 
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from app.models import MedFacility, MedFacilitySerializer
from rest_framework import status
from rest_framework.response import Response

@csrf_exempt 
def addMed(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get('name')
            coords = data.get('coords')
            tokens = data.get('tokens')
            medfac = MedFacility.objects.create(name=name, coords=coords, tokens=tokens)
            medfac.save()

            return HttpResponse("Medical Facility added",status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Medical Facility already exists",status=status.HTTP_409_CONFLICT)

@csrf_exempt 
def getMed(request):
    if request.method == "GET":
        try:
            response = []
            request = json.loads(request.body)
            query_str = request.get('query')
            tkn = query_str.split()
            dist = request.get('distance')
            lat = request.get('location').get('lat')
            lon = request.get('location').get('lon')
            pnt = GEOSGeometry('POINT({0} {1})'.format(str(lat), str(lon)), srid=4326)   
            
            for t in tkn:
                qs = MedFacility.objects.filter(tokens__icontains=t,coords__distance_lte=(pnt, D(km=dist)))
            
                for s in qs:
                    mf_data = MedFacilitySerializer(s).data
                    dic = { 'name' : mf_data.get('properties').get('name'),
                            'location' : {"lat" : mf_data.get('geometry').get('coordinates')[0],
                                               "lon" : mf_data.get('geometry').get('coordinates')[1] }}
                    if dic not in response:
                        response.append(dic)



            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Error",status=status.HTTP_409_CONFLICT)


@csrf_exempt 
def stubMed(request):

    if request.method == "GET":
        try:
            response = []
            query_str = ''
            request = json.loads(request.body)
            query_str = request.get('query')
            tkn = query_str.split()
            dist = request.get('distance')
            lat = request.get('location').get('lat')
            lon = request.get('location').get('lon')

            response.append({
                'name' : 'Farmácia Lucas',
                'location' : { "lat" : 40.6,
                                 "lon" : -8.6 }
            })
            response.append({
                'name' : 'Clínica Lopes',
                'location' : { "lat" : 40.7,
                                 "lon" : -8.7 }
            })
            response.append({
                'name' : 'Ortopedista Esticadinho',
                'location' : { "lat" : 60.6,
                                 "lon" : -60.6 }
            })

            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Error",status=status.HTTP_409_CONFLICT)