# Labo-HTTPInfra

## Etape 1

L'objectif de cette partie est la création d'un serveur web "dockerisé" servant du serveur statique

### Configuration

La configuration de cette partie est disponible dans le dossier `./docker-images/nginx-static-image`

Vous trouvez trois fichier

**Dockerfile**

```dockerfile
FROM nginx
# COPY nginx.conf /etc/nginx/nginx.conf
COPY src /usr/share/nginx/html
```

Celui-ci est le fichier Dockerfile qui va importer le serveur nginx dans le contrainer est ce qu'il aura besoin.  On visulise que si on enlève le commentaire, et place dans ce répertoire une configuration nginx personnelle, alors celle-ci sera mise à jour. La dernière ligne copie le site qui sera publié sur le serveur web.

**build-images.sh**

```
#!/bin/bash
docker build -t res/nginx-server .
```

Ce script permet simplement de créer une image avec le Dockerfile

**run-container.sh**

```
docker run -d -p 8989:80 res/nginx-server
# -d pour démarre en arrière plan
# -p port-mapping, écoute sur le port 8989 en local de la part du port 80 sur le container
```

Ce script permet de créer un container avec l'image préalablement crée. Il ouvre un port http du serveur sur le port 8989.

### Démonstration

1. Cloner ce projet

2. Se placer dans le dossier `/docker-images/nginx-static-image`

3. Lancer la commande `./build-image.sh` Cette opération peut prendre quelque minutes, car elle importe l'image nginx.

4. Lancer la commande `./run-container.sh`. Elle va ouvrir le port 8989 en localhost (ou si Docker-Machine une autre adresse)

5. Accéder au contenu de la page pour vérifier son contenu

   1. Avec votre invite de commande 

      ![image-20210518211341065](figures/image-20210518211341065.png)

   2. Avec votre navigateur

      ![image-20210518211414819](figures/image-20210518211414819.png)

### Fichier de configuration du serveur

Pour visualiser le contenu du fichier de configuration, on va créer un container  à partir de l'image, récupérer son id avec `docker ps`, et  ensuite lancer une de ces deux commandes :

- `winpty docker exec -it res/nginx-server //bin//bash` (Windows)

- `docker exec -it res/nginx-server /bin/bash` (Linux, Mac)

Dès qu'on est dans le système de fichier, il est possible de visualiser ce fichier de configuration nginx avec `cat /etc/nginx/nginx.conf`

![image-20210518210253132](figures/image-20210518210253132.png)

Il s'agit de la configuration de base, donc elle n'est pas encore très détaillée.

## Partie 2

### Objectif

Nous voulons dans cette partie lancer un container qui génèrera du contenu dynamiquement. Ce contenu doit être au format JSON et accessible depuis un navigateur web.

### Explication de la configuration

#### Exécution hors docker

Toute la configuration s'exécute dans le dossier express-image

La première étape a été d'installer les différents modules utilisés. En l'occurrence: express et chance.

Donc, dans le dossier src :

````bash
npm install --save express
npm install --save chance
````

Express permet de générer des serveurs HTTP très rapidement. Le module Chance quant à lui, permet de générer des données aléatoirement.

Il a fallut modifier ensuite le index.js afin de générer dynamiquement des données.

````javascript
var Chance  = require('chance');
var chance = new Chance();

var express  = require('express');
var app = express();

app.get('/test', function(req, res){
    res.send("Hello RES - test ");
});

app.get("/api/companies", function(req, res){
    res.send(generateCompanies());
});

app.get('/', function(req, res){
    res.send("Welcome on the RES server");
});

app.listen(3000, function () {
    console.log("Accept HTTP requests on port 3000");
});


