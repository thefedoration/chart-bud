import django_filters

from stocks.models import Stock

class StockFilter(django_filters.FilterSet):
    class Meta:
        model = Stock
        fields = {
            'ticker': ['exact', 'in',],
            'exchange__symbol': ['exact', 'in',],
            'company__tags__id': ['exact', 'in',],
        }
