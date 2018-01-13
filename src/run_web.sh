#!/bin/sh

# wait for PSQL server to start?
sleep 10

# prepare init migration
# python manage.py makemigrations
su -m myuser -c "python manage.py makemigrations"

# migrate db, so we have the latest db schema
# python manage.py migrate
su -m myuser -c "python manage.py migrate"

# collect static files
# python manage.py collectstatic --noinput
su -m myuser -c "python manage.py collectstatic --noinput"

# start development server on public ip interface, on port 8000
# gunicorn wsgi -b 0.0.0.0:8000
# su -m myuser -c "python manage.py runserver 0.0.0.0:8000"
su -m myuser -c "gunicorn wsgi -b 0.0.0.0:8000"