function generateCompanies(){
    var numberOfCompanies = chance.integer({
        min:0,
        max:10
    });
    console.log("Number of companies generated: " + numberOfCompanies);
    var companies = [];
    for(var i = 0; i < numberOfCompanies; ++i) {
        var companyName = chance.company();
        var companyNameNoSpace = companyName.replace(/\W/g, '');
        companies.push({
            name: companyName,
            adress: chance.address({
                short_suffix: true
            }),
            website: chance.url({
                domain: "www." + companyNameNoSpace + ".com"
            }),
            income: chance.dollar({
                min: 100000,
                max: 1000000000
            })
        });
    }

    console.log(companies);
    return companies;
}

````

Nous avons décidé de générer des entreprises avec leur nom, leur adresse, leur site web, et leurs revenus.

A ce niveau, l'application est déjà exécutable grâce à node. 

Rendez vous dans le dossier src, ouvrez un terminal tapez la commande : 

````bash
node index.js
````

Ceci va lancer l'application et afficher:

````
Accepting HTTP requests on port 3000.
````

Ouvrez ensuite un 2e terminal, et tapez la commande:

````bash
telnet localhost 3000
````

Attendez que la connexion s'exécute puis taper la requête HTTP

````http
GET /api/companies HTTP/1.0
````

Ceci affichera un nombre aléatoire d'entreprise au format JSON, celles-ci générées aléatoirement: 

![image-20210526193449854](figures/image-20210526193449854.png)

#### Exécution dockerisée

Il faut d'abord écrire le docker file: 

````dockerfile
FROM node:14.17

COPY src /opt/app

CMD ["node", "/opt/app/index.js"]
````

Celui-ci importe node dans sa version 14.17 qui est la version la plus récente. On peut également voir que le docker défini aussi le  fichier javascript appelé. En l'occurence, c'est celui créé précédemment à savoir index.js.

Pour simplifier la création de l'image et l'exécution, nous avons créés 2 scripts: build-image.sh et run-container.sh. Ils doivent être exécuté dans cet ordre afin de créer l'image docker.

build-image:

````bash
#!/bin/bash

docker build -t res/nodeserv .
````

run-container:

````bash
#!/bin/bash
docker run -d -p 9090:3000 res/nodeserv
# -d pour démarre en arrière plan
# -p port-mapping, écoute sur le port 8989 en local de la part du port 80 sur le container
````

Ceci fait, nous vérifions que l'image docker est bien en cours de fonctionnement grâce à la commande ``docker ps``

![image-20210526195221680](figures/image-20210526195221680.png)

Ainsi nous pouvons n'avons plus qu'à nous rendre sur le navigateur pour exécuter la requête. Pour ce faire, il faut ouvrir le navigateur et dans la bar de recherche taper ``localhost:9090/api/companies``

![image-20210526190002188](figures/image-20210526190002188.png)

### En bref: démonstration

1. Cloner ce projet
2. Se placer dans le dossier `/docker-image/etape2/express-images`
3. Lancer le script `build-image.sh`
4. Lancer le script `run-container.sh`

A ce moment votre image docker est lancé et fonctionnelle.

5. Sur votre navigateur, dans la bar de recherche tapez: `localhost:9090/api/companies`
6. Le navigateur vous afficher les entreprises générées dynamiquement

## Partie 3

Le but de cette partie est de mettre à disposition un pool de container pour créer un reverse proxy

### Configuration

Il y a 3 image docker qu'il faudra créer au préalable pour mettre en place cette configuration.

Les deux première ont déjà été crée dans les étape différentes Il suffit de vous documenter ci-dessus pour les créer), et la dernière est disponible dans le dossier `Labo-HTTPInfra/reverse-proxy` et son implémentation est plus bas dans cette documentation.

#### Fonctionnement

L'infrastructure sera similaire à la suivante : Les deux containeurs des images crées aux étapes précédentes serviront de fournisseurs de ressource au serveur de reverse proxy. Lorsqu'un client souhaitera obtenir du contenu, il contactera le serveur approprié, et renverra le reverse-proxy reverra lui-même les ressource qu'il a pu récupérer. 

