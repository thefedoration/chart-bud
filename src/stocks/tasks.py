import decimal

from celeryconf import app
from .models import TimeseriesResult, Stock

@app.task
def update_stocks(num_to_update=20):
    """
    Updates the most out of date stocks
    """
    for stock in Stock.objects.filter(is_active=True).order_by('datetime_updated')[:num_to_update]:
        result, _ = TimeseriesResult.objects.get_or_create(stock=stock, time_period="current")
        data = result.get_updated_result()
        if data and len(data) > 0:
            # update stock to current values
            stock.open = decimal.Decimal(float(data[-1]['open']))
            stock.volume = decimal.Decimal(float(data[-1]['volume']))
            stock.current = decimal.Decimal(float(data[-1]['close']))
            print "updated stock: ", stock

            # if we have 2 points, first one is yesterday's close
            if len(data) >= 2:
                stock.previous_close = decimal.Decimal(float(data[-2]['close']))

            stock.save()
        else:
            print "missing", stock


@app.task
def update_results(num_to_update=200):
    """
    Updates timeseries if they are out of date
    """
    for result in TimeseriesResult.objects.filter(is_active=True).order_by('datetime_updated')[:num_to_update]:
        result.get_updated_result()
        print "updated timeseries: ", result
    