# Start eXo community

This chapter covers the following topics:

- The minimum system requirements needed to run the stack of tools used by eXo platform
- The software prerequisites needed to be installed before running the eXo platform stack

## System requirements

> **Warning**
> The requirements cited below are provisional and may change according to quality tests findings.


To run the Docker compose of eXo Platform 6.4, your system is required
to meet the following specifications or higher:

- CPU: Multi-core recommended, 2GHz minimum.
- Memory: The eXo Platform package is optimized with default settings: max heap size = 4GB and non-heap size = 256MB; so the available memory should be at least 4GB. It is recommended you have a memory of 8GB (4GB free for database, Elasticsearch, Jitsi and Onlyoffice services and file system caches).
- Free disk space: 10GB minimum
- Browser Compatibility: Check Browser compatibility section in
  [Supported Environments](https://www.exoplatform.com/supported-environments)

> **Note**
> The eXo server will run on the port 80 by default, so make sure this port is not currently in use or configure eXo Platform to use another port.

## Prerequisites

The full environment will be provided as Docker containers assembled together using a Docker Compose file. To install and try eXo platform community edition, you need to install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Start eXo platform

### With Dockerfile

- Create a new folder $EXO\_HOME, this file will contain all files needed to run the eXo platform environment
- Download the Docker Compose from [here](https://raw.githubusercontent.com/exo-docker/exo-community/master/docker-compose.yml) and save it under $EXO\_HOME
- Create the folder **conf** which will contain configuration files needed for the services deployed in docker images
- Download the file configuration file of Nging server from [here](https://raw.githubusercontent.com/exo-docker/exo-community/master/conf/nginx.conf) and save it under the folder **conf**
- Using your preferred console, start the environment with the command:

```shell
docker-compose -f docker-compose.yml up
```

- Open your browser and open the URL : <http://localhost/>


### With separated containers

Alternatively, you may want to run each component separately with containers. Required images are :

- [Mongo](https://hub.docker.com/_/mongo) 4.4
- [eXo Platform Elastic Search](https://hub.docker.com/r/exoplatform/elasticsearch) 2.0.3. This image is build by eXo with all
  needed ES addons
- [eXo Platform Community](https://hub.docker.com/r/exoplatform/exo-community) 6.3

To do this, you can use properties described in [this page](https://hub.docker.com/r/exoplatform/exo-community) to configure eXo Community docker image.

The prerequisites are :

- Docker daemon version 12+ + internet access
- 4GB of available RAM + 1GB of disk

The most basic way to start eXo Platform Community edition for *evaluation* purpose is to execute theses steps : 

- Create the network
```bash
docker network create -d bridge exo-network
```

- Start Mongo Server
```bash
docker run -v mongo_data:/data/db -p 27017:27017 --name mongo --network=exo-network mongo:4.4
```
 
- Start ElasticSearch Server
```bash
docker run -e ES_JAVA_OPTS="-Xms2048m -Xmx2048m" -e node.name=exo -e cluster.name=exo -e cluster.initial_master_nodes=exo -e network.host=_site_ -v search_data:/usr/share/elasticsearch/data --name es --network=exo-network exoplatform/elasticsearch:2.0.3
```

- Start eXo Platform Server
```bash
docker run -v exo_data:/srv/exo -p 8080:8080 -e EXO_ES_HOST=es --name exo --network=exo-network exoplatform/exo-community:6.3
```

and then waiting the log line which say that the server is started

```log
2017-05-22 10:49:30,176 | INFO  | Server startup in 83613 ms [org.apache.catalina.startup.Catalina<main>]
```

When ready just go to <http://localhost:8080> and follow the instructions ;-)

Once containers successfully start, you can stop/start them with
```bash
docker stop $CONTAINER_NAME
docker start $CONTAINER_NAME
```
