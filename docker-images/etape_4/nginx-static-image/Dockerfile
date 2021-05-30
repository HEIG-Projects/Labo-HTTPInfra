FROM nginx

RUN apt-get update && \
  apt-get install -y vim nano tcpdump netcat net-tools

# COPY nginx.conf /etc/nginx/nginx.conf
COPY src /usr/share/nginx/html
