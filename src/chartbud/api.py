from __future__ import absolute_import

from django.conf.urls import url, include

urlpatterns = [
    url(r'^stocks/', include('stocks.api.urls')),
]
