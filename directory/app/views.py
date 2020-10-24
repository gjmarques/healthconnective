from django.shortcuts import render
from django.http import HttpResponse
from app.models import MedFacility
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
            medfac = MedFacility.objects.create(name=name, coords=coords)
            medfac.save()

            return HttpResponse("Medical Facility added",status=status.HTTP_200_OK)
        except IntegrityError as e:
            return HttpResponse("Medical Facility already exists",status=status.HTTP_409_CONFLICT)