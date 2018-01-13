from __future__ import absolute_import

from django.conf.urls import include, url
from rest_framework import routers

from stocks.api.views import (
    ExchangeViewSet,
    CompanyViewSet,
    StockViewSet,
    TagViewSet,
)

router = routers.SimpleRouter()
router.register(r'exchanges', ExchangeViewSet, base_name='exchanges')
router.register(r'companies', CompanyViewSet, base_name='companies')
router.register(r'stocks', StockViewSet, base_name='stocks')
router.register(r'tags', TagViewSet, base_name='tags')

urlpatterns = router.urls
