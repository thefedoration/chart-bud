import decimal

from celeryconf import app
from .models import TimeseriesResult, Stock

@app.task
def update_stocks(num_to_update=100, ordering='datetime_updated'):
    """
    Updates the most out of date stocks
    """
    for stock in Stock.objects.filter(is_active=True).order_by(ordering)[:num_to_update]:
        result, _ = TimeseriesResult.objects.get_or_create(stock=stock, time_period="current")
        data = result.get_updated_result()
        if data and len(data) > 0:
            # update stock to current values
            stock.open = decimal.Decimal(float(data[-1]['open']))
            stock.volume = decimal.Decimal(float(data[-1]['volume']))
            stock.current = decimal.Decimal(float(data[-1]['close']))
            print "updated stock: %s" % stock.ticker

            # if we have 2 points, first one is yesterday's close
            if len(data) >= 2:
                stock.previous_close = decimal.Decimal(float(data[-2]['close']))
            else:
                stock.previous_close = None

            stock.save()
        else:
            # clear stock
            stock.open = None
            stock.volume = None
            stock.current = decimal.Decimal(0.00)
            stock.previous_close = None
            stock.save()
            print "missing data: %s" % stock.ticker


@app.task
def update_results(num_to_update=200):
    """
    Updates timeseries if they are out of date
    """
    for result in TimeseriesResult.objects.filter(is_active=True).order_by('datetime_updated')[:num_to_update]:
        result.get_updated_result()
        print "updated timeseries: %s (%s)" % (result.stock.ticker, result.time_period)
    