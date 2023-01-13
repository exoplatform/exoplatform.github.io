# Database

> By default, eXo Platform uses HSQL and you do not need any configuration to make it work. Follow this chapter only when you need to use another RDBMS.
> Assuredly you can use MySQL or PostgreSQL Optimistically any SQL database that provides a JDBC compliant driver can be used.
>
> In this chapter:
>
> - `Creating databases` You need to create databases. The tables are created automatically in Platform first startup.
> - `Configuring eXo Platform` This section is a complete guide to configure eXo to use a RDBMS.
> - `Configuring Database in a docker install`  This section describes how to configure database in a docker container.
> - `Datasource JNDI name` If for any reason you want to change JNDI name of the datasources, follow this section.
> - `File storage` This section targets to describe the possible ways to store binary files in eXo Platform. It also makes comparison between them to allow administrators to choose the suitable file storage for their environment.
> - `Configuring eXo Chat database` This section introduces the parameters to configure eXo Chat MongoDB database.
> - `Frequently asked questions` This section especially targets to solve some possible issues.

## Creating databases

eXo Platform uses three datasources:

- **IDM**: For Identity Management service.
- **JCR**: For Java Content Repository service.
- **JPA**: To store entities mapped by Hibernate.

Create 3 databases, one for IDM, one for JCR and one for JPA, or you can use the same database for all of them. Leave the databases empty, the tables will be created automatically on Platform first startup.

- If you do not need to support specific characters, it is recommended to use the character set `latin1` and the collation    `latin1_general_cs` (as eXo JCR is case sensitive). For example, in MySQL:

  ```SQL
  CREATE DATABASE plf_jcr DEFAULT CHARACTER SET latin1 DEFAULT
    COLLATE latin1_general_cs;*.
  ```

- If you need to support specific characters, it is recommended to use the character set `utf8` and the collation `utf8_bin` (as eXo JCR is case sensitive). For example, in MySQL:
  
  ```SQL
   CREATE DATABASE plf_jcr DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_bin;*
  ```

- To avoid username/profile duplication, IDM schema should be case insensitive i.e it should use the collaction `latin1_swedish_ci`. For example, in MySQL:
  
  ```SQL
  CREATE DATABASE plf_idm DEFAULT CHARACTER
    SET latin1 DEFAULT COLLATE latin1_swedish_ci;
  ```  

- Grant a user the right to access the databases. The user should be allowed to access remotely from where eXo Platform is hosted.For example, in MySQL:

  ```SQL
    grant all on ${dbname}.* to '$username'@'$IP' identified by '$password';
  ```

  - `$IP` is your app server host name that accepts wildcard (for example, 192.168.1.% = all IPs on 192.168.1.x network).
  - `$username` and `$password` are credentials that eXo Platform will use to connect to the databases.

## Configuring eXo Platform

::: warning
By default, eXo Platform is connected to hsql database. This database could be used for testing purpose but it is not possible to use it in production environments.
:::

eXo Platform relies on the Tomcat application server to access databases. It uses three JNDI datasources:

- IDM uses *exo-idm_portal*.
- JCR uses *exo-jcr_portal*.
- JPA uses *exo-jpa_portal*.

eXo provides the ready-made and fine-tuned configuration so typically you just need to choose a sample and modify the connection url and the credentials.

