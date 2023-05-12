# Configuration

This chapter covers the following topics:

## Configuration overview

In eXo Platform, a lot of configuration options are customizable via
properties. If you want to change the default configurations of eXo
Platform, simply do as follows:

1. Create your own `.properties` file that must be named
 `exo.properties`. This file contains all configurations to be customized: `$PLATFORM_TOMCAT_HOME/gatein/conf/exo.properties`. A `.properties` file has no header, so you do not need to preserve the header. You can refer to `exo-sample.properties` that is provided by default but has no effect on the eXo Platform configuration. This default file exposes all properties you can override or extend, but in comments (#). Instead of creating new, you can rename `exo-sample.properties` into `exo.properties`, then make changes on your needed properties and remove their comments.
2. Add configurations to be customized in `exo.properties`. Pay attention to the followings:
   - Each property is defined on one line that conforms to the syntax: *property_name=property_value*.
   - Order of the property lines does not take any effect, but it is important that you use the exact key of each property in`exo.properties` that is already exposed in `exo-sample.properties` or listed in this chapter. The usage of properties and their keys are detailed in the later sections.
   - The text before the equal sign is the key that you should not change and the text after the equal sign is the property\'s value that you can edit.
3. Save and restart the eXo Platform server for your changes to take effect.

Besides the capability of customizing configurations in `exo.properties`, you can follow in another way by adding a system property, either in `bin/setenv-customize.sample.(sh|bat)` or `bin/standalone-customize.sample.conf(.bat)`, or in any your custom scripts.

::: warning
There are some configuration properties that will not be configurable by the system property but in `exo.properties` only, including:

- `exo.jcr.cluster.jgroups.config`
- `exo.service.cluster.jgroups.config`
- `exo.jcr.cache.config`
- `exo.jcr.cache.config.workspace.portal-system`
- `exo.jcr.lock.cache.config`
- `exo.jcr.index.cache.config`
- `exo.cache.config.template`
:::

## eXo Platform configuration

In eXo Platform, almost all configurations are performed in a folder
that is controlled by a system property named **exo.conf.dir**. This
property is set by `setenv.*` scripts.

The default value of **exo.conf.dir** is:
`$PLATFORM_TOMCAT_HOME/gatein/conf`.

That folder contains the following main files that you need to take
care: `exo.properties` (if you need to override the eXo Platform
configurations); `configuration.xml` and
`portal/${PORTAL_NAME}/configuration.xml` (if having the \${PORTAL_NAME}
portal container).

::: tip

The xml configuration is mainly done during the development phase, whereas the configuration in `exo.properties` targets the deployment phase. So configurations that you want to customize should be done in the `exo.properties` file.
:::

To understand more clearly the role of those files, let\'s begin with the portal container concept.

The eXo Platform Kernel collects runtime components in the portal containers. A portal container holds all components to run a portal instance. It serves pages under the servlet context for its name.

The default portal container in eXo Platform is called \"portal\". This explains why the default URL of the samples is [http://localhost:8080/portal](http://localhost:8080/portal). The default portal container can be configured directly inside **exo.conf.dir**.

eXo Platform is capable of running several portal instances simultaneously on the same server. Each instance can be configured and customized independently via files located at: `portal/${PORTAL_NAME}` (under **exo.conf.dir**), where **\${PORTAL_NAME}** is the name of the portal container.

Services that run inside a portal container are declared via the xml configuration files like `configuration.xml`. Such files exist in jars, wars and below **exo.conf.dir**.

The `.xml` configuration files also serve as the main way to customize the portal via the multiple plugins offered by the eXo Platform components.

Additionally, the `.xml` files may contain variables that are populated via properties defined in `exo.properties`. Hence, the `exo.properties` file serves as exposing some selected variables that are necessary to configure eXo Platform in a server environment.

### exo.properties

This file can be added to easily override or extend configurations of eXo Platform. The important variables that can be overridden are exposed in a sample properties file named `exo-sample.properties`, but in comments.

### configuration.xml

This file contains the built-in configuration for the **portal** portal container.

- In most cases, you should not change this file.
- In case you do not want to use \"portal\" as the default portal for your project, this file can be used to import another PortalContainerDefinition into the root container.

### portal/portal/configuration.xml

The extra configuration for the \${PORTAL_NAME} portal container if any.
This is where further customizations (for \${PORTAL_NAME} portal
container) can be placed. Generally, custom configurations are provided by extension wars. However, this file is the last loaded by Kernel. It has a higher priority over any other configuration files, including extensions. So, you can override any internal component configuration.

This may turn handy services or configurations that are not exposed in `exo.properties`.

## Properties reference

This page is a reference to configurations exposed via `exo.properties`.

 ::: warning

 This is not an exhaustive list. Some properties are not documented in this chapter, because they are extremely rarely used by administrators. If the property you are searching for is not here, search it in the whole documentation and raise a question in [Community Discussions](https://github.com/exoplatform/exo-community/discussions), if necessary.
:::

### Platform

| Name | Description  | Default |
|------|--------------|---------|
| `exo.base.url`|     |         |
| `exo.accountsetup.skip| Skips "account   | false          |
| `exo.super.user` | Super user of the platform   | root |
| `exo.portal.resetpassword.expiretime`   | The expiration time of a reset password link| 24 (hours)           |

### Search connector

Name|Description|Default
-----|-----------|------
exo.[searchConnectorName].connector.[informationType].enable|Turn on/off a specific Search connector for a certain information type.|true
exo.unified-search.indexing.file.maxSize|Maximum size of files to index|20 MB
exo.unified-search.indexing.supportedMimeTypes|List of indexed file Types|

### Unified Search

| Name                        | Description    | Default              |
|-----------------------------|----------------|----------------------|
| `exo.unified-search.engine.fuzzy.enable        | Enable fuzzy search or not?   | true                 |
| `exo.unified-search.engine.fuzzy.similarity  | A float number between 0 and 1 expressing how much a returned word matches the keyword. 1 is exact search.| 0.5                  |
| exo.unified-search.excluded-characters  | List of characters that will not be indexed (so could not be searched). | `.-` |

### JCR

| Name                        | Description    | Default              |
|-----------------------------|----------------|----------------------|
| exo.jcr.datasource.dialect  |  most cases the dialect is auto-detected. Follow the link to know exceptions. | auto |
| exo.jcr.storage.enabled     | Enable file system storage for JCR values? | true |
||

### ECMS

| Name                        | Description    | Default              |
|-----------------------------|----------------|----------------------|
| exo.ecms.connector.drives.uploadLimit | Maximum size (in MB) allowed of an uploaded file. | 200                  |
| exo.portal.uploadhandler.public-restriction | Turn on/off public access to the upload service. | true                 |
| exo.ecms.connector.drives.clientLimit | The maximum number of concurrent uploaded files in client side.| 3  |
| exo.ecms.connector.drives.serverLimit | The maximum number of concurrent uploaded files in server side. | 20  |
| exo.ecms.search.excluded-mimetypes | Content of these mimetypes will not be searched. | text/css, text/javascript, text/ecmascript |
| exo.ecms.search.enableFuzzySearch | Enable fuzzy search or not? | true                 |
| exo.ecms.search.fuzzySearchIndex | A float number between 0 and 1 expressing how much a returned word matches the search keyword. 1 means extact search| 0.8 |
| exo.ecms.lock.admin        | Users or groups whop can manage locks      | \*:/platform/administrators       |
| exo.ecms.friendly.enabled  | Enable friendly URL maker or not?       | true                 |
| exo.ecms.friendly.servletName | The friendly name used when making friendly URLs  | content              |
| exo.ecms.document.thumbnails.enabled   | Enable Thumbnail Icon for office documents and images            | true                     |

#### ECMS Watch Document

| Name                          | Description  | Default               |
|-------------------------------|--------------|-----------------------|
| exo.ecms.watchdocument.sender| The "from" field in the emails. | support@exoplatform.com |
| exo.ecms.watchdocument.subject | The subject of the notification emails. | “Your watching document is changed” |
| exo.ecms.watchdocument.mimetype | Mimetype of the message body. | text/html |
| exo.ecms.watchdocument.content | The message body. | Check it yourself in exo-sample.properties |

#### ECMS Document versioning

| Name                         | Description  | Default               |
|------------------------------|--------------|-----------------------|
| exo.ecms.documents.versioning | The drives that are enabled for Document versioning. | Managed Sites,Groups,Personal |
| exo.ecms.documents.versions.max | The max number of versions that a document can have. | 0 (no limit) |
| exo.ecms.documents.versions.expiration | The expiration time (in days) of a document version.|  0 (no limit) |

#### ECMS Document viewer

| Name                         | Description  | Default               |
|------------------------------|--------------|-----------------------|
| exo.ecms.documents.pdfviewer.max-file-size|Max file size of documents for preview, in MB|10|
| exo.ecms.documents.pdfviewer.max-pages|Max number of pages of documents for preview|99|

#### Site metadata

| Name                         | Description  | Default               |
|------------------------------|--------------|-----------------------|
| exo.dw.portalConfig.metadata.override | Don’t change this unless you customize the DW site.| false |
| exo.dw.portalConfig.metadata.importmode | Don’t change this unless you customize the DW site. | insert |

#### Datasource

| Name                         | Description  | Default               |
|------------------------------|--------------|-----------------------|
| exo.jcr.datasource.name|JCR datasource name.|java:/comp/env/exo-jcr|
| exo.idm.datasource.name|IDM datasource name.|java:/comp/env/exo-idm|

#### Clustering

| Name           | Description      | Default       |  
|----------------|-------------------|--------------|
| exo.cluster.partition.name | Give a string to identify your cluster, to avoid conflict with other clusters in the network.| DefaultPartition |
| exo.jcr.cluster.jgroups.tcp.\* | JGroups configuration for JCR using TCP.| |
| exo.jcr.cluster.jgroups.udp.\* | JGroups configuration for JCR using UPD. | |
| exo.service.cluster.jgroups.tcp\* | JGroups configuration for Service layer caches clustering using TCP.|                 |
| exo.service.cluster.jgroups.udp.\* | JGroups configuration for Service layer caches clustering using UDP.           |                 |
| exo.jcr.cluster.jgroups.config | Path to customized JGroups configuration file, applied to JCR.|                 |
| exo.jcr.cluster.jgroups.config-url | URL to your customized JGroups configuration file, applied to JCR.|                 |
| exo.service.cluster.jgroups.config    | Path to your customized JGroups configuration file, applied to Service layer caches.     |     |

### Elasticsearch Properties

  Name                                |               Description          |      Default
  --------------------------------------------------|--------------------------|-------------------------
  exo.es.version.minor | The expected minor Elastisearch version compatible with eXo Platform. | 5.6
  es.cluster.name | Cluster name identifies your Elasticsearch clusterfor auto-discovery. If you're running multiple clusters on the same network, make sure you're using unique names. | exoplatform-es
  es.network.host and \'publish_host\' | Sets both \'bind_host\' params. More details [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html#advanced-network-settings) | 127.0.0.1
  es.discovery.zen.ping.unicast.hosts | In Unicast dicovery mode, this parameter lets you set a list of master nodes in the cluster to perform discovery when new nodes (master or data) are started.| 127.0.0.1 |
  es.http.port | TCP Port of the ES node. | 9200
  es.path.data | Local path to the directory where to Elasticsearch will store index data allocated for this node. | gatein/data

#### Elasticsearch Client

  Name                | Description   |  Default
  --------------------|---------------|----------
  exo.es.search.server.url | URL of the node used for searching. Required
  exo.es.search.server.username | Username used for the BASIC authentication on the Elasticsearch node used for searching.
  exo.es.search.server.password | Password used for the BASIC authentication on the Elasticsearch node used for searching.
  exo.es.index.server.url | URL of the node used for indexing.
  exo.es.index.server.username | Username used for the BASIC authentication on the Elasticsearch node used for indexing.
  exo.es.index.server.password | Password used for the BASIC authentication on the Elasticsearch node used for indexing.

#### Elasticsearch Indexing properties

   Name | Description    |    Default
  ------|----------------|------------------
  exo.es.indexing.batch.number | Maximum number of documents that can be sent to Elasticsearch in one bulk request. | 1000
  exo.es.indexing.request.size.limit | Maximum size (in bytes) of an Elasticsearch bulk request. | 10485760 (= 10Mb)
  exo.es.reindex.batch.size | Size of the chunks of the reindexing batch. | 100
  exo.es.indexing.replica.number.default | Number of replicas of the index. | 1
  exo.es.indexing.shard.number.default | Number of shards of the index. | 5

### Enable/Disable activity type

  Name | Description | Default
  -----|-------------|---------------
  exo.activity-type.activity-type-key.enabled | The property that allows to enable or disable an activity having the type key `activity-type-key` from posting in the streams.| true

### File storage configuration

  Name | Description | Default
  -----|-------------|--------
  exo.files.binaries.storage.type | Allows to define the file storage way: File system (type=fs) or RDBMS (type=rdbms). |  fs
  exo.commons.FileStorageCleanJob.enabled | Enables/disables the job that cleans unused files. | true
  exo.commons.FileStorageCleanJob.retention-time | The retention time of unused files | 30 days
  exo.commons.FileStorageCleanJob.expression | The cron job expression for scheduling the file cleaner job| 0 0 11 ? \* SUN
  exo.files.storage.dir | The location where to store binary files in case of file system storage. In cluster mode, this location (folder) should be shared. | {exo.data.dir}/files
  
### Groovy templates statistics

  Name                                    | Description        |  Default
  ----------------------------------------|------------------|--------------------------
  exo.statistics.groovy.template.enabled  | Enables/disables Groovy Templates statistics that is collected asynchronously. | true

### Files upload limit

  Name                     |  Description     |   Default
  -------------------------|------------------|--------------------------
  exo.ecms.connector.drives.uploadLimit | Maximum size (in 200 MB) allowed of an uploaded file. | 
  exo.social.activity.uploadLimit | Maximum size (in 200 MB) allowed of an uploaded image through the CKEditor. | 

### Agenda

  Name  | Description | Default
  ------|-------------|----------
  `exo.agenda.calendar.defaultColor1` | to A set of default colors to use for newly created Space Calendars | defaultColor1:#08a554<br>defaultColor2:#f8b121<br>defaultColor3:#ee7429<br>defaultColor4:#e5282c<br>defaultColor5:#e32386<br>defaultColor6:#2aa8e2<br>defaultColor7:#743289<br>defaultColor8:#ac2986<br>defaultColor9:#3853a0<br>defaultColor10:#32388c
  `exo.agenda.reminder.computing.period` | Reminders of occurrent events are computed periodically to store its exact date of notification. This 2 (two days) is the period, in days, of next upcoming event reminders to compute using a Periodic Job.
  `exo.agenda.webConferencing.default` | Name of default Web Conferencing Provider to use. | jitsi (when exo-jitsi addon is installed)
  `exo.agenda.settings.agendaDefaultView` | Default user setting for Agenda view for new users. Possible values: month, week or day | week
  `exo.agenda.settings.agendaWeekStartOn` | Default user setting for first day of the week. Possible values: MO, TU, WE, TH, FR, SA or SU | MO
  `exo.agenda.settings.showWorkingTime` | Default user setting for showing or not working time in Agenda (add gray background on non working hours) | false
  `exo.agenda.settings.workingTimeStart` | Default user setting for working hour start | 09:00
  `exo.agenda.settings.workingTimeEnd` | Default user setting for working hour end | 18:00
  `exo.agenda.settings.automaticPushEvents` | Default user setting for automatic pushing events remotely into connected Remote Agenda Provider or not. | true  
  `exo.agenda.google.connector.enabled` | Global setting to allow users to connect their personal Google Calendar with eXo Agenda or not. | true
  `exo.agenda.google.connector.key` | Client API Key to be generated from Google Console to identify current site that uses eXo Agenda application. |
  `exo.agenda.google.connector.secret` | Client secret key to be generated from Google Console to identify current site that uses eXo Agenda application. | 
  `exo.agenda.office.connector.enabled` | Global setting to allow users to connect their personal Office 365 Outlook Calendar with eXo Agenda or not. | true
  `exo.agenda.office.connector.key` | Client API Key to be generated from Office 365 to identify current site that uses eXo Agenda application. |

## Configure username case sensitive

By default, eXo Platform is case insensitive. You can configure it to become case sensitive through a parameter in`exo.properties` file:

- `exo.auth.case.insensitive`, default value set to true.

If you set the `exo.auth.case.insensitive` to true this means that the username \"user\" is the same as \"User\" or \"uSEr\". If it is set to false,this means that the user should take care of capital and minimal letters when typing the username.

## User inactivity delay configuration

When a user does not make any action on the platform i.e he is inactive for a time lapse, he is considered as offline.
The time lapse is configurable in `exo.properties` file using this parameter `exo.user.status.offline.delay`.
The parameter is expressed in millisecond and the value default is 240000 milliseconds.

``` properties
# The delay when we consider a user as offline. Default value is 240000 milliseconds
exo.user.status.offline.delay=240000
```

## Data directory configuration

JCR data is stored in both SQL databases and File System. JCR Database configuration is explained in `Database`. The JCR File System configuration is explained in this section.

Typically, the JCR File System data consists of four folders:

- JCR indexes.

- JCR values storage.

To store JCR value, SQL database is used as primary storage and another directory can be used as a secondary, dedicated storage for BLOB data. It is optional and you can configure to not store BLOB data in File System, by changing the default configuration in the `exo.properties` file.

```properties
exo.jcr.storage.enabled=true
```

- JTA (Transaction information).

- Swap data (temporary memory space).

By default, these four folders are located under a common directory that is `$PLATFORM_TOMCAT_HOME/gatein/data`.

In production, it is recommended to configure it to use a directory separated from the package. Especially in cluster mode, it should be a network shared folder.

### Configuration in Platform Tomcat

In Tomcat, the directory is configured by the environment variable `EXO_DATA_DIR`. Edit the `bin/setenv-customize.(sh|bat)` script:

```shell
    EXO_DATA_DIR=/mnt/nfs/shared/exo/data
```

You need to create the script file by copying/renaming the sample `bin/setenv-customize.sample.(sh|bat)`.

## Assets version configuration

Between versions, eXo Platform makes various changes on various layers.To avoid that browsers use cached assets and display old behavior, a parameter `exo.assets.version` is added in `exo.properties` file.

When eXo Platform is updated, his parameter allows to:

- Enforce browsers to reload javascript and css.
- Build eXo Platform urls for resources serving.
- Avoid asking users to clear their browser\'s cache.

By default, this parameter is set to eXo Platform package version, i.e for the version 5.0.x it is set to 5.0.x.

```properties
# Assets versions used in static resources URLs. Useful to manage caches.
exo.assets.version=5.0.x
```

## Quartz Scheduler configuration

eXo Platform uses [Quartz Scheduler](http://www.quartz-scheduler.org/), the Java Framework for scheduling jobs, in a wide range of features. When eXo Platform runs in cluster mode, it is important to prevent jobs to execute concurrently. Quartz has its own cluster mode, with each instance of eXo Platform server as a node of Quartz load balancing and failover group.

Since the version 6.0 of eXo Platform, Quartz is used in in-memory mode. And it\'s switched to persisted mode when clustering is enabled. So it is automatically configured in eXo Platform. As an administrator, you can change default Quartz settings in eXo Platform through `exo.properties` file.

### Main Scheduler Properties

Name  |  Description | Default
------|--------------|--------
exo.quartz.scheduler.instanceName | The name of the ExoScheduler instance. | scheduler |
exo.quartz.scheduler.instanceId   | The type of the AUTO scheduler instance. | |

### ThreadPool configuration Properties

|  Name | Description |  Default  |
|-------|-------------|-----------|
| exo.quartz.threadPool.class | Is the name of the ThreadPool | org.quartz.simpl.SimpleThreadPool used.
| exo.quartz.threadPool.threadPriority | It an integer value between | 5 (which is the value of Thread.NORM_PRIORITY Thread.MIN_PRIORITY (which is 1) and Thread.MAX_PRIORITY (which is                                                     10).
|exo.quartz.threadPool.threadCount | It is the number 25 of threads that are available for concurrent execution of jobs. ||

### JobStore configuration Properties (Persisted mode)

  Name | Description | Default
  -----|-------------|---------
  exo.quartz.jobStore.misfireThreshold    | The number of milliseconds the scheduler will tolerate a trigger to pass its next-fire-time by, before being considered misfired. |   6000
  exo.quartz.jobStore.class | The Scheduler's JobStore class name. | org.quartz.impl.jdbcjobstore.JobStoreTX
  exo.quartz.jobStore.driver | The Driver delegate which will ensure communication with database | org.quartz.impl.jdbcjobstore.StdJDBCDelegate
  exo.quartz.jobStore.useProperties | The flag which instructs JDBCJobStore that all values in JobDataMaps will be Strings. | false
  exo.quartz.jobStore.dataSource | The name of the DataSources defined in the configuration properties file for quartz. |  quartzDS
  exo.quartz.jobStore.tablePrefix | The prefix used to prefix the names of the Quartz's tables in database. | QRTZ\_ |
  exo.quartz.jobStore.isClustered | Set to \"true\" in order to turn on clustering features. | false |
  exo.quartz.jobStore.clusterCheckinInterval | Set the frequency (in milliseconds) at which this instance \"checks-in\" with other instances of the cluster. | 20000 |
  exo.quartz.jobStore.maxMisfiresToHandleAtATime | The maximum number of misfired triggers the jobstore will handle in a given pass. | 20
  exo.quartz.jobStore.dontSetAutoCommitFalse | Setting this parameter to \"true\" tellsQuartz not to call setAutoCommit(false) on connections obtained from the DataSource(s). | false
  exo.quartz.jobStore.acquireTriggersWithinLock | Whether or not the acquisition of next triggers to fire should occur within an explicit database lock.  | false
  exo.quartz.jobStore.lockHandler.class | The class name to be used to produce an instance of a \"org.quartz.impl.jdbcjobstore\". | |
  exo.quartz.jobStore.driverDelegateInitString | A pipe-delimited list of properties (and their values) that can be passed to the DriverDelegate during initialization time. | |
  exo.quartz.jobStore.txIsolationLevelSerializable | A value of \"true\" false tells Quartz (when using JobStoreTX or CMT) to call setTransactionIsolation(Connection.TRANSACTIONSERIALIZABLE) on JDBC connections. This can be helpful to prevent lock timeouts with some databases under high load, and long-lasting transactions. | |
  exo.quartz.jobStore.selectWithLockSQL | Must be a SQL string that selects a row in the places a lock on \"LOCKS\" table and the row. |  SELECT \* FROM {0}LOCKS WHERE SCHED_NAME = {1} AND LOCK_NAME = ? FOR UPDATE

### Datasource configuration (Persisted mode)

  Name | Description | Default
  --|----------------|----------------------------
  exo.quartz.dataSource.quartzDS.jndiURL | The JNDI URL for a DataSource that is managed by eXo Platform. | java:/comp/env/exo-jpa_portal

More details about the definition and default values of the above properties could be found in the table `Properties reference`  . You can also refer to [Quartz Configuration Reference](http://www.quartz-scheduler.org/documentation/quartz-2.x/configuration/) documentation for more details about quartz parameters.

## Configure documents multiupload in the activity stream

Through the `MultiUpload` feature, you are able to upload up to 20 files per activity having each one 200 MB as max size.

You can change the default behavior through `exo.properties` file by configuring these two parameters:

- `exo.social.composer.maxToUpload=20`, default value set to 20.
- `exo.social.composer.maxFileSizeInMB=200`, default value set to 200 MB.

## Transaction service

The JCR transaction timeout is 420 seconds by default. If your application runs longer transactions, you might need a bigger timeout.

Configure the timeout by adding the `exo.jcr.transaction.timeout` property in `exo.properties` file.

```properties
    exo.jcr.transaction.timeout=3600
```

The value is in seconds.

## Server base URL

The property `exo.base.url` is used to generate links in some cases,like a topic link in an email notification. Generally you need to configure it to the base URL that users use to access eXo Platform. For example, if you use a reverse proxy, the URL should be the proxy\'s host. The following is the default configuration. To change it, edit `exo.properties` file.

```properties
    # The Server Base URL is the URL via which users access eXo platform. All links created (for emails etc) will be prefixed by this URL.
    # The base URL must be set to the same URL by which browsers will be viewing your eXo platform instance.
    # Sample: exo.base.url=https://intranet.mycompany.com
    exo.base.url=http://localhost:8080
```

## Account setup

At the first startup of eXo Platform, the Account Setup and Greetings! screens will appear by default. However, in some scenarios, these screens are not necessary, for example:

- When you have an extension that declares sample users.
- When you want to connect to an existing user directory.

To skip these screens, simply change the default value from \"false\" into \"true\" in the `exo.properties` file.

```properties
    exo.accountsetup.skip=true
```

## Custom data validators configuration

Custom data validator, or user-configurable validator is the mechanism allowing users to define their own validation rules. For example, the username must be lowercase, or shorter than 20 characters. In eXo Platform, there are 6 validators that administrators can configure to use and the architecture allows developers to add more validators as they wish.

The validators can be configured via properties in `exo.properties` file.

A configuration is created by adding an entry with the `gatein.validators.` prefix in `exo.properties` file. This prefix is followed by a validator name, a period \'.\' and a validator aspect. Currently, there are the following validators and validator aspects:

- Validators:
  - **username**: Validates the \'Username\' field in the Create or Edit user form.
  - **password**: Validates the \'Password\' field in the Create or Edit user form.
  - **groupmembership**: There is a built-in regex that is currently not used to validate any field: ```GROUP_MEMBERSHIP_VALIDATION_REGEX = "^(\\p{Lower}[\\p{Lower}\\d\\._]+)(\\s*,\\s*(\\p{Lower}[\\p{Lower}\\d\\._]+))*$";```
  - **email**: Validates the Email Address field in the Create or Edit user form.
  - **displayname**: Validates the Display Name field in the Create or Edit user form.
  - **jobtitle**: Validates the Job Title field in the User Profile form.
  - **grouplabel**: Validates the Label field in Add or Edit group form.
  - **pagename**: Validates the page name field in the **Add new page** form. Its label is Page Name if you create a page from the Page ManagementAdd New Page menu. In the **Page Creation Wizard**, the label is Node Name.
- Validator aspects:
  - `gatein.validators.{validatorName}.length.min`: The minimum length of the validated field.
  - `gatein.validators.{validatorName}.length.max`: The maximum length of the validated field.
  - `gatein.validators.{validatorName}.regexp`: The regular expression to which the validated field must conform.
  - `gatein.validators.{validatorName}.format.message`: The information message that is displayed when the field does not conform to the specified regular expression.

See details about the \"*username*\" and \"*password*\" validators as below.

### Configuration of username validator

By default, the username will be validated as follows:

- The length must be between 3 and 30 characters.
- Only lowercase letters, numbers, underscores (\_) and period (.) can be used.
- No consecutive underscores (\_) or periods (.) can be used.
- Must start with a lowercase letter.
- Must end with a lowercase letter or number.

::: tip

Some components depend on usernames being all lowercase. Therefore, we require to use a **lowercase username only**.
:::

If you want to validate that username format is email-like, you could use the following configuration:

- validators
gatein.validators.userName.regexp=^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$
gatein.validators.username.format.message=Username must be a valid email address

When the username field does not conform to this rule, the account is not created and there will be a warning message:

- The field "User Name" must match the format "Username must be a valid email address".

In case you do not define `gatein.validators.username.format.message`,
the value of `gatein.validators.userName.regexp` will be used in the
warning message:

- The field "User Name" must match the format "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$".

### Configuration of password validator

By default, the password will be validated as follows:

- The length must be between 9 and 256 characters.
- Must contains at minima 1 digit, 1 lower case, 1 upper case

This default configuration correspond to the minimal password length recommended by [ANSSI-PG-078](https://www.ssi.gouv.fr/uploads/2021/10/anssi-guide-authentification_multifacteur_et_mots_de_passe.pdf) in low to medium sensitivity contexts.

If you want to change the password validation in medium to high sensitivity contexts, the ANSSI recommends to use the following configuration :

```properties

    # validators
    gatein.validators.passwordpolicy.regexp=((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{12,256})
    gatein.validators.passwordpolicy.length.max=256
    gatein.validators.passwordpolicy.length.min=12
    gatein.validators.passwordpolicy.format.message=Minimum of 1 digit, 1 lower case, 1 upper case, minimum of 12 chars.    
```

If you want to change the password validation to use the strong level
defined by ANSSI, you could use the following configuration :

```properties
    # validators
    gatein.validators.passwordpolicy.regexp=((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{15,256})
    gatein.validators.passwordpolicy.length.max=256
    gatein.validators.passwordpolicy.length.min=15
    gatein.validators.passwordpolicy.format.message=Minimum of 1 digit, 1 lower case, 1 upper case, minimum of 15 chars.
```

::: tip
Even when the maximum password length is not set, that maximum will not be revealed to the end user. This is done on purpose to limit exposure to some attacks related to very long password.
:::

::: tip
If you need to define more rules for password complexity, you can update the regexp according to your rules. Remember to update the error message accordingly to help the user enter a valid password.
:::

## Outgoing mail service

eXo Platform includes an email sending service that needs to be configured before it can function properly. This service, for instance, is used to send notifications of connection requests.

The service requires an external SMTP server that allows accounts to send email from applications. A suggestion is to use Google SMTP, as detailed below.

In configuration, you need to provide your account and password, and other information so that eXo Platform can connect to the SMTP server.

The configuration file `exo.properties` is as follows :

Here is the default configuration (it will not work of course, you will need to edit it):

```properties
    # Email display in "from" field of emails sent by eXo platform.
    exo.email.smtp.from=noreply@exoplatform.com
    # SMTP Server hostname.
    exo.email.smtp.host=localhost
    # SMTP Server port.
    exo.email.smtp.port=25
    # True to enable the secure (TLS) SMTP. See RFC 3207.
    exo.email.smtp.starttls.enable=false
    # True to enable the SMTP authentication.
    exo.email.smtp.auth=false
    # Username to send for authentication. Sample: exo.email.smtp.username=account@gmail.com
    exo.email.smtp.username=
    # Password to send for authentication.
    exo.email.smtp.password=
    # Specify the port to connect to when using the specified socket factory. Sample: exo.email.smtp.socketFactory.port=465
    exo.email.smtp.socketFactory.port=
    # This class will be used to create SMTP sockets. Sample: exo.email.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
    exo.email.smtp.socketFactory.class=
    # (SSL Only) Starting from OpenJDK 11.0.11, legacy SSL protocols are no longer supported. Need to enforce TLS version.
    mail.smtp.ssl.protocols=TLSv1.2 # (or TLSv1.3)
```

Read the inline comments to understand each property. Here are some remarks:

- You need to provide SMTP server host/port, a username/password to be authenticated by that server. Others are optional.
- Typically, administrators want to mask the *From* field in the system emails with something like *no-reply@exoplatform.com* so that the receivers recognize it is robotic. Many SMTP services allow you to set *From* field in outgoing emails to another email address than the authenticated account.that\'s why here you see the property : `exo.email.smtp.from`.

If this parameter is not valid, the value of `exo.email.smtp.username` will be used instead.

- If you want to use SMTP gateway over SSL, configure a certificate truststore containing your SMTP server\'s public certificate. Depending on the key sizes, you may then also need to install Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files for your Java Runtime Environment.

### Using Gmail as your SMTP server

Here is the sample using *smtp.gmail.com* server:

```properties
    exo.email.smtp.from=noreply@exoplatform.com
    exo.email.smtp.host=smtp.gmail.com
    exo.email.smtp.port=465
    exo.email.smtp.starttls.enable=true
    exo.email.smtp.auth=true
    exo.email.smtp.username=exo.test100@gmail.com
    exo.email.smtp.password=***
    exo.email.smtp.socketFactory.port=465
    exo.email.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
```

::: tip
If you want to use SMTP gateway over SSL, and starting from openjdk 11.0.11, which no longer supports legacy SSL versions (SSLv3, TLSv1,TLSv1.1) , the following property `mail.smtp.ssl.protocols=TLSv1.2` has to be added in eXo Platform.
:::

To make the configuration work, you need to:

- Register a Google account that is *exo.test100@gmail.com* in the sample.

- Enable POP and IMAP for that account. This can be done simply in your Gmail settings.
[Here](https://support.google.com/mail/answer/78775?hl=en) is a checklist provided by Google to help you solve problem if any.

Besides, for securing your account, Google may block access from an app and send you an email to review the access. So in case the mail service
does not work, check your inbox and get the link to allow the app access.

::: tip
In case of Gmail, `exo.email.smtp.from` must be a real account that you own. It does not need to be a Gmail account, as you can guess by the sample. You will configure your main account (that is`exo.email.smtp.username`) to add this *from* email as another \"send as\".
:::

To do so, follow [this guide of Google](https://support.google.com/mail/answer/22370?hl=en).

In case the *from* parameter is not valid, it does not fail the email sending and the main account will be displayed instead.

### Changing sender information of email notification

In eXo Platform, email notifications are sent to users when significant actions involving them occur (for example, new users, connection request, space invitation, and more). These emails help them to track of activities taking place in their Digital Workplace.

As an administrator, you can configure information (name and email address) of the sender, from which all notifications are sent, via two ways:

- In UI, click AdministrationPortalNotifications. Then edit Email
    Notification Sender section.

- Via `exo.properties` file

```properties
        exo.notification.portalname=eXo
        exo.email.smtp.from=noreply@exoplatform.com
```

In which:

- `exo.notification.portalname`: Name of the sender. The default value is `eXo`.
- `exo.email.smtp.from`: Email address of the sender. The default value is *noreply@exoplatform.com*.

## Subscribing to notifications of document changes

The function Watch document in Sites Explorer allows users to receive notification by email when a document is updated. The email address of receivers is the email they declare in their profile. Administrators can customize the sender, subject, mimetype and content of the notification.

::: tip
To get the email notification feature work, you first need to configure `Outgoing mail service` first.
:::

To customize the email notification, simply add the following properties in `exo.properties` file.

```properties
# Email content for WatchDocumentService
exo.ecms.watchdocument.subject=Your watching document is changed
exo.ecms.watchdocument.mimetype=text/html
exo.ecms.watchdocument.content=Dear $user_name,<br><br>The document $doc_name ($doc_title) has changed.<br><br>Please go to<a href="$doc_url">$doc_title</a> to see this change.<br><br>
```

  Property                        |Default value |  Description
  -------------------------------|--------------------------|--------------------
  exo.ecms.watchdocument.subject |   Your watching document changed | is  The subject of the email notification.
  exo.ecms.watchdocument.mimetype | text/html |The format of the email content. There are two types: text/html and text/plain.
  exo.ecms.watchdocument.content | ```Dear \$user_name,\<br\>\<br\> The document \$doc_name (\$doc_title) has changed.\<br\>\<br\>Please go to \<ahref=\"\$doc_url\"\>\$doc_title\</a\> to see this change.\<br\>\<br\>``` | The content of the email notification.

You can use four parameters below in the
`exo.ecms.watchdocument.content` property:

- **\$user_name**: The full name of the receiver.
- **\$doc_name**: The name of the document.
- **\$doc_title**: The title of the document.
- **\$doc_url**: The link to view the document in Sites Explorer.

## WebDAV configuration

The embedded WebDAV server lets you configure some parameter via `exo.properties` file  .

``` properties
# JCR Webdav configuration
exo.webdav.def-folder-node-type=nt:folder
exo.webdav.def-file-node-type=nt:file
exo.webdav.def-file-mimetype=application/octet-stream
exo.webdav.update-policy=update
exo.webdav.folder-icon-path=/eXoWCMResources/skin/images/file/nt-folder.png
exo.webdav.cache-control=text/*:max-age=3600;image/*:max-age=1800;application/*:max-age=1800;*/*:no-cache
```

  Name | Description | Default
  -----|-------------|--------
exo.webdav.def-folder-node-type | Matching node type of folders. | nt:folder
exo.webdav.def-file-node-type | Matching node type of files. | nt:file
exo.webdav.def-file-mimetype | The mimetype to exchange file data. | application/octet-stream
exo.webdav.update-policy | This defines the behavior when a PUT command is executed  against an existing resource: <br> - add: It tries to add new resource with the same name.<br> - create-version: It creates a new version of the resource.<br> - Otherwise, the PUT command updates the resource and its last modification date. | create-version
exo.webdav.folder-icon-path | The display icon of a folder. | /eXoWCMResources/skin/images/file/nt-folder.png
exo.webdav.cache-control | The cache-control header that defines cache and cache live time. | ```text/*:max-age=3600; image/*:max-age=1800; application/*:max-age= 1800;*/*:no-cache```

## Secure the listing of the contents of JCR folders through Webdav

For security reasons, it is important to an administrator to secure the
access to WebDAV urls of JCR folders.

You can define which JCR folders could be listed through Webdav by using
the parameter `exo.webdav.folder.listing.paths.allowed.regex` in `exo.properties` file :

```properties
    exo.webdav.folder.listing.paths.allowed.regex=(collaboration:/Users/(.*)/(.*)/(.*)/(.*))|(collaboration:/Groups/(.*))|(collaboration:/sites/(.*))|(portal-system:/production/app:gadgets/(.*))
```

The above example allows the listing access to theses folders: users
folders, groups folders, sites folders and gadgets folders.

::: tip

The value of the parameter
`exo.webdav.folder.listing.paths.allowed.regex` should respect this pattern : **wokspace_Name:/regex**.
:::

The default value of `exo.webdav.folder.listing.paths.allowed.regex` is set to empty which means that **the contents of All JCR folders are listed**.

## JODConverter configuration

In Sites Explorer or Activity Stream, users can preview documents of various types, without downloading it. To support this feature, eXo Platform uses the JODConverter service that requires OpenOffice or LibreOffice to be installed locally (in the same machine with the eXo Platform server).

### Installing OpenOffice/LibreOffice

Follow [OpenOffice guideline](http://www.openoffice.org/installation/)or [LibreOffice guideline](http://www.libreoffice.org/get-help/installation/) to
install.

Note that those softwares might be installed in some Linux distributions by the OS already.

::: tip

JODConverter is already built in eXo Platform, so you do not need to install it.
:::

### JODConverter version

eXo Platform uses [JODConverter v3.0](https://code.google.com/p/jodconverter/wiki/WhatsNewInVersion3) that enhances processing different file types much.

### Activating and deactivating

JODConverter is activated by default. You can deactivate it (and consequently not use the preview feature) by setting `exo.jodconverter.enable=false` in `exo.properties` file.

### Configurations

::: note
In most cases, you do not need to configure JODConverter because it can work with default configurations. However, if you are using OpenOffice 4 (or  ater), or have installed the Office server untypically, you will need to specify **exo.jodconverter.officehome** by yourself. See `Specifying exo.jodconverter.officehome`.
:::

JODConverter configurations can be edited in the `exo.properties` file.

``` properties
    # JOD Converter
    exo.jodconverter.enable=true
    exo.jodconverter.portnumbers=2002
    exo.jodconverter.officehome=
    exo.jodconverter.taskqueuetimeout=30000
    exo.jodconverter.taskexecutiontimeout=120000
    exo.jodconverter.maxtasksperprocess=200
    exo.jodconverter.retrytimeout=120000
```

### JODConverter

Name|Description|Default
------|---------|-----------
exo.jodconverter.enable|Enable JODConverter or not?|true
exo.jodconverter.portnumbers|List of ports used to create soffice processes.|2002
|exo.jodconverter.officehome|The home folder of the Office installation.|Blank (auto-detected)
exo.jodconverter.taskqueuetimeout|the maximum living time in milliseconds of a task in the conversation queue.|30000
exo.jodconverter.taskexecutiontimeout|The maximum time in milliseconds to process a task.|120000
exo.jodconverter.maxtasksperprocess|The maximum number of tasks to process by an office server.|200
exo.jodconverter.retrytimeout|The interval time in milliseconds to try to restart an office server in case it unexpectedly stops.|120000

## Limiting public access to the upload service

By default, unauthenticated users are not allowed to upload resources to the server through the Upload component on UI or by accessing directly the \"/upload\" handler, because this may cause some problems of server disk space. However, you can definitely configure the UploadHandler to allow this.

To change this restriction, edit the `exo.portal.uploadhandler.public-restriction` property in the `exo.properties`   file as follows:
exo.portal.uploadhandler.public-restriction=false

## Customizing site data

eXo Platform provides A built-in site: DW or Digital Workplace. In case you want to customize data of the site, for example, modifying or overwriting the existing data, use the externalized parameters in `exo.properties` file.

### DW

- `exo.dw.portalConfig.metadata.override`: Allow (*true*) or not allow (*false*) overriding the Intranet data.
- `exo.dw.portalConfig.metadata.importmode`: Customize data import strategy (*CONSERVE*, *INSERT*, *MERGE*, or *OVERWRITE*).

### Enabling/Disabling auto-creating a taxonomy tree

eXo Platform allows you to enable/disable auto-creating a taxonomy tree during a new site creation by adding the `ecms.taxonomy.autoCreateWithNewSite` parameter to `exo.properties` file.

``` properties
# Configuration for a taxonomy tree
ecms.taxonomy.autoCreateWithNewSite=false
```

By default, the parameter is set to `false`, it means the creation of a taxonomy tree is disabled when you create a new site.
To enable the function, simply set the parameter to `true`.

### Enabling/Disabling activity link preview

In eXo Platform, when `posting a link in activity stream`, the activity displays a preview for this link by fetching the title, an excerpt and a thumbnail of the linked resource.

You can enable or disable the link preview by defining the parameter `exo.activity.link.preview.enabled` in `exo.properties` file.

``` properties
exo.activity.link.preview.enabled=true
```

By default, the parameter is set to true i.e. the activities link preview is enabled.

If you disable activities link preview i.e. set the variable `exo.activity.link.preview.enabled` to false, activities with links are rendered with the link URL only:

## Configure spaces administration group

By default, only the super user is able to manage all the spaces of the platform:

- Create pages on spaces.
- Add/delete/promote members.
- Add/modify/delete space data (Notes pages, Documents, activities, tasks\...).

Startng with eXo Platform 5.0 it is possible to define a group of users to manage spaces. This group of users is able to edit and delete all kind of spaces: visible and hidden.

The group of spaces administrators could be defined by adding this property to `exo.properties` file:

- `exo.social.spaces.administrators`

::: tip

- You should specify the membership type (\*, member, manager\...) in the value of the property.

- It is possible to specify a list of groups separated by commas  **,**.
:::

In this example, all users of the two groups /platform/administrators and /developers are allowed to manage spaces:

- exo.social.spaces.administrators=\*:/platform/administrators,\*:/developers

## Logs

The logs of eXo Platform are controlled by the [Java Logging API](http://docs.oracle.com/javase/7/docs/technotes/guides/logging/index.html).

By default, the logs are configured to:

- log errors and warnings on the console.
- log `$PLATFORM_TOMCAT_HOME/logs/platform.log`.

The logs are configured via the file:

- `$PLATFORM_TOMCAT_HOME/conf/logback.xml`. Please refer to [Tomcat\'s Logging Documentation](http://tomcat.apache.org/tomcat-8.5-doc/logging.html) for more information on how to adjust this file to your needs.

## Hibernate properties for JPA

Since 4.3 version, eXo Platform uses Java Persistance API (JPA) to manage relational data and Hibernate as a JPA provider. In tis section, we will  define properties allowing to configure Hibernate in eXo Platform. The following properties should be set in `exo.properties` file.
::: tip
  You can pass any Hibernate property to eXo platform by adding the prefix ```exo.jpa.``` before the property.
  Example : exo.jpa.hibernate.show_sql

:::

  Name                 | Description                   |Value
  ---------------------|-------------------------------|-------------------
  exo.jpa.hibernate.dialect | The classname of a Hibernate org.hibernate.dialect.Dialect |   A fully-qualified classname for example for HSQl database it is org.hibernate.dialect.HSQLDialec t
  exo.jpa.hibernate.show_sql | Enables/disables log about SQL statements. | true or false
  exo.jpa.hibernate.format_sql | Format log about SQL statements. | true or false
  exo.jpa.hibernate.default_schema | The schema name. |
  exo.jpa.hibernate.default_catalog | The catalog name, it qualifies unqualified table names with the given catalog in generated SQL. |
  exo.jpa.hibernate.session_factory_name | The org.hibernate.SessionFactory is automatically bound to this name in JNDI after it is created.
  exo.jpa.hibernate.default_batch |  Default size for Hibernate batch fetching of associations. | 4,8 or 16
  exo.jpa.hibernate.default_entity_mode | Default mode for entity representation for all sessions opened from this SessionFactory, defaults to pojo | dynamic-map or pojo
  exo.jpa.hibernate.order_updates | Forces Hibernate to order SQL updates by the primary key value of the items being updated. This reduces thelikelihood of transaction deadlocks in highly-concurrent systems. | true or false
  exo.jpa.hibernate.order_by.default_null_ordering | Defines precedence of null values in ORDER BY clause. Defaults to none which varies between RDBMS implementation. | none, first or last
  exo.jpa.hibernate.generate_statistics | Causes Hibernate to collect statistics for performance tuning | true or false
  exo.jpa.hibernate.use_identifier_rollback | if true, generated identifier properties are reset to default values when objects are deleted. |   true or false
  exo.jpa.hibernate.use_sql_comments | If true, Hibernate generates comments inside the SQL, for easier debugging. | true or false
  exo.jpa.hibernate.jdbc.fetch_size | A non-zero value determines the An integer or 0 JDBC fetch size, by calling Statement.setFetchSize(). |
  exo.jpa.hibernate.jdbc.batch_size | A non-zero value causes Hibernate to use JDBC2 batch and 30 updates.A value between 5
  exo.jpa.hibernate.jdbc.batch_versioned_data | Set this property to true if your JDBC driver returns correct row counts from executeBatch(). This option is usually safe, but is disabled by default. If enabled, Hibernate uses batched DML for automatically versioned data. | true or false

## JCR Configuration

Because JCR Configuration is a very advanced topic, it is recommended that you:

- Learn about eXo JCR configuration
- Use default values, change them only if you know what you are doing.
- Understand how to configure datasource

The configurations introduced here are a subset of JCR configurations. There are many JCR configurations which are packed in `.war` files, so you have to unpack to edit them. To avoid unpacking them, the subset is externalized to be configured easily in `exo.properties` file.

Here is the list of externalized configurations with their short descriptions.

- Repository:

```properties
exo.jcr.repository.default=repository
exo.jcr.workspace.default=collaboration
exo.jcr.workspace.system=system
```

In which, \"repository\", \"collaboration\" and \"system\" are names of default repository, default workspace and system workspace respectively.

- Datasource:

```properties
exo.jcr.datasource.name=java:/comp/env/exo-jcr          
exo.jcr.datasource.dialect=auto
exo.jcr.db-structure-type=single
```

These configurations are applied to all workspaces.

- Jgroups:

```properties
  exo.jcr.cluster.jgroups.config-url=file:${exo.jcr.cluster.jgroups.config}
```

This externalizes the **jgroups-configuration** parameter of all workspace caches, query-handlers and lock-managers.

- Value Storage:

```properties
  exo.jcr.storage.enabled=true
```

This externalizes the **enabled** property of file system value-storage (that is configured at workspace level). The **true** value (default) means all binary values are stored in file system. The **false** value means all binary values are stored in the database.

## Cache configuration

To retrieve and display content faster, eXo Platform uses some cache services.

The below properties are all the cache configuration properties with their default value.

::: tip
Default values should be changed to better tune eXo Platform.
:::

### TemplateCache

The **TemplateCache** caches all Groovy templates of the portal by its template path and ResourceResolver. When the cached template is called, it will be loaded from cache rather than the database or the file system.

- The cached Groovy template is invalidated when it is removed or modified.
- The **TemplateCache** size equals to the number of Groovy templates in cache.
- The maximum heap size is dependent on length of Groovy template. The size of a Groovy template is often less than 100KB, so the maximum heap size equals to the cache size multiplied by 100KB.

### ResourceBundleCache

The **ResourceBundleCache** caches all resource bundles by name and
locale. When the cached resource bundle is called, it will be directly
loaded from cache rather than the database or the file system.

- The cached resource bundle is invalidated when it is removed or
    modified.
- The **ResourceBundleCache** size equals to the number of resource
    bundles in cache.
- The maximum heap size is dependent on the size of resource bundle.
    The size of a resource bundle is often less than 100KB, so the
    maximum heap size equals to the cache size multiplied by 100KB.

### Notications, settings and user state caches

eXo Platform provides a list of Caches for notifications, settings and user state

The *Settings*, *Notifications* and *User State* caches can be overridden in `exo.properties` file.

#### Notications, settings and user state Caches Configuration

```properties
    # Commons Cache Configuration - Settings Service
    exo.cache.commons.SettingService.MaxNodes=2000
    exo.cache.commons.SettingService.TimeToLive=360000
    exo.cache.commons.SettingService.strategy=LIRS
    # For cluster mode
    exo.cache.commons.SettingService=asyncInvalidation

    # Commons Cache Configuration - Web Notification Count
    exo.cache.commons.WebNotificationCountCache.MaxNodes=5000
    exo.cache.commons.WebNotificationCountCache.TimeToLive=-1
    exo.cache.commons.WebNotificationCountCache.strategy=LIRS
    exo.cache.commons.WebNotificationCountCache.cacheMode=asyncReplication

    # Commons Cache Configuration - Web Notification
    exo.cache.commons.WebNotificationCache.MaxNode=5000
    exo.cache.commons.WebNotificationCache.TimeToLive=3600
    exo.cache.commons.WebNotificationCache.strategy=LIRS
    exo.cache.commons.WebNotificationCache.cacheMode=asyncReplication

    # Commons Cache Configuration - Web Notifications
    exo.cache.commons.WebNotificationsCache.MaxNodes=5000
    exo.cache.commons.WebNotificationsCache.TimeToLive=3600
    exo.cache.commons.WebNotificationsCache.strategy=LIRS
    exo.cache.commons.WebNotificationsCache.cacheMode=asyncReplication

    # Commons Cache Configuration - User State Service
    exo.cache.commons.UserStateService.MaxNodes=5000
    exo.cache.commons.UserStateService.TimeToLive=600
    exo.cache.commons.UserStateService.strategy=LIRS
    exo.cache.commons.UserStateService.cacheMode=asyncReplication

    # Commons Cache Configuration - User Setting Service
    exo.cache.commons.UserSettingService.MaxNodes=5000
    exo.cache.commons.UserSettingService.TimeToLivee=86400
    exo.cache.commons.UserSettingService.strategy=LIRS
    exo.cache.commons.UserSettingService.cacheMode=asyncInvalidation
```

The specific configuration of **SettingCache** can be found in the file:

- `$PLATFORM_TOMCAT_HOME/lib/commons-component-common-X.Y.Z.jar!/conf/portal/configuration.xml`.

#### SettingCache

The **SettingCache** caches the setting value for all contexts and all scopes. When any users ask for the cached setting value, it will be retrieved from cache rather than the database.

- The **SettingCache** is never invalidated.
- The **SettingCache** size equals to the number of setting values in cache.
- Each entry of cache is a pair and key is a composite key(Context context, Scope scope, String key). The value is String, Double, Long or Boolean. In reality, the size of these values should be less than 100 bytes, so the maximum heap size equals to the cache size multiplied by 400 bytes.

### ECMS caches

eXo Platform provides a list of ECMS caches, including:

- `Drive Cache`  
- `Script Cache`  
- `Fragment Cache`  
- `Template Cache`  
- `Initial Web Content Cache`
- `PDF Viewer Cache`  
- `SEO Cache`  

Here are the configurations in
`exo.properties` file:

``` properties
# == ECMS Caches Configuration == #

# ECMS Cache Configuration - Drive Service
exo.cache.ecms.drive.MaxNodes=5000
exo.cache.ecms.drive.TimeToLive=600
exo.cache.ecms.drive.strategy=LIRS
exo.cache.ecms.drive.cacheMode=syncInvalidation

# ECMS Cache Configuration - Script Service
exo.cache.ecms.scriptservice.MaxNodes=300
exo.cache.ecms.scriptservice.TimeToLive=86400

# ECMS Cache Configuration - Fragment Cache Service (Markup Cache)
exo.cache.ecms.fragmentcacheservice.MaxNodes=10000
exo.cache.ecms.fragmentcacheservice.TimeToLive=30

# ECMS Cache Configuration - Templates Service
exo.cache.ecms.templateservice.MaxNodes=100
exo.cache.ecms.templateservice.TimeToLive=-1
exo.cache.ecms.TemplateService.strategy=LIRS
exo.cache.ecms.templateservice.cacheMode=asyncReplication   

# ECMS Cache Configuration - Initial Webcontent
exo.cache.ecms.initialwebcontentplugin.MaxNodes=300
exo.cache.ecms.initialwebcontentplugin.TimeToLive=86400
exo.cache.ecms.InitialWebContentPlugin.strategy=LIRS
exo.cache.ecms.initialwebcontentplugin.cacheMode=asyncInvalidation

# ECMS Cache Configuration - PDF Viewer Service
exo.cache.ecms.PDFViewerService.MaxNodes=1000
exo.cache.ecms.PDFViewerService.TimeToLive=3600
exo.cache.ecms.PDFViewerService.strategy=LIRS
exo.cache.ecms.PDFViewerService.cacheMode=syncInvalidation

# ECMS Cache Configuration - SEO Cache
exo.cache.ecms.seoservice.MaxNode=1000
exo.cache.ecms.seoservice.TimeToLive=3600
exo.cache.ecms.seoservice.strategy=LIRS
exo.cache.ecms.seoservice.cacheMode=asyncReplication

# ECMS Cache Configuration - Query Service
exo.cache.ecms.queryservice.MaxNodes=5000
exo.cache.ecms.queryservice.TimeToLive=600000
exo.cache.ecms.queryservice.strategy=LIRS
exo.cache.ecms.queryservice.cacheMode=asyncReplication

# ECMS Cache Configuration - SiteSearch Service found
exo.cache.ecms.sitesearchservice.found.MaxNodes=10000
exo.cache.ecms.sitesearchservice.found.TimeToLive=3600

# ECMS Cache Configuration - SiteSearch Service drop
exo.cache.ecms.sitesearchservice.drop.MaxNodes=10000
exo.cache.ecms.sitesearchservice.drop.TimeToLive=3600       

# ECMS Cache Configuration - Javascript Cache
exo.cache.ecms.javascript.MaxNodes=1000
exo.cache.ecms.javascript.TimeToLive=3600
exo.cache.ecms.javascript.strategy=LIRS
exo.cache.ecms.javascript.cacheMode=asyncReplication

# ECMS Cache Configuration - Lock
exo.cache.ecms.lockservice.MaxNodes=300
exo.cache.ecms.lockservice.TimeToLive=-1
exo.cache.ecms.LockService.strategy=LIRS
exo.cache.ecms.lockservice.cacheMode=replication

# ECMS Cache Configuration - Folksonomy Service
exo.cache.ecms.folkservice.MaxNodes=300
exo.cache.ecms.folkservice.TimeToLive=-1
exo.cache.ecms.folkservice.strategy=LIRS
exo.cache.ecms.folkservice.cacheMode=asyncReplication
```

These properties are exposed via `exo.properties` for administrators.
The full configuration can be found in XML configuration files. For SEO Cache, the file is:

- `$PLATFORM_TOMCAT_HOME/webapps/ecm-wcm-extension.war!/WEB-INF/conf/wcm-extension/wcm/seo-configuration.xml`.

For the other caches, the file is:

\-
`$PLATFORM_TOMCAT_HOME/webapps/ecm-wcm-core.war!/WEB-INF/conf/wcm-core/core-services-configuration.xml`.
.. \_ECMS.WCMDriveCache:

#### Drive Cache

The **managedrive** caches visited drives of Sites Explorer by their names. When any users visit the cached drives, these drives will be directly retrieved from cache rather than the database.

- The cache is invalidated when the drive is removed or added.
- The cache size equals to the number of drives in cache.
- The maximum heap size consumed by the cache are calculated as below:
  - Each item of drive cache contains: name, workspace, homePath, permission, view, icon, allowcreatefolders, viewReferences, viewNondocument, viewSidebar, showHiddenNode.
  - The first 7 elements are String and their length often should not be greater than 1000 bytes.
  - The last 4 elements are Boolean and the size of each element is 1 byte.
  - Thus, the maximum heap size equals to the cache size multiplied by 7004 bytes.

#### Script Cache

The **scriptservice** caches the ECMS Script objects. When there are any requests for cached scripts, these scripts are retrieved from cache rather than the database.

- The **scriptservice** cache is never invalidated.
- The cache size equals to the number of scripts in cache.
- The maximum heap size equals to the cache size multiplied by size of the script object.

#### Template Cache

The **templateservice** caches the list of document nodetypes. When any users call for the cached document nodetypes, data will be retrieved from cache rather than the database.

- The **templateservice** cache is invalidated when the document template is updated.
- The cache size is 1.
- The heap size consumed by the cache is unlimited. However the cache contains node names only, so it consumes less than 10KB.

#### Initial Web Content Cache

The **webcontent.initialwebcontentplugin** caches the artifacts (nodes) that are used to initialize a new portal. When a cached artifact is called, it will be read and returned from cache rather than the database.

- The cache is never invalidated because the initial artifact is never changed.
- The cache size equals to the number of the cached artifacts.
- The maximum heap size equals to the total size of all artifacts.

#### Fragment Cache

The **fragmentcacheservice** caches content of SCVs and CLVs. When any users call for these cached portlets, these portlets will be retrieved from cache rather than the database.

- The **fragmentcacheservice** is invalidated when SCVs and CLVs are switched from the edit to the live mode.
- The cache size equals to the number of SCVs/CLVs in cache.
- The maximum heap size consumed by the cache: total size of cached SCVs/CLVs (the SCVs/CLVs size is unlimited).

#### PDF Viewer Cache

The **pdfviewer** caches the path to a specific page of a specific PDF file. In eXo Platform, when a user views an Office document or PDF file, the viewed page is extracted into a PDF file, and REST is used to return that file content to client browser.

- The **pdfviewer** cache is never invalidated.
- The cache size equals to the number of pages viewed by users.
- The maximum heap size equals to the cache size multiplied by 200 bytes (supposing that the longest file path is 200 characters).

#### SEO Cache

The **seoservice** caches the SEO metadata of all pages in all sites.When the SEO metadata of these cached pages are called, the created pages will be got based on the page path from cache rather than the database.

- The **seoservice** cache is never invalidated.
- The cache size equals to the number of pages to which the SEO metadata is added.
- The maximum heap size is calculated as follows:
  - Each Metadata object contains 8 String objects: uri, rbcontent, keywords, description, title, frequency, fullStatus, pageReference. Each object is usually less than 100 characters.
  - 5 bytes (a float and a boolean) for priority and sitemap.
  - Thus, the total heap size equals to the cache size multiplied by 805 bytes.

### Social caches

eXo Platform provides 4 Social caches, including:

- `IdentityCache`  
- `RelationshipCache`
- `SpaceCache`  
- `ActivityCache`  

You can change values of these Social caches in `exo.properties` file.

In particular:

```properties
    # == SOCIAL Caches Configuration == #

    # Social Cache Configuration - Identity
    exo.cache.social.IdentityCache.MaxNodes=5000
    exo.cache.social.IdentityCache.TimeToLive=86400
    exo.cache.social.IdentityCache.strategy=LIRS
    exo.cache.social.IdentityCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Identity Index
    exo.cache.social.IdentityIndexCache.MaxNodes=5000
    exo.cache.social.IdentityIndexCache.TimeToLive=86400
    exo.cache.social.IdentityIndexCache.strategy=LIRS
    exo.cache.social.IdentityIndexCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Profile
    exo.cache.social.ProfileCache.MaxNodes=5000
    exo.cache.social.ProfileCache.TimeToLive=86400
    exo.cache.social.ProfileCache.strategy=LIRS
    exo.cache.social.ProfileCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Identities
    exo.cache.social.IdentitiesCache.MaxNodes=5000
    exo.cache.social.IdentitiesCache.TimeToLive=86400
    exo.cache.social.IdentitiesCache.strategy=LIRS
    exo.cache.social.IdentitiesCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Identities Count
    exo.cache.social.IdentitiesCountCache.MaxNodes=5000
    exo.cache.social.IdentitiesCountCache.TimeToLive=86400
    exo.cache.social.IdentitiesCountCache.strategy=LIRS
    exo.cache.social.IdentitiesCountCache.cacheMode=asyncInvalidation


    # Social Cache Configuration - Relationship
    exo.cache.social.RelationshipCache.MaxNodes=10000
    exo.cache.social.RelationshipCache.TimeToLive=86400
    exo.cache.social.RelationshipCache.strategy=LIRS
    exo.cache.social.RelationshipCache.cacheMode=asyncReplication

    # Social Cache Configuration - Relationship From Identity
    exo.cache.social.RelationshipFromIdentityCache.MaxNodes=10000
    exo.cache.social.RelationshipFromIdentityCache.TimeToLive=86400
    exo.cache.social.RelationshipFromIdentityCache.strategy=LIRS
    exo.cache.social.RelationshipFromIdentityCache.cacheMode=asyncReplication

    # Social Cache Configuration - Relationships Count
    exo.cache.social.RelationshipsCountCache.MaxNodes=5000
    exo.cache.social.RelationshipsCountCache.TimeToLive=86400
    exo.cache.social.RelationshipsCountCache.strategy=LIRS
    exo.cache.social.RelationshipsCountCache.cacheMode=asyncReplication

    # Social Cache Configuration - Relationships
    exo.cache.social.RelationshipsCache.MaxNodes=5000
    exo.cache.social.RelationshipsCache.TimeToLive=86400
    exo.cache.social.RelationshipsCache.strategy=LIRS
    exo.cache.social.RelationshipsCache.cacheMode=asyncReplication

    # Social Cache Configuration - Activity
    exo.cache.social.ActivityCache.MaxNodes=6000
    exo.cache.social.ActivityCache.TimeToLive=3600
    exo.cache.social.ActivityCache.strategy=LIRS
    exo.cache.social.ActivityCache.cacheMode=asyncReplication

    # Social Cache Configuration - Activities Count
    exo.cache.social.ActivitiesCountCache.MaxNodes=5000
    exo.cache.social.ActivitiesCountCache.TimeToLive=86400

    # Social Cache Configuration - Activities
    exo.cache.social.ActivitiesCache.MaxNodes=5000
    exo.cache.social.ActivitiesCache.TimeToLive=86400

    # Social Cache Configuration - Space
    exo.cache.social.SpaceCache.MaxNodes=500
    exo.cache.social.SpaceCache.TimeToLive=86400
    exo.cache.social.SpaceCache.strategy=LIRS
    exo.cache.social.SpaceCache.cacheMode=asyncReplication

    # Social Cache Configuration - Space Ref
    exo.cache.social.SpaceRefCache.MaxNodes=2000
    exo.cache.social.SpaceRefCache.TimeToLive=86400
    exo.cache.social.SpaceRefCache.strategy=LIRS
    exo.cache.social.SpaceRefCache.cacheMode=asyncReplication

    # Social Cache Configuration - Spaces Count
    exo.cache.social.SpacesCountCache.MaxNodes=5000
    exo.cache.social.SpacesCountCache.TimeToLive=86400
    exo.cache.social.SpacesCountCache.strategy=LIRS
    exo.cache.social.SpacesCountCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Spaces
    exo.cache.social.SpacesCache.MaxNodes=5000
    exo.cache.social.SpacesCache.TimeToLive=86400
    exo.cache.social.SpacesCache.strategy=LIRS
    exo.cache.social.SpacesCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Active Identities
    exo.cache.social.ActiveIdentitiesCache.MaxNodes=4000
    exo.cache.social.ActiveIdentitiesCache.TimeToLive=86400
    exo.cache.social.ActiveIdentitiesCache.strategy=LIRS
    exo.cache.social.ActiveIdentitiesCache.cacheMode=asyncInvalidation

    # Social Cache Configuration - Suggestions Cache
    exo.cache.social.SuggestionsCache.MaxNodes=5000
    exo.cache.social.SuggestionsCache.TimeToLive=86400
    exo.cache.social.SuggestionsCache.strategy=LIRS
    exo.cache.social.SuggestionsCache.cacheMode=asyncInvalidation
```

The specific configuration of each Social cache can be found in:

- `$PLATFORM_TOMCAT_HOME/webapps/social-extension.war!/WEB-INF/conf/social-extension/social/cache-configuration.xml`.

#### IdentityCache

The **IdentityCache** caches information related to identities, such as index, count or profile. When any users view or take actions on users/spaces or activity page that contains the cached identity information, information will be directly retrieved from cache rather than the database.

- The **IdentityCache** is invalidated when the user/space is deleted or updated.
- The **IdentityCache** size equals to the number of identities in cache.
- The maximum heap size is calculated as follows:
  - Identity Data: 33Kb (Max size: 500)
  - Identity Index: 24Kb (Max size: 500)
  - Identities List: 3747Kb (Max size: 2000)
  - Identities Count: 739Kb (Max size: 2000)
  - Profile Data: 170Kb (Max size: 500)

#### RelationshipCache

The **RelationshipCache** caches relationship information of users in the social networking. Any connection status (connection, pending,invitation, suggestion and count of relationships) is cached. When any users ask for these cached relationships, their information will be retrieved from cache rather than the database.

- The **RelationshipCache** is invalidated when the connection is changed/removed or when a new connection is added.
- The **RelationshipCache** size equals to the number of relationships in cache.
- The maximum heap size is calculated as follows:
  - Relationship Data: 14610Kb (Max size: 20000)
  - Relationships Count: 16Kb (Max size: 800)
  - Relationships: 171Kb (Max size: 800)
  - Suggestion: 400Kb (Max size: 500)

#### SpaceCache

The **SpaceCache** caches all information of spaces, including the count and space references. When any users visit the cached spaces, their information will be retrieved from cache rather than the database.

- The **SpaceCache** is invalidated when the space is deleted or updated.
- The **SpaceCache** size equals to the number of spaces in cache.
- The maximum heap size is calculated as follows:
  - Space Data: 1177Kb (Max size: 1000)
  - Spaces List: 1126Kb (Max size: 1000)
  - Spaces Count: 203Kb (Max size: 4000)
  - Space Ref: (38Kb) (Max size: 10000)

#### ActivityCache

The **ActivityCache** caches information related to activities, such as the count of activities. When any users visit the cached activities,information of these activities will be retrieved from cache rather than the database.

- The **ActivityCache** is invalidated when the activity is deleted or updated (a new comment is added to the activity).
- The **ActivityCache** size equals to the number of activities in cache.
- The maximum heap size is calculated as follows:
  - Activities Data: 3697Kb (Max size: 10000)
  - Activities List: 2555Kb (Max size: 4000)
  - Activities Count: 98Kb (Max size: 4000)

### Wallet caches

eXo Platform provides 2 wallet caches:

- `Wallet account cache`
- `Wallet transaction cache`

You can add new values of these caches in `exo.properties` file.

``` properties
exo.cache.wallet.account.MaxNodes=2000
exo.cache.wallet.account.TimeToLive=-1
exo.cache.wallet.transactions.MaxNodes=2000
exo.cache.wallet.transactions.TimeToLive=-1
```

The specific configuration of wallet caches can be found in:

- `$PLATFORM_TOMCAT_HOME/webapps/wallet-common.war!/WEB-INF/wallet/cache-configuration.xml`.

#### Wallet account cache

The **Wallet account cache** caches the Wallet objects. This object contains metadata information of a wallet, such as identity id, username, space pretty name, wallet enablement\... When any user get access to their wallet or a space wallet, the cached wallet object will be retrieved from cache rather than the database.

- The cached **Wallet account** is invalidated when the user updates its metadata such as reimporting its private key.
- The **Wallet account cache** size should be equal to the number of wallets used in eXo Platform.
- Each Wallet object take about 400 bytes in memory. So the maximum heap size occupied by the wallet cache would be its size multiplied by 400 bytes.

#### Wallet Transactions cache

The **Wallet Transactions cache** caches the blockchain transaction metadata sent by a wallet. This object contains information such as transaction hash, username, space pretty name, transaction status\... When any user get access to the list of their transactions or a space allet transactions, the cached wallet transactions objects will be retrieved from cache rather than the database.

- The cached **Wallet transaction** is invalidated when the users updates their metadata such as changing transaction status from *pending* to *success* or *failed*.
- The **Wallet transaction cache** size should equals the number of wallet accounts multiplied by the first transactions list page size (10 elements per page).
- Each Wallet transaction object take about 700 bytes in memory. So the maximum heap size occupied by the wallet transaction cache would be its size multiplied by 700 bytes.

### Predefined users, groups and memberships

When eXo Platform starts for the first time, it initializes some users, groups and memberships, such as user *root* and group */platform*. Some user attributes are set also, including password, firstname, lastname and email.
First you should get familiar with the expression of *group* and *membership*. If a user has the *member:/platform/users* membership, it means the user is a *member* of the */platform/users* group. The groups are organized like a tree, in which */platform/users* is a sub-group of */platform* group.

A membership is formed by a *membership type* and a group. *Member, editor and manager* are some of predefined membership types. So strictly speaking, \"membership type\" and \"membership\" are different concepts. However, the word \"membership\" is sometimes used with the meaning of \"membership type\".

Next you will learn the configurations of predefined users, groups and memberships which are written in:

- `$PLATFORM_TOMCAT_HOME/webapps/platform-extension.war!/WEB-INF/conf/organization/organization-configuration.xml`.

This section does not directly aim at changing those predefined organizational data, but if it is the further step you want to go, you can easily perform via the `extension mechanism`   provided by eXo Platform.

### Organizational data initializer

At top of the configuration file, you see the initializer declaration that is supposed to create all the predefined data discussed here:

``` xml
<component-plugin>
    <name>init.service.listener</name>
    <set-method>addListenerPlugin</set-method>
    <type>org.exoplatform.services.organization.OrganizationDatabaseInitializer</type>
    <description>this listener populate organization data for the first launch</description>
    <init-params>
        <value-param>
            <name>checkDatabaseAlgorithm</name>
            <description>check database</description>
            <value>entry</value>
        </value-param>
        ...
    </init-params>
</component-plugin>
```

Notice the value of *checkDatabaseAlgorithm*. If it is set to *entry*, each user, group and membership listed in the configuration is checked each time eXo Platform is started. If an entry does not exist in the database yet, it will be created. If the value is set to *empty*, the data  ill be updated to the database only if the database is empty.

### Predefined membership types

All predefined membership types can be found under the *membershipType* field. Here is an extract:

``` xml
<field name="membershipType">
    <collection type="java.util.ArrayList">
        <value>
            <object type="org.exoplatform.services.organization.OrganizationConfig$MembershipType">
                <field name="type"><string>*</string></field>
                <field name="description"><string>Any membership type</string>  </field>
            </object>
        </value>
        <value>
            <object type="org.exoplatform.services.organization.OrganizationConfig$MembershipType">
                <field name="type"><string>manager</string></field>
                <field name="description"><string>manager membership type</string></field>
            </object>
        </value>
        ...
    </collection>
</field>
```

### Predefined groups

All predefined groups can be found under the *group* field. Here is an extract:

``` xml
<field name="group">
    <collection type="java.util.ArrayList">
        <value>
            <object type="org.exoplatform.services.organization.OrganizationConfig$Group">
                <field name="name"><string>developers</string></field>
                <field name="parentId"><string /></field>
                <field name="description"><string>the /developers group</string></field>
                <field name="label"><string>Development</string></field>
            </object>
        </value>
        ...
    </collection>
</field>
```

### Predefined users

All predefined users can be found under the *user* field. The configurations are username, firstname, lastname, email, password and the list of emberships granted to the user. Here is an extract:

``` xml
<field name="user">
    <collection type="java.util.ArrayList">
        <value>
            <object type="org.exoplatform.services.organization.OrganizationConfig$User">
                <field name="userName"><string>${exo.super.user}</string></field>
                <field name="password"><string>password</string></field>
                <field name="firstName"><string>Root</string></field>
                <field name="lastName"><string>Root</string></field>
                <field name="email"><string>root@localhost</string></field>
                <field name="groups">
                    <string>*:/platform/administrators,*:/platform/users,*:/platform/web-contributors,*:/organization/employees,member:/organization/management/executive-board</string>
                </field>
            </object>
        </value>
        ...
    </collection>
</field>
```

Note that the code above uses the *exo.super.user* property which is set to *root* in `exo.properties` file:

### Excluded characters

By default only the whitespace is recognized as the word separator

- means if the data is \"Lorem Ipsum\", there are two indexes will be created for \"Lorem\" and \"Ipsum\".

The built-in indexing service of eXo Platform allows more word separators, like dot (.) or hyphen (-). To define those, edit the property `exo.unified-search.excluded-characters`.

When a user types a phrase to search, the word separator is used also. For example if hyphen is configured, and the user types \"Lorem-Ipsum\" then the query is sent as if it is two words.

## Elasticsearch Configuration

### Properties of the Elasticsearch client

eXo Platform communicates with the Elasticsearch server via multiple components through so-called client code. The client code differentiates calls done to the server for indexing and for searching. It allows to have different a deployment topology where different Elasticsearch server  have different roles. The following client paramters are configurable in `exo.properties`  

```properties
    ################################ Elasticsearch ################################
    exo.es.embedded.enabled=true
    exo.es.index.server.url=http://127.0.0.1:9200
    exo.es.index.server.username=root
    exo.es.index.server.password=xxxxx
    exo.es.indexing.batch.number=1000
    exo.es.indexing.replica.number.default=1
    exo.es.indexing.shard.number.default=5
    exo.es.indexing.request.size.limit=10485760
    exo.es.reindex.batch.size=100
    exo.es.search.server.url=http://127.0.0.1:9200
    exo.es.search.server.username=root
    exo.es.search.server.password=xxxxx
``    

It is also possible to configure the number of connection in the http connections pool used for search and indexing calls to Elasticsearch by defining these parameters:

```properties
    exo.es.search.http.connections.max=2
    exo.es.index.http.connections.max=2
```

`exo.es.search.http.connections.max` is the maximum number of connections in the HTTP connections pool for Elasticsearch search calls. Default alue set to 2. `exo.es.index.http.connections.max` is the maximum number of connections in the HTTP connections pool for Elasticsearch indexing calls. Default value set to 2.

### Properties of the indexing processor and connectors

The properties below allow to configure indexing parameters such as the number of shards, replicas, batch size\...

For more details about indexing with Elasticseach, you can take a look in this `documentation`  .

```properties
    ################################ Properties of the indexing processor ################################
    exo.es.indexing.batch.number=1000
    exo.es.indexing.request.size.limit=10485760
    exo.es.reindex.batch.size=100
    ################################ Properties of the indexing connectors ################################
    exo.es.indexing.replica.number.default=1
    exo.es.indexing.shard.number.default=5
```

## CometD

### What is CometD?

[CometD](https://docs.cometd.org/current/reference/) is a set of libraries that facilitates the writing of web applications that perform messaging over the web such as web chat applications.

The role of CometD is to deliver messages over the wire using the best available transport: Websocket or HTTP, independently of the APIs used in the application. It also provides transparent fallback in case WebSocket does not work.

### CometD clustering

[CometD](https://docs.cometd.org/current/reference/) provides a clustering solution called Oort that allows you to scale horizontally your web applications. With a CometD based system in cluster mode, clients connect to multiple nodes instead of a single node.

[Oort](https://docs.cometd.org/current/reference/#_java_oort) clustering is not a high-availability solution. In fact, when a node is down, all the clients are disconnected and then connected to another node by a new handshake. When this happens then if the application did not implement a method to retrieve information, the data build on the client side is lost.

### CometD configuration

To configure CometD in either cluster or standalone mode, some parameters are needed. A list of parameters is provided in [CometD\'s official documentation](https://docs.cometd.org/).

::: tip

All [CometD](https://docs.cometd.org/current/reference/) parameters are configurable in eXo Platform in the `exo.properties` file by prefixing  them with **exo.cometd.**. For example, to override the maximum size of Websocket messages, a value must be set for the parameter `ws.maxMessageSize`. Thus, in eXo Platform this value must be set in `exo.properties` through the `exo.cometd.ws.maxMessageSize`.
:::

Name | Description | Default
-----|-------------|------------------------------
exo.cometd.oort.url |  The CometD Oort URL used in clustering mode, ITS VALUE IS the hostname or the IP of the cluster node.  
exo.cometd.oort.configType | The CometD configuration type which could be either \"static\" or \"multicast\". | multicast
exo.cometd.oort.cloud | A comma-separated list of URLs of other Oort comets to connect to at startup.

## Youtube integration

eXo Platform uses YouTube Data API v3 that provides access to YouTube data, such as videos, playlists, and channels. To enable this, you should configure a Youtube V3 API Key property via `exo.properties` file.

For instance:

```properties
    youtube.v3.api.key=AIzaSyDToZc6oTOpe7kZIJeSUMvxfyoS6hhKJuI
```

In which:

- `youtube.v3.api.key`: an API key which is generated by a specific google account.

## Notification

The feature related to configuration in this section is the Email/On-site notification. Here are some aspects of the feature:

- Users can receive daily/weekly emails that sum up the activities they are interested in. This is performed in the background by jobs called `NotificationDailyJob` and `NotificationWeeklyJob`.

- In the Web UI, the notifications pop up immediately when an activity happens. And there is a page called \"View All\" where users can see    all the recent notifications.
In the background, a job called `WebNotificationJob` takes care to remove notifications that are older than a configurable live time.
Here under is the list of related properties that you can configure via `exo.properties` file.

- `exo.notification.NotificationDailyJob.expression` : This is the Cron expression to schedule the daily emails. By default it is *0 0 23 ? \* \** (11:00pm every day).

- `exo.notification.NotificationWeeklyJob.expression` : This is the Cron expression to schedule the weekly emails. By default it is *0 0 11 ? \* SUN* (11:00am every Sunday).

- `exo.notification.service.QueueMessage.period` : When they run, the jobs divide emails into batches and send them sequentially for preventing overloads. This configuration is the delay time (**in seconds**) between two batches. The default is 60 (one minute).

- `exo.notification.service.QueueMessage.numberOfMailPerBatch` : This is the (maximum) number of emails of each batch. The default is 30.

- `exo.notification.portalname` : This is the \"from\" field in the emails. The default is *eXo*.

- `exo.notification.maxitems` : The maximum number of notifications displayed in the popover list. The default is *8*.

- `exo.notification.viewall` : The number of days a notification takes place in the \"View All\" page. When it reaches its live time, it will be removed by the WebNotificationJob. The default is *30 (days)*.

- `exo.notification.WebNotificationCleanJob.expression` : The Cron expression to schedule the WebNotificationJob. By default
    it runs at 11:00pm every day (*0 0 23 ? \* \**).

### Notification channels configuration

In eXo Platform, two notification channels are available by default:

- Web channel: notifications are sent on the web browser.
- Email channel: notifications are sent via the email.

It is possible to define which channels to activate through the parameter `exo.notification.channels` in `exo.properties` file.
It is a comma separated property which could take these values:

- MAIL_CHANNEL
- WEB_CHANNEL

By default (when the property is not customized or empty), all the available channels are activated. When a notification channel is added through an extension, it is automatically activated.

## Document versioning

By default, versioning is enabled for documents contained in the **Managed Sites**, **Groups** and **Personal Documents** drives. To change this configuration, edit the `exo.ecms.documents.versioning.drives` property in the `exo.properties` file.
For example:

```properties
    exo.ecms.documents.versioning.drives=Managed Sites,Personal Documents
```

in which the drives are separated by commas.

Besides, to control the data arisen from this feature, eXo Platform provides you with the two properties:

- `exo.ecms.documents.versions.max`: defines the maximum number of versions that a document can have. When the maximum number of versions is reached, only the X last versions are kept while the other ones are permanently deleted. A non-positive value means no limit - by default this property is set to 0 (no limit).
- `exo.ecms.documents.versions.expiration`: defines the expiration time (in days) of a document version. When the expiration time is reached, the version is permanently deleted. The last version of a document is never deleted. A non-positive value means no limit - by default this property is set to 0 (no limit).

::: tip

If the value of the property `exo.ecms.documents.versioning.drives` is updated to add or remove drives, the documents already existing in the old and new drives are not impacted. Only the new documents are impacted by the updates. All the previous rules apply, depending on whether the document is versioned or not.
:::

## Document Viewer

The `Document Viewer` relies on `document conversion on serverside`   which can take significant resources on large files. In order to avoid  xcessive resource consumption, this component limits the size of files it can display. Limits are set both in file weight and in number of pages in the document:

- `exo.ecms.documents.pdfviewer.max-file-size`: defines the maximum size in Megabytes that a file can weight to be displayed in the document viewer. Beyond that size, the document viewer displays a warning message instead of the document content :
Default limit is 10MB. Any non-positive or invalid value will fallback to default.
- `exo.ecms.documents.pdfviewer.max-pages`: defines the maximum number of pages that a document can contain to be displayed in the document viewer. Beyond that number of pages, the document viewer displays a warning message instead of the document content.

Default limit is 99 pages. Any non-positive value or invalid value will fallback to default.

## Forgot Password

If you forget your password, you can request the system to send you a link to reset it. The link will be sent to your email and will expire as soon as you successfully reset the password or after an expiration time.

The expiration time is 24 hours by default. To change it, edit the following in `exo.properties` file.

```properties
  exo.portal.resetpassword.expiretime=24
```

The time unit is hour.

## Password Encryption

For security, the user passwords are encrypted before being stored into the database. When a user logs in, he provides a password in clear text.
This given password is then encrypted **by the same algorithm and the same encoder class** before being compared with the stored password. If they match, the user gets authenticated.

As of eXo Platform 4.3, the encoder and the algorithm can be configured via `exo.properties` file.

::: tip

It is not likely administrators will want to change the default encoder and algorithm. However for users who upgrade from a previous version older than 4.3, it is important to know that **the default encoder and the default algorithm have changed**, so you will need to re-configure it back to the old one which has been used, otherwise old users will not be able to log in.
:::

  Name | Description | Default
  -----|-------------|------------
  exo.plidm.password.class|The class that encrypts the user password before it is stored in the database. | org.picketlink.idm.impl.credential.HashingEncoder
  exo.plidm.password.hash | The encryption algorithm | SHA-256

## Task Management

To define a default workflow for new projects in the Task Management application, you can configure a property named `exo.tasks.default.status` via `exo.properties` file.

For instance:

```properties
    exo.tasks.default.status=To Do, In Progress, Wait, Validate, Done
```

in which, each status in the workflow is separated by a comma.

## Chat Configuration

Configuring the eXo Chat add-on can be done by creating a `chat.properties` file or using the `exo.properties` file (if you have not created this file).

These configuration files are located in:

- `$PLATFORM_TOMCAT_HOME/gatein/conf/`.

::: tip

You were asked to create the files for security during the setup. If you include any parameter below into the `exo.properties`, you should add the prefix `chat.` to its name, such as `chat.dbServerHost`. Besides, in case both of these files are used, parameters in the `exo.properties` file will have higher priority than those in the `chat.properties` file.
:::

### Mongo Database

  Parameter      |      Default      |     Description
  ---------------|-------------------|-------------------------
  `dbServerType` |     *mongo*       |    You should always use the default value. The other value, *embed*, is used for unit testing.
  `dbServerHost` |     *localhost*   |    The host name or IP of MongoDB.
  `dbServerPort` |      *27017*      |     The port number to connect to MongoDB host.
  `dbServerHosts`|                   |     The MongoDB nodes to connect to, as a comma-separated list of \<host:port\> values. For example : ```host1:27017,host2:27017,host3:27017```  
  `dbName`       |      *chat*       |     Name of the Mongo database name.
  `dbAuthentication` |   *false*     |      Set it *true* if authentication is required to access MongoDB.
  `dbUser`        |     *EMPTY*      |     Provide the username to access the database if authentication needed.
  `dbPassword`    |     *EMPTY*      |     Provide the password to access the database if authentication needed.

::: warning

It is highly recommended to define the parameter `dbServerHosts` instead of defining the two parameters `dbServerHost` and `dbServerPort` as they are depracated starting from eXo Platform 5.0 version.
:::

Generally, you do not need to configure those unless you have secured your MongoDB.

### Chat Server

| Parameter          | Default        | Description                   |
---------------------|----------------|-------------------------------|
| `standaloneChatServer` | *false*| The mode of the chat server: <br>- The parameter is set to true if the chat is in a standalone mode.<br>- The parameter is set to false if the the chat is in embedded mode.|
| `chatPassPhrase`   | *chat*         | The password to access REST service on the eXo Chat server. |
| `chatCronNotifCleanup | *0 0 \* \* (cron expression)| The notifications are cleaned up every one hour by default                            |
| `teamAdminGroup`   | */platform/administrators*           | The eXo group who can create teams. |
| `chatReadDays`     | *30* (days)    | When a user reads a chat, the application displays messages of some days in the past.|
| `chatReadTotalJson` | *200*          | The number of messages that you can get in the Chat room.  |

### Chat Client updates

| Parameter           | Default (milliseconds)       | Description                   |
----------------------|----------------|-------------------------------|
`chatIntervalChat`    |  *5000*        |  Time interval to refresh messages in a chat.
`chatIntervalSession` |  *60000*       |  Time interval to keep a chat session alive in milliseconds.
`chatIntervalStatus`  |  *60000*       |  Time interval to refresh user status in milliseconds.
`chatIntervalNotif`   |  *5000*        |  Time interval to refresh Notifications in the main menu in milliseconds.
`chatIntervalUsers`   |  *60000*       |  Time interval to refresh Users list in milliseconds.
`chatTokenValidity`   |  *60000*       |  Time after which a token will be invalid. The use will then be considered *offline*.

## Configuring eXo Web Conferencing

`eXo Web Conferencing` add-on enables users to make video calls through the interface of eXo Platform. You can parameter this add-on by configuring the below variables in `exo.properties` file.

| Parameter                     | Default    | Description            |
----------------------|----------------|-------------------------------|
| `webconferencing.webrtc.bundlePolicy` | balanced | Web RTC setting to indicate which media-bundling policy to use when gathering ICE candidates. |
| `webconferencing.webrtc.iceCandidatePoolSize` | > 0 | WebRTC setting which define the size of the prefetched ICE pool. |
| `webconferencing.webrtc.iceTransportPolicy`  | all | Web RTC setting to indicate which candidates the ICE Agent is allowed to use. |
| `webconferencing.webrtc.default.stun.enabled` | true     | Indicates if the default defined STUN servers must be used. |
| `webconferencing.webrtc.exo.stun.enabled` | false | Indicates if the default defined eXo STUN servers must be used. |
| `webconferencing.webrtc.xirsys.stun.enabled` | false | Indicates if theXirsys STUN servers must be used. |
| `webconferencing.webrtc.exo.turn.enabled`  | false | Indicates if the default defined TURN servers must be used.|
| `webconferencing.webrtc.exo.turn.username` |            | Username to authenticate on default TURN servers. |
| `webconferencing.webrtc.exo.turn.credential`               |            | Password to authenticate on default TURN servers. |
| `webconferencing.webrtc.xirsys.turn.enabled` | false    | Indicates if the Xirsys TURN servers must be used. |
| `webconferencing.webrtc.xirsys.username` |            | Username to authenticate on Xirsys TURN servers. |
| `webconferencing.webrtc.xirsys.credential`                 |            | Password to authenticate on Xirsys TURN servers. |
| `webconferencing.webrtc.active`                            | true     | Indicates if the WebRTC connector is active.       |

## Update of last login time

By default, eXo Platform persists the last login time information for each user in an internal database. You may need to disable this parameter o optimize login time especially when your system is highly solicited by a lot of concurrent users. You can disable this feature by configuring the parameter `exo.idm.user.updateLastLoginTime` in `exo.properties` file. The default value is set to true.

- Setting `exo.idm.user.updateLastLoginTime` to true enables the update, **in the IDM database**, of the last login time each time the user login to eXo Platform.
- Setting `exo.idm.user.updateLastLoginTime` to false disables the update of the user\'s last login time and if the platform is connected to an external system for users storage (such as LDAP or AD), the last login time will be updated in this external system.

## Enabling/Disabling login history

Starting from 5.3 version, eXo Platform allows you to enable/disable the login history data storage by adding the parameter `exo.audit.login.enabled` to `exo.properties` file.

```properties
# Enable/disable login history storage
exo.audit.login.enabled=true
```

By default, the parameter is set to `true`, it means that the login history data is stored in the database.

To disable the login history data storage in the database, simply set the parameter `exo.audit.login.enabled` to `false`.

## Configuring eXo Wallet

The eXo Wallet addon uses the [Ethereum Blockchain](https://www.ethereum.org/) to let eXo users hold and exchange crypto-currency (aka tokens) managed inside this blockchain.

### Blockchain network settings

The addon is configured by default to communicate with Ethereum\'s public network (called the \"Mainnet\") throught [Infura](https://infura.io/) using websocket and http protocols:

``` properties
exo.wallet.blockchain.networkId=1
exo.wallet.blockchain.network.websocket=wss://mainnet.infura.io/ws/v3/a1ac85aea9ce4be88e9e87dad7c01d40
exo.wallet.blockchain.network.http=https://mainnet.infura.io/v3/a1ac85aea9ce4be88e9e87dad7c01d40
```

::: tip

The default configuration points to an eXo-owner infura project ID that serves as proxy to the mainnet. To learn more about infura infrastructure and projects, please visit [Infura documentation](https://infura.io/docs/)
:::

- The Websocket endpoint is used to:
  - Scan newly mined blocks on the blockchain to check if any validated transaction involves a wallet owned by an available 
  - user in your eXo Platform instance. The periodicity can be configured using the following property (Default value: every hour):

  ``` properties
  exo.wallet.ContractTransactionVerifierJob.expression=0 0 * ? * * *
  ```

  - Checks all pending transactions sent using the eXo Wallet application to update its internal state (cache and persistent storage) and send notifications to receiver and sender of the transactions. The check is made periodically and can be configured using the following property (Default value: each day at 7:15 AM):

  ``` properties
      exo.wallet.PendingTransactionVerifierJob.expression=0 15 7 * * ?
  ```

  - Send raw transactions of all wallets. When a user sends a transaction, it gets signed by a private key in the browser side. The resulted raw transaction is sent to eXo Platform server instead of sending it directly to blockchain. This will avoid bad UX of user when network is interrupted or a problem happens on browser side. eXo Platform server will send raw transactions of users into blockchain periodically. The periodicity can be configured using the following property (Default value: every 30 seconds):
  
 ``` properties
 exo.wallet.TransactionSenderJob.expression=0/30 * * * * ?
```

- The maximum number of pending transactions to send (per wallet) is determined by the following property (Default: 3 pending transactions per wallet):

``` properties
 exo.wallet.transaction.pending.maxToSend=3
```

- Retrieve periodically the gas price suggested on blockchain.This gas price will be used in wallets, when dynamic gas price choice is used. The periodicity can be configured using the following property (Default value: every 2 minutes):

``` properties
    exo.wallet.GasPriceUpdaterJob.expression=0 0/2 * * * ?
```

- Unlike the *Admin wallet* which uses [Web3j](https://web3j.io/) (Server side) to issue transactions, the HTTP endpoint is used by *users and spaces wallets* using [Web3.js](https://web3js.readthedocs.io/) (Browser side) to communicate with the blockchain to issue transactions.

### Blockchain transaction settings

- When submitting a transaction to the Ethereum blockchain, some special properties are required by the blockchain protocols, namely *gas limit* and *gas price*.

  - **Gas limit** : The *gas limit* is the maximum gas that a transaction can consume to execute any operation using the token contract. It can be modified using the following property:

``` properties
# Value in GAS
  exo.wallet.transaction.gas.limit=150000
```

- **Gas price** : The *gas price* parameters will determine transaction fee of operations made using eXo Wallet addon. In the UI, the user has three choices:
  - Cheap transaction: this option will use the gas price configured by the following property (in  [WEI](http://ethdocs.org/en/latest/ether.html)):

  ``` properties
    exo.wallet.transaction.gas.cheapPrice=4000000000
  ```

  - Dynamic or Normal transaction: This is the default choice used for perkstore and wallet. In fact, the default option is to use dynamic gas price that will be computed and determined from blockchain periodically. This will avoid using a static gas price which can lead to a very slow transaction mining time. On the other hand, using a dynamic gas price can lead to having expensive transactions. (This will depend on the proposed gas price by blockchain) The dynamic gas price is bounded by minimal `Cheap gas price` configuration and `Fast gas price` configuration. To make this gas price static, you can modify the following parameter (Default value: true):

``` properties
   exo.wallet.blockchain.useDynamicGasPrice=false
```

- Once the dynamic gas price is turned off, you can set a static ``normal gas price`` configured by the following property (in `WEI <http://ethdocs.org/en/latest/ether.html>`__):

``` properties
   exo.wallet.transaction.gas.normalPrice=8000000000
```

- Fast transaction: this option will use the gas price configured by the following property (in [WEI](http://ethdocs.org/en/latest/ether.html)):

``` properties
 exo.wallet.transaction.gas.fastPrice=15000000000
```

- When a transaction is submitted but isn\'t mined for several days, it will be marked as failed in eXo Wallet\'s internal database. The maximum number of days waiting for transaction mining can be configured using the following property:

``` properties
 exo.wallet.transaction.pending.maxDays=1
```

::: tip

 If the transaction is still not mined after `exo.wallet.transaction.pending.maxDays` days, it will be marked as a failed transaction in eXo\'s internal database. if/when it gets eventually mined (pending.maxDays), the Job `ContractTransactionVerifierJob` will detect it and will update the real transaction status coming from the blockchain and send notifications.
:::

- The parallel number of transactions to send:

 ``` properties
 exo.wallet.transaction.pending.maxToSend=5
 ```

- The number of sending transaction attempts is configured by:

 ``` properties
 exo.wallet.transaction.pending.maxSendingAttempts=3
 ```

 ::: tip

 If the transaction is still not mined after `exo.wallet.transaction.pending.maxDays` days, it will be marked as a failed in eXo\'s internal database. if/when it gets eventually mined (pending.maxDays), the Job `ContractTransactionVerifierJob` will detect it and will update the real transaction status coming from the blockchain and send notifications.
 :::

- When a new user creates his wallet, we could set the Ether/Matic value to send to him so that he can pay for a transaction on the blockchain using the following property. If not set, the user will receive an amount sufficient to pay for a single transaction calculated using the gas price detected on the blockchain.

``` properties
 exo.wallet.blockchain.defaultInitialCryptoCurrencyFunds=0.3    
```

### Wallet types

- **Admin wallet**

    The *Admin wallet* is created automatically during first startup of the eXo Platform server.

    In order to be able to submit transactions to the blockchain using [Web3j](https://web3j.io/) server side, the private key of the *Admin wallet* is stored (in encrypted form) in the internal database. The private key is encrypted by combining two passwords:

- A first password is read from a keystore file (see `Updating password encryption key`

::: tip

 The generated keystore file under [gatein/conf/codec] MUST be backed up as a data folder, because it contains a key file that is used to decrypt stored wallets private keys. If it\'s lost, all wallets private keys will be lost and consequently, all funds would be lost and unrecoverable.
 :::

- A second password that must be configured in properties:

 ``` properties
 exo.wallet.admin.key=changeThisKey
 ```

 ::: tip

 The password can\'t be changed once the platform is started for the first time. In fact, this password will be used to encrypt the *Admin wallet*\'s private key that will be stored in database. If its value is modified after server startup, the private key of admin wallet won\'t be decrypted anymore, preventing all administrative operations.
 :::

The *Admin wallet* can be used by */platform/rewarding* group members to initialize other wallets. The private key of the admin wallet cannot be accessed by any user to avoid exposing its funds to an unauthorized person.

- **User wallet**

By default, any user of the platform can create their own wallet. A property is added to restrict access to wallet application to a group of users:

 ``` properties
 # Example of expressions

 # Any user
 exo.wallet.accessPermission=
 # All connected users of the platform
 exo.wallet.accessPermission=/platform/users
 # All administrators of the platform
 exo.wallet.accessPermission=*:/platform/administrators
 # All members of space associated to group internal_space
 exo.wallet.accessPermission=member:/spaces/internal_space
 ```

- **Space wallet**

Space managers can add the wallet application in their space using `Managing space applications` UI:

Space wallets can be managed by one or multiple space managers. In fact, the space wallet is similar to user wallet. To use it, it must be activated by an admin. The operation is carried out by the *Admin Wallet* account. By default, any space member can access to the space wallet in *readonly* mode.

### Token contract

The contract address used for the main token currency can be configured using the following variable:

``` properties
 exo.wallet.blockchain.token.address=0xc76987d43b77c45d51653b6eb110b9174acce8fb
```

This address is the official contract address for the official rewarding token promoted by eXo. It shouldn\'t change through eXo Platform versions on the Ethereum Mainnet blockchain. This crypto-currency token, is shared by all eXo Community users.

It is an [ERC-20](https://eips.ethereum.org/EIPS/eip-20) Token contract that is deployed on Ethereum Mainnet.

To be able to receive some tokens, a wallet address must be initialized by a *token contract* administrator on the blockchain (this cannot be done on your eXo Platform server).


## TrashCleaner Job
TrashCleaner job is a job which remove old contents present in the trash. 
This job use two properties :
``` properties
    exo.trashcleaner.lifetime=30
    exo.trashcleaner.cron.expression=0 0 20 ? * SAT
```

By default, the job runs each saturday a 8PM, and delete all content present in Trash since more than 30 days.


