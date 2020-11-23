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
            address = data.get('address')
            coords = data.get('coords')
            tokens = data.get('tokens')
            medfac = MedFacility.objects.create(name=name, address=address, coords=coords, tokens=tokens)
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
                            'address': mf_data.get('properties').get('address'),
                            'tokens': mf_data.get('properties').get('tokens'),
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


            response.append({
                'name' : 'Farmácia Moura',
                'address' : 'Rua Manuel Firmino 36, 3800-202 Aveiro',
                'tokens':['pharmacy'],
                'location' : { "lat" : 40.64289345232521,
                                 "lon" : -8.652008851357623 }
            })
            response.append({
                'name' : 'Clínica Dr. Mário Jorge Silva, Lda',
                'address' : 'R. do Sr. dos Aflitos 10, 3800-165 Aveiro',
                'tokens': ['clinic', 'fisiotherapist'],
                'location' : { "lat" : 40.642864794000886,
                                 "lon" : -8.643812020876616 }
            })
            response.append({
                'name' : 'Clínica de Medicina Dentária Doutor José L Moinheiro Lda',
                'address' : 'R. Dr. Alberto Souto 3 1º, 3800-149 Aveiro',
                'tokens': ['clinic', 'dentist'],
                'location' : { "lat" : 40.64441137637814,
                                 "lon" : -8.64711650266061 }
            })

            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Error",status=status.HTTP_409_CONFLICT)