1. Configure the datasources.
   1. Edit `conf/server.xml` to remove the default HSQL configuration:

      ``` xml
        <!-- eXo IDM Datasource for portal -->
        <Resource name="exo-idm_portal" ...
        username="sa" password="" driverClassName="org.hsqldb.jdbcDriver" .../>
        <!-- eXo JCR Datasource for portal -->
        <Resource name="exo-jcr_portal" ...
        username="sa" password="" driverClassName="org.hsqldb.jdbcDriver" .../>
        <!-- eXo JPA Datasource for portal -->
        <Resource name="exo-jpa_portal" ...
        username="sa" password="" driverClassName="org.hsqldb.jdbcDriver" .../>
      ```

   1. Add a new one. For MySQL as an example, you will just need to copy the sample in `conf/server-mysql.xml`:

      ``` xml
        <!-- eXo IDM Datasource for portal -->
          <Resource name="exo-idm_portal" auth="Container" type="javax.sql.DataSource"
          ...
          username="plf" password="plf" driverClassName="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/plf?autoReconnect=true" />
        <!-- eXo JCR Datasource for portal -->
          <Resource name="exo-jcr_portal" auth="Container" type="javax.sql.DataSource"
          ...
          username="plf" password="plf" driverClassName="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/plf?autoReconnect=true" />
        <!-- eXo JPA Datasource for portal -->
          <Resource name="exo-jpa_portal" auth="Container" type="javax.sql.DataSource"
          ...
          username="plf" password="plf" driverClassName="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/plf?autoReconnect=true&amp;characterEncoding=utf8" />
      ```

   1. Edit username, password, url (host, port and database name).Besides MySQL, if you are using Enterprise Edition, you will
        find the samples for other RDBMSs in `conf/server-*.xml`.

   1. Append this character encoding to the url in case your database character set is `utf8`. For example, in MySQL (this is different between RDBMSs):

     ```TEXT
        url="jdbc:mysql://localhost:3306/plf?autoReconnect=true&amp;characterEncoding=utf8"
     ```

