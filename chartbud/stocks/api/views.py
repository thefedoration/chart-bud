from __future__ import absolute_import

from rest_framework import (viewsets)

from stocks.api.serializers import (
    ExchangeSerializer,
    CompanySerializer,
    TagSerializer,
    StockSerializer,
)
from stocks.models import (
    Exchange, Company, Tag, Stock
)


class ExchangeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exchange.objects.filter(is_active=True)
    serializer_class = ExchangeSerializer


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.filter(is_active=True, sector__is_active=True)
    serializer_class = CompanySerializer


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.filter(
        is_active=True,
        company__is_active=True,
        exchange__is_active=True)
    serializer_class = StockSerializer


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer

