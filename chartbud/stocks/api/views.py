from __future__ import absolute_import

import django_filters.rest_framework
from rest_framework import (viewsets, filters, status)
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from stocks.backends import AlphavantageBackend
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

    @detail_route(methods=['get'])
    def chart(self, request, ticker=None):
        stock = self.get_object()
        timespan = self.request.GET.get('timespan', None)
        backend = AlphavantageBackend(stock.full_ticker)

        if timespan == "current":
            return Response(backend.get_current(), status=status.HTTP_200_OK)
        elif timespan == "1d":
            return Response(backend.get_1d_series(), status=status.HTTP_200_OK)
        elif timespan == "5d":
            return Response(backend.get_5d_series(), status=status.HTTP_200_OK)
        elif timespan == "1m":
            return Response(backend.get_1m_series(), status=status.HTTP_200_OK)
        elif timespan == "3m":
            return Response(backend.get_3m_series(), status=status.HTTP_200_OK)
        elif timespan == "1y":
            return Response(backend.get_1y_series(), status=status.HTTP_200_OK)
        elif timespan == "max":
            return Response(backend.get_max_series(), status=status.HTTP_200_OK)
        else:
            return Response("Invalid Timespan", status=status.HTTP_400_BAD_REQUEST)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.filter(is_active=True)
    serializer_class = TagSerializer