2. Set the SQL Dialect if necessary. This step is not mandatory because the dialect is auto-detected in most cases. You only need to take care of it for some particular RDBMSs:
   - For JCR, only when you are using MySQL and database character set `utf8`, you need to edit `gatein/conf/exo.properties` file to have:

     ```properties
        exo.jcr.datasource.dialect=MySQL-UTF8
     ```

   - For IDM, eXo Platform detects automatically the dialect for RDBMSs listed [here](http://docs.jboss.org/hibernate/orm/4.1/manual/en-US/html_single/#configuration-optional-dialects). Only when your RDBMS is **not** in the list, for example *Postgres Plus Advanced Server 9.2*, you will need to edit `gatein/conf/exo.properties` file to have:

     ```properties
       hibernate.dialect=org.hibernate.dialect.PostgresPlusDialect
     ```

3. Download the JDBC driver for Java and install it to `$PLATFORM_TOMCAT_HOME/lib`.

::: tip
Normally you can find out an appropriate driver for your JDK from your database vendor website. For example, for MySQL: <http://dev.mysql.com/downloads/connector/j/>.
:::

eXo provides the database drivers in specific addons that you can install depending on the database that you will be using.
To install the addon of Mysql Java connector :

```shell
./addon install exo-jdbc-driver-mysql
```

To install the addon of Postgresql Java connector :

```shell
./addon install exo-jdbc-driver-postgresql
```

## Configuring database for a docker container

eXo Platform docker image supports both HSQL and MySQL databases. HSQL database is the default one for testing purposes. To move into production environment, it is highly recommended to connect the docker image to MySQL database.

For that purpose, you should specify some environment variables to the container startup command to make it work. The table below lists these needed variables:
  Variable         | Mandatory    |  Default value   |    Description
  -----------------|--------------|------------|---------------------------
  EXO_DB_TYPE      |  No          |hsqldb      | The database type to be used, supports hsqldb (not for production) and mysql databases.
  EXO_DB_HOST      |  No          | mysql      | The host to connect to the database server.
  EXO_DB_PORT      |  No          | 3306       | The port to connect to the database server.
  EXO_DB_NAME      |  No          |  exo       | The name of the database schema to use.
  EXO_DB_USER      |  No          | exo        |   The username to connect to the database.
  EXO_DB_PASSWORD  |  Yes         |            |   The password to connect to the database.
  
An example of the execution command to use MySQL database for eXo Platform docker image:

```shell  
    docker run -d \
        -p 8080:8080 \
        -e EXO_DB_TYPE="mysql" \
        -e EXO_DB_HOST="mysql.server-hostname.org" \
        -e EXO_DB_USER="exo" \
        -e EXO_DB_PASSWORD="my-secret-pw" \
        exoplatform/exo-community
```

For more details, you can look at this [documentation](https://hub.docker.com/r/exoplatform/exo-community/).

## File Storage

In order to store binary files uploaded by users (such as attachments, documents or profile pictures) eXo Platform needs a file storage subsystem. There are two supported methods to perform file storage:

- File System: files are stored in the server file system in a folder structure as regular files.
- RDBMS: files are stored in the database as BLOBs.

::: tip

You should choose either to store binary data in the database or through file system by setting the suitable value to the variable `exo.files.binaries.storage.type`. Choosing one file storage than the other depends on your data type and size.
:::

::: warning

Note that in case of using database as file storage, binary files are stored in the database table FILES_BINARY however in case of using file system storage, binary files are loaded from a folder of files. If you choose to store data through file system then you want to change to database or vice versa, note that you will lose data files because the source of binary files is different in the two cases. Consequently, you should choose the suitable file storage. if you absolutely need to migrate from RDBMS to File System or vice versa, you need to **implement a migration tool allowing to maintain your binary files.**
:::

### File System storage

- The primary advantage of storing files in the file system is that it is easier to see the actual files.
- Through file system, it is possible to backup and manipulate files separately of the database.
- Files are stored off the database keeping it lighter.

### RDBMS storage

Storing files in the database has many advantages such as:

- The database backup will contain everything: It is easier for backup since only the database must be saved (and optionally the search indices). There is no need for a shared file system in cluster mode (database is shared in cluster mode).
- The database can enforce more subtle controls on access to the files.
- In case of changing files, the DBMS knows how to manage transactions.

### Comparing file system and RDBMS storage

  Feature         | RDBMS                    |  File system
  ----------------|--------------------------|--------------------------
  Transaction support: This feature is needed in case of concurrent access to the same dataset.  | A basic feature provided by all databases. |  Most of file systems don\'t have this feature. Transactional NTFS(TxF), Sun ZFS, and Veritas VxFS, support this feature. With eXo Platform transaction is managed at application level.
  Fast indexing: by most of file systems. It helps fast retrieval of data. | Databases allow indexing based on any attribute or data-property (i.e SQL columns). | This is not offered
  Consistency check |  It is provided by all databases. |     File systems also support data consistency check.
  Clean unused data |  Possible with database. |    File system also ensure data cleanup.
  Clustering        | Advanced databases offer clustering capabilities (such as Oracle and Mysql). | File systems still don't support this option (The only exceptions are Veritas CFS and GFS.
  Replication       | It is a commodity with databases. |  File systems provide replication feature but still need evolution.
  Relational View of Data |  Databases offer easy means to relate stored data. It also offers a flexible query language (SQL) to retrieve the data.| File systems have little or no information about the data stored in the files because it stores files in a stream of bytes.
::: note
When using eXo Platform in cluster mode and choosing to use **file system for binary files storage**, the files folder **should be shared between all the cluster nodes**.
:::

### File storage data backup requirements

::: tip
To back up data, eXo Platform should be **stopped**.
:::

In case of file system storage, to make the binary files backup, you need to:

- Copy the folder of files.
- Backup these 3 database tables: FILES_FILES, FILES_NAMESPACES, FILES_ORPHAN_FILES.

::: warning

In case of using the database for file storage, the tables related to file storage are: FILES_BINARY, FILES_FILES, FILES_NAMESPACES and FILES_ORPHAN_FILES, but you should **backup the whole database** since there are links between these tables and other eXo Platform tables.
:::

For more details about data backup in general, you can take a look on the section `Backup and Restore>`

### Configuration

Some parameters are configurable in`exo.properties`. More details could be found `File Storage Configuration`

## Configuring eXo Chat database

1. eXo Chat uses [MongoDB database](http://docs.mongodb.org). You can install it via this [link](https://www.mongodb.com/download-center).
2. Configure the database parameters in `chat.properties` or `exo.properties`. The files are located in `$PLATFORM_TOMCAT_HOME/gatein/conf`

The parameters to set are the following:

- standaloneChatServer: This parameter accepts a boolean value : true for standalone mode, false for embedded mode.
- dbServerType: Default value is mongo which is the value that should be used.
- dbServerHost: The host of MongoDB database.
- dbServerPort: The port with which you will connect to MongoDB.
- dbServerHosts: The MongoDB nodes to connect to, as a comma-separated list of `<host:port>` values. For example **host1:27017,host2:27017,host3:27017**.
- dbName: The name of the MongoDB database for eXo Chat.
- dbAuthentication: Set to true if authentication is needed to access to MongoDB.
- dbUser: The username with which you should connect of the previous value is set to true.
- dbPassword: The password for MongoDB authentication, it should be modified for security reasons.

Here is an example for the chat configuration file (the database configuration is in the section *MongoDB*):

```properties
    ##########################
    #
    # MongoDB
    #
    dbServerHost=localhost
    dbServerPort=27017
    dbName=chat
    dbAuthentication=false
    dbUser=admin
    dbPassword=pass

    ##########################
    #
    # Chat Server
    #
    standaloneChatServer=false
    chatPassPhrase=chat
    chatServerBase=http://127.0.0.1:8080
    chatServerUrl=/chatServer
    chatPortalPage=/portal/intranet/chat
    chatCronNotifCleanup=0 0 * * * ?
    teamAdminGroup=/platform/users
    chatReadTotalJson=200

    ############################
    #
    # Chat Client updates
    #
    chatIntervalSession=60000
    chatTokenValidity=60000
    chatUploadFileSize=100
    request.timeout=15000
```

::: warning
The parameters `dbServerPort` and `dbServerHost` are deprecated and should be replaced by the parameter `dbServerHosts`.
:::

::: tip

For a quick setup, the Chat add-on by default connects to MongoDB at *localhost:27017* without authentication, so no advanced setup is required if you install MongoDB in the same machine with Platform server.

If you secure MongoDB and allow remote connections, you have to configure the add-on, see `Secured MongoDB`
:::

## Frequently asked questions

**Q:** **How to remove the idle MySQL connections?**

**A:** Some RDBMSs, like MySQL, close the idle connections after a period (8 hours on MySQL by default). Thus, a connection from the pool will be invalid and any application SQL command will fail, resulting in errors as below:

``` shell
    org.hibernate.SessionException: Session is closed!
    at org.hibernate.impl.AbstractSessionImpl.errorIfClosed(AbstractSessionImpl.java:72)
    at org.hibernate.impl.SessionImpl.getTransaction(SessionImpl.java:1342)
```

To avoid this, you can use DBCP to monitor the idle connections and drop them when they are invalid, with the **testWhileIdle**, **timeBetweenEvictionRunsMillis**, and **validationQuery** parameters.

The validation query is specific to your RDBMS. For example, on MySQL, you would use:

``` xml
testWhileIdle="true" timeBetweenEvictionRunsMillis="300000" validationQuery="SELECT 1"
```

- **testWhileIdle** activates the idle connections monitoring.
- **timeBetweenEvictionRunsMillis** defines the time interval between two checks in milliseconds (5 minutes in the example).
- **validationQuery** provides a simple SQL command to validate connection to the RDBMS.

For more details, refer to the following:

- <http://markmail.org/message/a3bszoyqbvi5qer4>
- <http://stackoverflow.com/questions/15949/javatomcat-dying-database-connection>
- <https://confluence.atlassian.com/display/JIRA/Surviving+Connection+Closures>
