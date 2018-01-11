############################################################
# Dockerfile to run a Django-based web application
# Based on an AMI
############################################################
# Set the base image to use to Ubuntu
FROM ubuntu:14.04

# Details & Env Vars
MAINTAINER Fedor Garin

ENV DOCKYARD_SRC=django_project
ENV DOCKYARD_SRVHOME=/srv
ENV DOCKYARD_SRVPROJ=$DOCKYARD_SRVHOME/$DOCKYARD_SRC

# Update the default application repository sources list
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y python python-pip
RUN apt-get install -y python-dev
# need for postgres?
RUN apt-get --help
RUN apt-get install -y libpq-dev
# RUN apt-get install -y libmysqlclient-dev
# RUN apt-get install -y git
RUN apt-get install -y vim
# RUN apt-get install -y mysql-server
# RUN apt-get install -y nginx

# Create application subdirectories
WORKDIR $DOCKYARD_SRVHOME
RUN mkdir media static logs

#read
VOLUME ["$DOCKYARD_SRVHOME/media/", "$DOCKYARD_SRVHOME/logs/"]

# convert this to our paths to make the build faster
# RUN mkdir /code
# WORKDIR /code
# ADD ./requirements/docker.txt /code/requirements/
# RUN pip install -r /code/requirements/docker.txt
# ADD ./code/


# Copy application source code to SRCDIR
COPY $DOCKYARD_SRC $DOCKYARD_SRVPROJ

# Install Python dependencies
RUN pip install -r $DOCKYARD_SRVPROJ/requirements.txt

# Port to expose
EXPOSE 8000

# Go to server project, make entrypoints executable
WORKDIR $DOCKYARD_SRVPROJ
RUN ["chmod", "+x", "./run_web.sh", "./run_celery.sh"]

# create unprivileged user
RUN adduser --disabled-password --gecos '' myuser

# COPY ./django_nginx.conf /etc/nginx/sites-available/
# RUN ln -s /etc/nginx/sites-available/django_nginx.conf /etc/nginx/sites-enabled
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf
# RUN ["chmod", "+x", "/docker-entrypoint.sh"]
# ENTRYPOINT ["/docker-entrypoint.sh"]