from __future__ import absolute_import

from rest_framework import serializers

from stocks.models import (
    Currency, Exchange, Company, Tag, Stock
)


class CurrencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Currency
        fields = (
            'name',
            'symbol',
            'character',
        )


class ExchangeSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()

    class Meta:
        model = Exchange
        fields = (
            'name',
            'symbol',
            # 'ticker_suffix',
            'currency',
        )


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = (
            'name',
            'description',
            'website_url',
        )


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = (
            'name',
            'id',
        )


class StockSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    exchange = ExchangeSerializer()

    class Meta:
        model = Stock
        fields = (
            'ticker',
            'exchange',
            'company',
        )

