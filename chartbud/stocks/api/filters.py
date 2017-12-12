import django_filters

from stocks.models import Stock

class StockFilter(django_filters.FilterSet):
    # exchange = django_filters.MultipleChoiceFilter(
    #     name='exchange__symbol',
    #     # lookup_type='in',
    #     # lookup_expr='contains',
    #     # conjoined=True,  # uses AND instead of OR
    #     # choices=[???],
    # )

    class Meta:
        model = Stock
        fields = {
            'exchange__symbol': ['exact', 'in',],
            'company__tags__id': ['exact', 'in',],
        }