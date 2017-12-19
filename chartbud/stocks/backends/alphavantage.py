from .base import BaseBackend

import requests
import datetime

class AlphavantageBackend(BaseBackend):
    """
    Exposes API common to all stock backends
    """
    def __init__(self, *args, **kwargs):
        self.rootUrl = "https://www.alphavantage.co/query"
        self.authenticate()

    def authenticate(self):
        # TODO: Take out env vars
        self.apikey = "E4I0D671EVBSNQVV"

    def get_current(self, ticker, interval="60min"):
        """
        Loads up the fastest, most up to date api, gets the last point
        """
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        return data[0]

    def get_1d_series(self, ticker, interval="5min"):
        # start_date = datetime.strptime('Jun 1 2005  1:33PM', '%b %d %Y %I:%M%p')
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_INTRADAY", ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(days=1)]
        return data

    def get_5d_series(self, ticker, interval="30min"):
        r = requests.get('%s?function=%s&symbol=%s&interval=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", ticker, interval, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (%s)" % interval])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(days=5)]
        return data

    def get_1m_series(self, ticker):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(months=1)]
        return data

    def get_3m_series(self, ticker):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(months=3)]
        return data

    def get_1y_series(self, ticker):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_DAILY", ticker, self.apikey
        ))
        data = self._clean_data(r.json()["Time Series (Daily)"])
        data = [d for d in data if datetime.datetime.strptime(d["timestamp"], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() - datetime.timedelta(months=12)]
        return data

    def get_max_series(self, ticker):
        r = requests.get('%s?function=%s&symbol=%s&apikey=%s&outputsize=full' % (
            self.rootUrl, "TIME_SERIES_WEEKLY", ticker, self.apikey
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
                new_data[inner_key[2:]] = original_data[inner_key]
            new_data["timestamp"] = key
            to_return.append(new_data)
        return to_return
