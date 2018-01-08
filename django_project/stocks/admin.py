# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import *


class SectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug',)
admin.site.register(Sector, SectorAdmin)

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
admin.site.register(Company, CompanyAdmin)

class ExchangeAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'ticker_suffix', 'currency')
admin.site.register(Exchange, ExchangeAdmin)

class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'character', 'name',)
admin.site.register(Currency, CurrencyAdmin)

class StockAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'exchange', 'company')
admin.site.register(Stock, StockAdmin)

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
admin.site.register(Tag, TagAdmin)

class TimeseriesResultAdmin(admin.ModelAdmin):
    list_display = ('stock', 'time_period', 'datetime_created', 'datetime_updated')
admin.site.register(TimeseriesResult, TimeseriesResultAdmin)