FROM php:7.4-apache

COPY conf/ /etc/apache2/

RUN apt-get update && \
  apt-get install -y vim nano tcpdump netcat net-tools

RUN a2enmod proxy proxy_http && a2ensite 000-* 001-* #active les configurations du proxy
