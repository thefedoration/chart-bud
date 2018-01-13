from .base import BaseBackend

import requests
import datetime
from operator import itemgetter

class AlphavantageBackend(BaseBackend):
    """
    Exposes API common to all stock backends
    """

    valid_timespans = ["current", "1d", "5d", "1m", "3m", "1y", "max"]

    def __init__(self, ticker, *args, **kwargs):
        self.ticker = ticker
        self.rootUrl = "https://www.alphavantage.co/query"
        self.authenticate()

    def authenticate(self):
        # TODO: Take out env vars
        self.apikey = "E4I0D671EVBSNQVV"

    def get_result(self, timespan):
        if timespan == "current":
            return self.get_current()
        elif timespan == "1d":
            return self.get_1d_series()
        elif timespan == "5d":
            return self.get_5d_series()
        elif timespan == "1m":
            return self.get_1m_series()
        elif timespan == "3m":
            return self.get_3m_series()
        elif timespan == "1y":
            return self.get_1y_series()
        elif timespan == "max":
            return self.get_max_series()
        else:
            return None

    def get_current(self):
        """
        Loads up the fastest, most up to date api, gets the last 2 points
        Returns 2 so that we can set yesterday's close if need to
        """
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        key = "Time Series (Daily)"
        if key in r.json():
            data = self._clean_data(r.json()[key])
            return data[-2:]

    def get_1d_series(self, interval="1min"):
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", self.ticker, interval, self.apikey
        ))
        key = "Time Series (%s)" % interval
        if key in r.json():
            data = self._clean_data(r.json()[key])
            last_tick = datetime.datetime.strptime(data[-1]["timestamp"], '%Y-%m-%d %H:%M:%S')
            data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > last_tick - datetime.timedelta(days=1)]
            return data

    def get_5d_series(self, interval="5min"):
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", self.ticker, interval, self.apikey
        ))
        key = "Time Series (%s)" % interval
        if key in r.json():
            data = self._clean_data(r.json()[key])
            data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(days=7)]
            return data

    def get_1m_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        key = "Time Series (Daily)"
        if key in r.json():
            data = self._clean_data(r.json()[key])
            data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=30)]
            return data

    def get_3m_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        key = "Time Series (Daily)"
        if key in r.json():
            data = self._clean_data(r.json()[key])
            data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=90)]
            return data

    def get_1y_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        key = "Time Series (Daily)"
        if key in r.json():
            data = self._clean_data(r.json()[key])
            data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=365)]
            return data

    def get_max_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_WEEKLY", self.ticker, self.apikey
        ))
        key = "Weekly Time Series"
        if key in r.json():
            data = self._clean_data(r.json()[key])
            return data

    def _clean_data(self, data):
        """
        Converts {
            "2017-12-18 16:00:00": {
                "1. open": "7.0200",
                ...
            }
        }
        to [{
            "timestamp": "2017-12-18 16:00:00",
            "open": "7.0200",
            ...
        }]
        """
        to_return = []
        for key in data:
            original_data = data[key]
            new_data = {}
            for inner_key in original_data:
                new_data[inner_key[3:]] = original_data[inner_key]
            new_data["timestamp"] = key
            to_return.append(new_data)
        return sorted(to_return, key=itemgetter('timestamp')) 
