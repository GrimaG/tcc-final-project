from django.shortcuts import render
from django.http import HttpResponse
from app.models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
import matplotlib.image as mpimg
import io
from io import BytesIO
from skimage import exposure, img_as_uint, img_as_float
import numpy as np
import matplotlib.cm as cm
import matplotlib.pyplot as plt
import json
from PIL import Image

def home(request):
    print("OLAMUNDO")
    return render(request, 'app/index.html')

@api_view(['POST'])
def channel(request):
    req = request.data
    imgprocess = ImageProcess()
    decode_old = base64.b64decode(req['img_old'].replace("data:image/jpeg;base64,", "").encode())
    old_img = mpimg.imread(io.BytesIO(decode_old) , format='JPG')
    old_img = imgprocess.isolate(old_img, req['channel'])
    channel_old = imgprocess.convertImageTo64(imgprocess.convertArrayToImage(old_img))
    print (channel_old.decode('utf-8')[:20])
    return HttpResponse('data:image/png;base64,'+channel_old.decode('utf-8'),content_type='application/json; charset=utf-8')

@api_view(['POST'])
def noise(request):
    req = request.data
    imgprocess = ImageProcess()
    img = base64.b64decode(req['img_old'].replace("data:image/jpeg;base64,", "").encode())
    old_img = mpimg.imread(io.BytesIO(img) , format='JPG')
    old_img = imgprocess.isolate(old_img, req['channel'])
    old_img = imgprocess.noiseRemove(old_img, int(req['noise']))
    channel_old = imgprocess.convertImageTo64(imgprocess.convertArrayToImage(old_img))   
    return HttpResponse('data:image/png;base64,'+channel_old.decode('utf-8'),content_type='application/json; charset=utf-8')

@api_view(['POST'])
def otsu(request):
    req = request.data
    imgprocess = ImageProcess()
    img = base64.b64decode(req['img_old'].replace("data:image/jpeg;base64,", "").encode())
    old_img = mpimg.imread(io.BytesIO(img) , format='JPG')
    old_img = imgprocess.isolate(old_img, req['channel'])
    old_img = imgprocess.noiseRemove(old_img, int(req['noise']))
    old_img = imgprocess.binaryImage(old_img)
    channel_old = imgprocess.convertImageTo64(imgprocess.convertBinaryArrayToImage(old_img))
    return HttpResponse('data:image/png;base64,'+channel_old.decode('utf-8'),content_type='application/json; charset=utf-8')

@api_view(['POST'])
def morphologys(request):
    req = request.data
    print (req.keys())
    imgprocess = ImageProcess()
    decode_old = base64.b64decode(req['img_old'].replace("data:image/jpeg;base64,", "").encode())
    old_img = mpimg.imread(io.BytesIO(decode_old) , format='JPG')
    old_img = imgprocess.isolate(old_img, req['channel'])
    old_img = imgprocess.noiseRemove(old_img, int(req['noise']))
    old_img = imgprocess.binaryImage(old_img)
    for morph in req['morphology']:
        old_img = imgprocess.morfologia(old_img, morph, 5)
    channel_old = imgprocess.convertImageTo64(imgprocess.convertBinaryArrayToImage(old_img))
    return HttpResponse('data:image/png;base64,'+channel_old.decode('utf-8'),content_type='application/json; charset=utf-8')

@api_view(['POST'])
def countPixels(request):
    req = request.data
    print (req.keys())
    imgprocess = ImageProcess()
    decode_old = base64.b64decode(req['img_old'].replace("data:image/png;base64,", "").encode())
    old_img = mpimg.imread(io.BytesIO(decode_old) , format='JPG')
    decode_new = base64.b64decode(req['img_new'].replace("data:image/png;base64,", "").encode())
    new_img = mpimg.imread(io.BytesIO(decode_new) , format='JPG')
    return HttpResponse(str(imgprocess.count(old_img, new_img)),content_type='application/json; charset=utf-8')
