from django.conf.urls import url
from app.views import *

urlpatterns = [
    url(r'^$', home),
    url(r'^channel/$', channel),
    url(r'^noise/$', noise),
    url(r'^otsu/$', otsu),
    url(r'^morphologys/$', morphologys),
    url(r'^countPixels/$', countPixels),
]