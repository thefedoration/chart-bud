from rest_framework import (pagination)

class StockPagination(pagination.PageNumberPagination):       
    page_size = 10