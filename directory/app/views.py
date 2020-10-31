from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from functools import reduce
from django.db.models import Q
import operator
from django.core import serializers
from app.models import MedFacility, MedFacilitySerializer
from django.core.exceptions import FieldDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from django.db import IntegrityError
import json

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
            queryset = MedFacility.objects.filter(tokens__contains=request.get('tokens'))

            for s in queryset:
                mf_data = MedFacilitySerializer(s).data

                response.append({
                    'name' : mf_data.get('properties').get('name'),
                    'coordinates' : mf_data.get('geometry').get('coordinates')
                })

            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Error",status=status.HTTP_409_CONFLICT)