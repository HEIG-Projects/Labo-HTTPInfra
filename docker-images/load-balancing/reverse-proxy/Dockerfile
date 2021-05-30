FROM php:7.4-apache

COPY apache2-foreground /usr/local/bin/

COPY conf/ /etc/apache2/
COPY templates/ /var/apache2/templates/

RUN apt-get update && \
  apt-get install -y vim nano tcpdump netcat net-tools

RUN a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests headers && a2ensite 000-* 001-* #active les configurations du proxy