![image-20210519134507669](figures/image-20210519134507669.png)

#### Reverse proxy

Premièrement, il faut créer un Dockerfile qui puisse créer le serveur apache reverse-proxy.

**Dockerfile**

```dockerfile
FROM php:7.4-apache

COPY conf/ /etc/apache2 # copie de la configuration locale sur serveur

RUN apt-get update && \
  apt-get install -y vim nano tcpdump netcat net-tools # outils administration

RUN a2enmod proxy proxy_http # module proxy

RUN a2ensite 000-* 001-* #active site
```

On voit sur ce Dockerfile ci-dessus qu'il copie le contenu du dossier conf en local. la structure est la suivante

```
.
├── Dockerfile
└── conf
    └── sites-available
        ├── 000-default.conf
        └── 001-reverse-proxy.conf
```

**000-default.conf**

```
<VirtualHost *:80>
</VirtualHost>
```

Cette comfiguration étonnante permet de refuser toute les connexions qui ne vont pas en direction de l'hôte `res.heigvf.ch`

**001-reverse-proxy.conf**

```
<VirtualHost *:80>
        ServerName res.heigvd.ch

        #ErrorLog ${APACHE_LOG_DIR}/error.log
        #CustomLog ${APACHE_LOG_DIR}/access.log combined

        ProxyPass "/api/password/" "http://172.17.0.2:3000/" #Node
        ProxyPassReverse "/api/password/" "http://172.17.0.2:3000/"

        ProxyPass "/" "http://172.17.0.3:80/" # nginx statique
        ProxyPassReverse "/" "http://172.17.0.3:80/"
</VirtualHost>
```

Cette configuration va permettre de gérer deux redirection: si l'host de destination est bien `res.heigvd.ch`, alors il va utiliser cette configuration. Si l'URL qui est accédé est `/api/password/`, alors ce sera redirigé vers le serveur Node.js. Pour toute les autre URL, il va regarder sur le serveur statique nginx. 

**Notes** : Il faut bien faire attention à ce que les containers aient les bonnes adresses IP à leur démarrage.

## Démonstration

1. Cloner ce repository

2. Build les images de l'étape 1 et 2 avec leur script respectif `build-image.sh`

3. Allumer les 2 premiers containers dans cette ordre

   1. `docker run -d --name express_dynamic res/nodeserv`
   2. `docker run -d --name nginx_static res/nginx-server`

4. Vérifier que les adresses IP soient les bonnes

   1. `docker inspect express_dynamic | grep -i ipaddress` -> `172.17.0.2`
   2. `docker inspect nginx_static | grep -i ipaddress` -> `172.17.0.3`
   3. Si incorrect, changer fichier `docker-images/reverse-proxy/conf/sites-available/001-reverse-proxy.conf` avec les bonne adresse.

5. Placer vous dans le dossier `docker-images/reverse-proxy` et exécuter le script `build-image.sh`

6. Lancer un container avec `run -d -p 8080:80 res/reverse-proxy`

7. Ajouter une correspondance entre votre adresse IP d'accès à vos contrainer (127.0.0.1 pour Docker Desktop ou 192.168.99.100 docker-machine) et l'adresse `res.heigvd.ch`

8. Essayer la configuration

   1. Sur votre navigateur avec l'adresse http://res.heigvd.ch:8080

      ![image-20210519142736229](figures/image-20210519142736229.png)

      

   2. En tentant d'accéder au serveur Node via le reverse proxy

      ![image-20210519142842401](figures/image-20210519142842401.png)

      

   3. Accéder à une page inexistante, le serveur pas défaut retourne un statut 404![image-20210519143006506](figures/image-20210519143006506.png)

   4. Accéder avec l'adresse ip cible directement ne fonctionne pas non plus car il faut que l'hôte de destination soit le bon![image-20210519143255858](figures/image-20210519143255858.png)





