from __future__ import absolute_import

from rest_framework import (viewsets, filters,)
import django_filters.rest_framework

from stocks.models import (
    Exchange, Company, Tag, Stock
)
from stocks.api.serializers import (
    ExchangeSerializer,
    CompanySerializer,
    TagSerializer,
    StockSerializer,
)
from stocks.api.filters import (
    StockFilter,
)
from stocks.api.pagination import StockPagination


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
    lookup_field = 'ticker'

    serializer_class = StockSerializer
    pagination_class = StockPagination

    filter_backends = (
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    filter_class = StockFilter
    search_fields = ('ticker', 'company__name',)

    ordering_fields = ('market_cap', 'volume', 'daily_diff_percent',)
    ordering = ('-market_cap',)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer

