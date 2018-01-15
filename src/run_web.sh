#!/bin/sh

# migrations
su -m myuser -c "python manage.py makemigrations"
su -m myuser -c "python manage.py migrate"
su -m myuser -c "python manage.py loaddata chartbud/fixtures/init.json"

# fire task to update stocks to current prices
su -m myuser -c "python manage.py update_stocks"

# static files
su -m myuser -c "python manage.py collectstatic --noinput"

# start server
su -m myuser -c "gunicorn wsgi -b 0.0.0.0:8000 --reload --workers 3"