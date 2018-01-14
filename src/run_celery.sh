#!/bin/sh

# run Celery worker
su -m myuser -c "celery worker -A celeryconf -Q default -n default@%h"
