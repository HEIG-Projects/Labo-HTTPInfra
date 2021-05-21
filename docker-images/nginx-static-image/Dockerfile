FROM nginx

RUN apt-get update && \
  apt-get install -y nano

# COPY nginx.conf /etc/nginx/nginx.conf
COPY src /usr/share/nginx/html
