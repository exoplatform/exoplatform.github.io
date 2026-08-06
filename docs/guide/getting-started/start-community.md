# Start eXo community

This chapter covers the following topics:

- The minimum system requirements needed to run the stack of tools used by eXo platform
- The software prerequisites needed to be installed before running the eXo platform stack

## System requirements

::: warning
The requirements cited below are provisional and may change according to quality tests findings.
:::

To run the Docker compose of eXo Platform 7.0, your system is required
to meet the following specifications or higher:

- CPU: Multi-core recommended, 2GHz minimum.
- Memory: The eXo Platform package is optimized with default settings: max heap size = 4GB and non-heap size = 256MB; so the available memory should be at least 4GB. It is recommended you have a memory of 8GB (4GB free for database, Elasticsearch, Jitsi and Onlyoffice services and file system caches).
- Free disk space: 10GB minimum
- Browser Compatibility: Check Browser compatibility section in
  [Supported Environments](https://www.exoplatform.com/supported-environments)
  
::: tip Note
The eXo server will run on the port 80 by default, so make sure this port is not currently in use or configure eXo Platform to use another port.
:::

## Prerequisites

The full environment will be provided as Docker containers assembled together using a Docker Compose file. To install and try eXo platform community edition, you need to install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

::: warning
If you are using Docker desktop, there is a default limitation for resources that may prevent eXo platform server from starting.
Make sure to allow enough resources (Memory, disk, CPU) to the docker containers as explained in [Docker desktop documentation].(https://docs.docker.com/desktop/settings/mac/#resources) for different Operating systems.
:::

## Start eXo platform

### With Docker-compose

- Create a new folder $EXO\_HOME, this folder will contain all files needed to run the eXo platform environment.

::: warning
It is recommended to add **$EXO_HOME** as an environment variable in your system, it will be used in all the tutorials.
:::

- Download the Docker Compose from [here](https://raw.githubusercontent.com/exo-docker/exo-community/master/docker-compose.yml) and save it under $EXO\_HOME
- Create the folder **conf** which will contain configuration files needed for the services deployed in docker images
- Download the file configuration file of Nginx server from [here](https://raw.githubusercontent.com/exo-docker/exo-community/master/conf/nginx.conf) and save it under the folder **conf**
- Using your preferred console, move in the $EXO\_HOME, then start the environment with the command:

```shell
docker-compose -f docker-compose.yml up
```

The default domain name `exoapp.local` can be changed by setting the environment variable `EXO_PROXY_VHOST` in the start command, as shown above:

```shell
export EXO_PROXY_VHOST=exoapp2.local
docker-compose -f docker-compose.yml up
```
::: warning
It is strongly recommended to use a custom domain name instead of `localhost` to ensure that the OnlyOffice Document Server functions properly.
:::
::: warning
If you use domain name exoapp.local, you need to ensure that this domain name is resolvable by your system. You can do this by adding the following line to your hosts file (/etc/hosts):

```shell
127.0.0.1 exoapp.local
```
:::

- Open your browser and open the URL : <http://exoapp.local/> or the custom domain name
- You can create a new user using the form that will be displayed with the first server startup
- If you skip the step above, you can still connect with the super-user of the platform. Its username is **root** and password **password**

### With separated containers

Alternatively, you may want to run each component separately with containers. Required images are :

- [OnlyOffice](https://hub.docker.com/r/onlyoffice/documentserver) 8.2.
- [eXo Platform Elastic Search](https://hub.docker.com/_/elasticsearch) 8.14.3.
- [eXo Platform Community](https://hub.docker.com/r/exoplatform/exo-community) 7.0

To do this, you can use properties described in [this page](https://hub.docker.com/r/exoplatform/exo-community) to configure eXo Community docker image.

The prerequisites are :

- Docker daemon version 12+ + internet access
- 4GB of available RAM + 1GB of disk

The most basic way to start eXo Platform Community edition for *evaluation* purpose is to execute theses steps : 

- Create the network
```bash
docker network create -d bridge exo-network
```

- Start OnlyOffice DocumentServer
```bash
docker run \
      -p ${ONLYOFFICE_HTTP_PORT:-9090}:80 \
      -e JWT_ENABLED=true \
      -e JWT_SECRET=${ONLYOFFICE_SECRET:-d24079cba6ea93aab7a0efcde5143673e8e4cd32be51519112ca604cf4f9bbb6} \
      -e SECURE_LINK_SECRET=${ONLYOFFICE_LINK_SECRET:-fe6c434c36ee04031718b3c53b1d803739da880a142baf17b8f56dc2520877dd} \
      --name onlyoffice --network=exo-network onlyoffice/documentserver:8.2
```

- Start ElasticSearch Server
```bash
docker run -e ES_JAVA_OPTS="-Xms2048m -Xmx2048m" -e node.name=exo -e cluster.name=exo -e cluster.initial_master_nodes=exo -e network.host=_site_ -v search_data:/usr/share/elasticsearch/data --name es --network=exo-network elasticsearch:8.14.3
```

- Start eXo Platform Server
Replace the value of ONLYOFFICE_PUBLIC_IP with the public (local) IP address of the machine hosting the OnlyOffice Document Server, for example, `192.168.1.3`.

::: warning
In this deployment mode, eXo Platform and OnlyOffice should be able to communicate with each other using the same network IP, both for internal interaction and access via the browser (since direct communication using container services does not succeed). Alternatively, they can communicate through an intermediate reverse proxy, as outlined in the provided Docker Compose file section.
:::

```bash
ONLYOFFICE_PUBLIC_IP="10.0.0.1" # Replace this value with a public (local) ip address
docker run -v exo_data:/srv/exo -p 8080:8080 \
 -e EXO_ES_HOST=es \
 -e JAVA_OPTS="-Donlyoffice.documentserver.host=${ONLYOFFICE_PUBLIC_IP} \
-Donlyoffice.documentserver.schema=${ONLYOFFICE_SCHEMA:-http} \
-Donlyoffice.documentserver.allowedhosts=localhost,${ONLYOFFICE_PUBLIC_IP} \
-Donlyoffice.documentserver.accessOnly=false \
-Donlyoffice.documentserver.secret=${ONLYOFFICE_JWT_SECRET:-d24079cba6ea93aab7a0efcde5143673e8e4cd32be51519112ca604cf4f9bbb6}" \
 --name exo --network=exo-network exoplatform/exo-community:7.0.0
```

and then waiting the log line which say that the server is started

```log
exo_1    | 2022-09-20 16:55:43,009 | INFO  | Server startup in [58805] milliseconds [org.apache.catalina.startup.Catalina<main>] 
```

When ready just go to <http://{the_ip_you_choose}:8080> (for example <http://192.168.1.3:8080>) and follow the instructions ;-)

Once containers successfully start, you can stop/start them with
```bash
docker stop $CONTAINER_NAME
docker start $CONTAINER_NAME
```

## Start eXo Platform without docker

The eXo Platform Community edition can also be installed from a standalone ZIP / Tomcat bundle, without Docker. The steps below are for Linux (Debian).

### Prerequisites

- A JDK 21 installed (required for eXo 7.2.0):

```shell
sudo apt install openjdk-21-jdk
```

- The `JAVA_HOME` variable pointing to this JDK (it is auto-detected in most cases, but it's best to set it explicitly):

```shell
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

### Download and extraction

Download the eXo 7.2.0 standalone Tomcat bundle (Community edition):

<https://github.com/exoplatform/platform-public-distributions/releases/download/7.2.0/plf-community-tomcat-standalone-7.2.0.zip>

Extract it wherever you want on the server, e.g. `/opt/exo`:

```shell
unzip plf-community-tomcat-standalone-7.2.0.zip -d /opt/exo
```

This folder becomes `$PLATFORM_TOMCAT_HOME`.

### Permissions

On Linux, the scripts need execute permission, otherwise you'll get an error like `Cannot find ./bin/catalina.sh`:

```shell
cd $PLATFORM_TOMCAT_HOME
chmod +x bin/*.sh start_eXo.sh stop_eXo.sh
```

### Database

By default the bundle starts with an embedded HSQLDB, handy for quick testing but should be reserved for testing only.

::: tip Note
For more serious use, configure an external database (PostgreSQL or MySQL) by following the [database configuration guide](https://docs.exoplatform.org/administration/database.html#configuring-exo-platform).
:::

### Elasticsearch

eXo 7.2.0 requires Elasticsearch 8.18. By default, eXo expects an ES instance available at `https://localhost:9200`.

Follow the official Elastic documentation for the installation:

- [Install Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/8.18/install-elasticsearch.html)
- [Install Elasticsearch on Debian](https://www.elastic.co/guide/en/elasticsearch/reference/8.18/deb.html)

### Start / stop

```shell
# Start in the foreground
./start_eXo.sh

# Start in the background
./start_eXo.sh --background

# Stop
./stop_eXo.sh
```

::: tip Note
As a last resort, a background instance can also be stopped with `./stop_eXo.sh -force` or `kill -9`.
:::

Startup is complete when you see a message like this in the logs:

```log
Server startup in [...] milliseconds [org.apache.catalina.startup.Catalina<main>]
```

### Logs

Check `$PLATFORM_TOMCAT_HOME/logs` if there's an issue at startup.

### First access

Once started, the platform is accessible at <http://your-server:8080/portal> (Tomcat's default port).

For more details, the official documentation covers system and database configuration in depth:

- [Installation (Tomcat bundle)](https://github.com/exoplatform/exo-documentation/blob/master/docs/Installation.rst)
- [Database configuration](https://github.com/exoplatform/exo-documentation/blob/master/docs/database_configuration.rst)
- [Getting started](https://docs.exoplatform.org/guide/developer-guide/getting-started.html)
