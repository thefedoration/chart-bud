# coding=UTF8
from __future__ import absolute_import

import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chartbud.settings.base")

app = Celery('chartbud')

CELERY_TIMEZONE = 'UTC'

app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


# CELERY BEAT
app.conf.beat_schedule = {
    'update_stocks': {
        'task': 'stocks.tasks.update_stocks',
        'schedule': crontab(day_of_week='mon-fri', hour='9-17', minute='*'),
    },
    'update_results': {
        'task': 'stocks.tasks.update_results',
        'schedule': crontab(minute='*/5'),
    },
}