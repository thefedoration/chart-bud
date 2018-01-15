#!/bin/sh

sleep 5

# run Celery worker
su -m myuser -c "celery worker -A celeryconf -Q default -n default@%h"
