#!/bin/sh

# migrations
su -m myuser -c "python manage.py makemigrations"
su -m myuser -c "python manage.py migrate"

# static files
su -m myuser -c "python manage.py collectstatic --noinput"

# start server
su -m myuser -c "gunicorn wsgi -b 0.0.0.0:8000"
