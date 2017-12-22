# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class BaseModel(models.Model):
    """
    Base model that others can inherit to get some basic datetimes
    """
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Sector(BaseModel):
    """
    Sector which we use to organize tickers/companies by
    """
    name = models.CharField(max_length=255, blank=False)
    slug = models.SlugField(unique=True, blank=False)

    def __unicode__(self):
        return u"%s" % self.name


class Company(BaseModel):
    """
    Company, might have multiple tickers based on exchange
    """
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    website_url = models.CharField(max_length=255, blank=True)
    tags = models.ManyToManyField("Tag", blank=True)
    sector = models.ForeignKey("Sector", null=True, blank=True)

    def __unicode__(self):
        return u"%s" % self.name


class Exchange(BaseModel):
    """
    Exchange that Stocks trade on
    """
    name = models.CharField(max_length=255, blank=False)
    symbol = models.CharField(max_length=10, blank=False)
    ticker_suffix = models.CharField(max_length=2, blank=True, default='')
    currency = models.ForeignKey('Currency', null=False, blank=False)

    def __unicode__(self):
        return u"%s" % self.symbol


class Currency(BaseModel):
    """
    Currency that an exchange trades with
    """
    name = models.CharField(max_length=255, blank=False)
    symbol = models.CharField(max_length=10, blank=False)
    character = models.CharField(max_length=1, blank=False)

    def __unicode__(self):
        return u"%s (%s)" % (self.symbol, self.symbol)


class Stock(BaseModel):
    """
    A stock which belongs to a Company, trades on an Exchange
    """
    ticker = models.CharField(max_length=10, blank=False)
    exchange = models.ForeignKey('Exchange', null=False, blank=False)
    company = models.ForeignKey('Company', null=False, blank=False)
    market_cap = models.PositiveIntegerField(default=0)

    # today's numbers
    previous_close = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    open = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    current = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    volume = models.PositiveIntegerField(default=0)

    # calculated numbers
    daily_diff = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    daily_diff_percent = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)

    @property
    def full_ticker(self):
        if self.exchange.ticker_suffix:
            return "%s.%s" % (self.ticker, self.exchange.ticker_suffix)
        return self.ticker

    def save(self, *args, **kwargs):
        """
        Calculates diffs
        """
        if self.current and self.previous_close:
            self.daily_diff = self.current - self.previous_close
            self.daily_diff_percent = 100 * self.daily_diff / self.previous_close
        super(Stock, self).save(*args, **kwargs)

    def __unicode__(self):
        return u"%s (%s)" % (self.ticker, self.company.name)


class Tag(BaseModel):
    """
    A company can be tagged with multiple tags that users can filter/search by
    """
    name = models.CharField(max_length=255, blank=False)

    def __unicode__(self):
        return u"%s" % (self.name)
