from .base import BaseBackend

import requests
import datetime
from operator import itemgetter

class AlphavantageBackend(BaseBackend):
    """
    Exposes API common to all stock backends
    """
    def __init__(self, ticker, *args, **kwargs):
        self.ticker = ticker
        self.rootUrl = "https://www.alphavantage.co/query"
        self.authenticate()

    def authenticate(self):
        # TODO: Take out env vars
        self.apikey = "E4I0D671EVBSNQVV"

    def get_current(self, interval="60min"):
        """
        Loads up the fastest, most up to date api, gets the last point
        """
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", self.ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        return data[-1]

    def get_1d_series(self, interval="5min"):
        # start_date = datetime.strptime('Jun 1 2005  1:33PM', '%b %d %Y %I:%M%p')
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", self.ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(days=1)]
        return data

    def get_5d_series(self, interval="30min"):
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", self.ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(days=5)]
        return data

    def get_1m_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=30)]
        return data

    def get_3m_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=90)]
        return data

    def get_1y_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", self.ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d') > datetime.datetime.now() - datetime.timedelta(days=365)]
        return data

    def get_max_series(self):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_WEEKLY", self.ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Weekly Time Series"])
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
