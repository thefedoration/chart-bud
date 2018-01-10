#!/bin/sh

# wait for RabbitMQ server to start
sleep 10

# run Celery worker for our project with Celery configuration stored in Celeryconf
su -m myuser -c "celery worker -A celeryconf -Q default -n default@%h"
