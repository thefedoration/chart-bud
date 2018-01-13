from __future__ import absolute_import
from exceptions import NotImplementedError

class BaseBackend(object):
    """
    Exposes API common to all stock backends
    """
    def __init__(self, *args, **kwargs):
        self.authenticate()

    def authenticate(self):
        raise NotImplementedError()

    def get_current(self, ticker):
        raise NotImplementedError()

    def get_1d_chart(self, ticker):
        raise NotImplementedError()

    def get_5d_chart(self, ticker):
        raise NotImplementedError()

    def get_1m_chart(self, ticker):
        raise NotImplementedError()

    def get_3m_chart(self, ticker):
        raise NotImplementedError()

    def get_1y_chart(self, ticker):
        raise NotImplementedError()
