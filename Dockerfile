############################################################
# Dockerfile to run a Django-based web application
# Based on an AMI
############################################################
# Set the base image to use to Ubuntu
FROM ubuntu:14.04

# Details & Env Vars
MAINTAINER Fedor Garin

# Download some useful stuff for the image
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y python python-pip
RUN apt-get install -y python-dev
RUN apt-get --help
RUN apt-get install -y libpq-dev
RUN apt-get install -y libssl-dev
# RUN apt-get install -y libmysqlclient-dev
# RUN apt-get install -y git
RUN apt-get install -y vim
# RUN apt-get install -y mysql-server
# RUN apt-get install -y nginx

# copy over files and install requirements
RUN mkdir /code
WORKDIR /code
COPY ./config/requirements.txt /code
RUN pip install -r requirements.txt
COPY ./src/ ./

# Go to server project, make entrypoints executable
RUN ["chmod", "+x", "./run_web.sh", "./run_celery.sh"]

# Create application subdirectories
# RUN mkdir media static logs
# VOLUME ["/code/media/", "/code/logs/"]

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# COPY ./django_nginx.conf /etc/nginx/sites-available/
# RUN ln -s /etc/nginx/sites-available/django_nginx.conf /etc/nginx/sites-enabled
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf