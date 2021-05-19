#!/bin/bash
docker run -d -p 9090:3000 res/nodeserv
# -d pour démarre en arrière plan
# -p port-mapping, écoute sur le port 8989 en local de la part du port 80 sur le container
