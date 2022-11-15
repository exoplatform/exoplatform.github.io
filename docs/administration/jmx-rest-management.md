# JMX/REST Management

In this chapter, the following topics are included:

- `Introduction to eXo Platform management` Overall information about managing resources of eXo Platform, JMX and REST interfaces.
- `Management views of eXo Platform <Management.ManagementViews>` Introduction to the following set of management view types of eXo Platform and their Object Names:
  - `PortalContainer management view`
  - `Cache management view`
  - `Content management view`
  - `JCR management view`
  - `Portal management view`
  - `Forum management view`
- `Jobs and Job Scheduler` List of the Cron Jobs and the Job Scheduler MBean.
- `eXo Platform notifications monitoring` A step by step to monitor notifications.

## Introduction to eXo Platform management

Managing resources of eXo Platform is critical for IT operators and system administrators to monitor and supervise the production system.
eXo Platform can be managed using JMX (Java Management Extension) tools or REST services.

To use JMX, some settings are required. To use REST services, you just need a browser. As you will see later in this chapter, all operations are available in JMX and some of them are available in REST. So use JMX if you need all operations and use REST in some cases, for example, you are on a machine that JMX is not installed, or at remote region where JMX is inaccessible because of security setup.

### How to manage eXo Platform with JMX

#### JMX and JMX Client

::: tip

See [Oracle\'s Documentation](http://docs.oracle.com/javase/1.5.0/docs/guide/jmx/overview/intro.html) to learn about JMX (Java Management Extension).
:::

To manage eXo Platform with JMX, you need a JMX Client, or more exactly an MBean Browser.
[JConsole](http://docs.oracle.com/javase/6/docs/technotes/guides/management/jconsole.html) is a built-in tool, and it features an MBean browser, so it does not require any installation. Another suggestion is [VisualVM](http://visualvm.java.net/), which requires some steps to [install its MBean plugin](https://visualvm.java.net/plugins.html).

The tools are graphical and you may just try and use to explore MBean.
In this chapter, the following terms will be used to describe an individual or a group of similar MBeans:

- *Object Name* is used to identify and indicate an MBean. All MBeans introduced in this chapter can be found under a group \"exo\", however their organization may make it difficult to find an MBean.
  For example, you will see three groups with the same name \"portal\", so this document will not indicate an MBean by its position in the MBeans tree, but by its Object Name.
  If you are using VisualVM, you can see Object Name in the \"Metadata\" tab.
- *Attribute* is a pair of \"Name\" and \"Value\". A list of Attributes shows the state of an MBean object.
- *Operation* is a function that you can invoke. Each MBean provides some (or no) Operations. Some Operations are \"Set\" and some Operations are \"Get\". An Operation may require data inputs.

#### Configuring eXo Platform to allow JMX access

The JMX configurations are JVM options and thus basically not specific to eXo Platform. Such configurations are explained at [Oracle\'s Documentation](http://docs.oracle.com/javase/6/docs/technotes/guides/management/agent.html).

In eXo Platform, by default JMX is not configured. Thus, local access is enabled and remote access is disabled. Authentication is disabled as well, this means username and password are not required. If you want to enable remote access or authorization, you need to start customizing eXo Platform, as instructed in the `Customizing environment variables` section.

After the start, put your JMX configurations in the form described in [Advanced Customization] section.

#### Securing JMX connection

It is recommended to enable security for production system. You may:

- Enable SSL. See [Using SSL](http://docs.oracle.com/javase/6/docs/technotes/guides/management/agent.html#gdemv).
- Enable Password Authentication. See [Using Password Authentication](http://docs.oracle.com/javase/6/docs/technotes/guides/management/agent.html#gdenv) and [Using Password and Access Files](http://docs.oracle.com/javase/6/docs/technotes/guides/management/agent.html#gdeup).

#### How to manage eXo Platform with REST service

Using REST service, you can do some operations with a browser. It requires no setup.

You need to be member of **/platform/administrators** to access REST services.

You also need to know the URL of a service (or its attributes and operations) to access it. You can get the URLs as follows:

1. Enter the base URL: `http://\[your_server\]:\[your_port\]/rest/private/management`, which is to access all management REST services, in your browser, then log in. The page returns a list of available REST services in plain text.
2. Select a service name and append it to the base URL. You will have the service\'s URL, for example: `*http://\[your_server\]:\[your_port\]/rest/private/management/skinservice*`
   Entering this URL, you will get a list of attributes (as **properties**) and operations (as **method**).
3. Continue appending an attribute of Step 2 to have URL of a method or property. Let\'s see the \"skinservice\" as an example:
   - Its property **SkinList** can be accessed by the URL: `http://\[your_server\]:\[your_port\]/rest/private/management/skinservice/SkinList`.
   - Its method *reloadSkins* can be invoked by the URL: `http://\[your_server\]:\[your_port\]/rest/private/management/skinservice/reloadSkins`.
   - The URL of the method *reloadSkin* is a bit complex because the method requires parameter *skinId* (to know which Skin will be reloaded): `http://\[your_server\]:\[your_port\]/rest/private/management/skinservice/reloadSkin?skinId=Default`.

## Management views of eXo Platform

- `PortalContainer management view` The management view of all objects and configurations of a given portal.
- `Cache management view` The management view of eXo Platform caches at several levels that provides the critical performance information, especially useful for tuning the server.
- `Content management view` The management view of WCMService.
- `JCR management view <Management.ManagementViews.JCRManagementView>` The management view of SessionRegistry, LockManager, Repository, and Workspace that allow you to monitor sessions, locks, repository configurations, and workspace configurations respectively.
- `Portal management view` A set of the Portal management views, including Template statistics, Template service, Skin service, TokenStore, Portal statistics, and Application statistics.
- `Forum management view` A set of the Forum management views, including Forum, Job, Plugin, Storage that allows you to control rules, statistics, information of data storage.

### PortalContainer management view

PortalContainer manages all objects and configurations of a given portal.

- The Object Name of PortalContainer MBeans: **exo:container=portal,name=portal**.

  Attribute                  |       Description
  ---------------------------|---------------------------------------------------
  `ConfigurationXML`         |       Configuration information of the specified portal container in the XML format.
  `Name`                     |       The name of the portal container.
  `RegisteredComponentNames` |   The list of the registered component names.
  `Started`                  |   Indicates if the portal container is started or not.
  
  Operation                      |  Description
  -------------------------------|----------------------------------------------
  `getConfigurationXML`          |  Returns configuration information of the portal container calculated by the loading mechanism. The returned value is an XML document in the eXo Kernel format.
  `getName`                      |  Returns the portal container name.
  `getRegisteredComponentNames`  |  Returns the list of all registered component names.
  `isStarted`                    |  Checks if the portal container is started or not. The portal container is only started once all its components have been started.
  
::: tip

PortalContainer can be controlled through the following path: <http://mycompany.com:8080/rest/management/pcontainer>.
:::

### Cache management view

eXo Platform uses caches at several levels. Monitoring them can provide the critical performance information, especially useful for tuning the server. Each cache is exposed with statistics and management operations.

#### CacheService

- There are many Cache MBeans of which the Class Name is common: **org.exoplatform.services.cache.concurrent.ConcurrentFIFOExoCache** and the Object Names are: **exo:service=cache,name={CacheName}** where **CacheName** is specified for each MBean.

  Attribute            | Description
  ---------------------|-------------------------------------------------
  `Name`               | The name of the cache.
  `MaxNodes`           | The maximum capacity (nodes) of the cache.
  `HitCount`           | The total number of times the cache was successfully queried.
  `MissCount`          | The total number of times the cache was queried without success.
  `Size`               | The number of entries in the cache.
  `TimeToLive`           |The valid period of the cache in seconds. If the value is set to **-1**, the cache never expires.

  Operation            | Description
  ---------------------|-------------------------------------------------
  `clearCache()`       | Evicts all entries from the cache. This method can be used to force a programmatic flush of the cache.
  `getName`            | Returns the cache name.
  `getLiveTime`        | Returns the valid lifetime of an entry in the cache in seconds.
  `setLiveTime`        | Sets the valid lifetime of an entry in the cache in seconds.
  `getCacheHit`        | Returns the total number of successful hits.
  `getCacheMiss`       | Returns the total number of unsuccessful hits.
  `getMaxSize`         | Returns the maximum capacity of the cache.
  `setMaxSize`         | Sets the maximum capacity of the cache.
  `getCacheSize`       | Returns the number of entries in the cache

#### CacheManager

The CacheManager MBean has no attribute and only one method to clear all the Caches.

- The Object Name of CacheManager Mbeans: **exo:service=cachemanager**.

  Operation            | Description
  ---------------------|-------------------------------------------------
  `clearCaches()`      | Forces a programmatic flush of all the registered caches.

#### PicketLinkIDMCacheService

PicketLinkIDMCacheService is the default implementation for the organization model. It has no attribute.

- The Object Name of PicketLinkIDMCacheService MBean: **exo:portal=\"portal\",service=PicketLinkIDMCacheService,name=plidmcache**.

  Operation                 | Description
  --------------------------|-------------------------------------------------
  `invalidateAll`           | Invalidates all cache entries.
  `invalidate(namespace)`   | Invalidates a specific cache namespace.
  `printCaches`             | Lists out all cache entries
  
::: tip

PicketLinkIDMCacheService can be controlled through the following path: <http://mycompany.com:8080/rest/management/plidmcache>.

However, the REST View managements of CacheService and CacheManager are not currently exposed in this version.
:::

### Content management view

#### WCMService

- The Object Name of WCMService MBean: **exo:portal=portal,service=wcm,view=portal,type=content**.

  Attribute                |  Description
  ---------------------------|-----------------------------------------------
  `PortletExpirationCache`   | The expiration period of portlet cache in seconds.

   Operation                  |    Description
  ----------------------------|--------------------------------------------------------------------
   `getPortletExpirationCache` | Returns the expiration period of portlet cache in seconds.
   `setPortletExpirationCache (expirationCache )` | Sets the expiration period of portlet cache by entering the value into the **expirationCache** field.

::: tip

WCMService can be controlled through the following paths respectively: <http://mycompany.com:8080/rest/management/wcmservice/>.
:::

### JCR management view

Java Content Repository (JCR) provides a management view to monitor sessions, locks, repository configurations, and workspace configurations.

#### Repository

- The Object Name of Repository MBean: **exo:portal=portal,repository=repository**.

  Attribute                   |  Description
  ----------------------------|----------------------------------------------
  `Name`                      |  The name of the repository container.
  `RegisteredComponentName s` |  The list of registered component names in the repository.
  
  Operation                    |    Description
  -----------------------------|------------------------------------------------
  `getName`                    |    Returns the repository container name.
  `getRegisteredComponentNames`|   Returns the list of registered component names in the repository.

#### SessionRegistry

- The Object Name of SessionRegistry MBean: **exo:portal=portal,repository=repository,service=SessionRegistry**.

Attribute          |     Description
-----------------------|---------------------------------------------------
  `TimeOut`            | The expiration period of a JCR session.
  `Size`               | The number of currently active sessions


  Operation            |   Description
  ----------------------|---------------------------------------------------
  `runCleanup`          | Cleans all JCR sessions timed out.
  `getTimeOut`          | Returns the session timeout.
  `setTimeOut`          | Sets the session timeout in seconds.
  `getSize`             | Returns the number of currently active sessions

#### Workspace

- There are several default workspaces listed below, each of them corresponds to a Workspace MBean:

     Workspace Name  |    Description
  -------------------|---------------------------------------------------
  `collaboration`    | Data, such as sites content, documents, groups, records space, tags, and users.
  `dms-system`       | Data of DMS, including node types, templates, views, taxonomy trees.
  `knowledge`        | Data of Forum, FAQ and Poll applications.
  `portal-system`    | Data of the Portal model objects, such as navigations, pages, sites, and application registry.
  `portal-work`      | Information of Gadget token and Remember me token.
  `social`           | Data of Social, including activity, identity, profile, relationship and space.
  `system`           | Data of system, including versions storage, node types, namespaces.

- The Object Name of Workspace MBeans: **exo:portal=portal,repository=repository,workspace={WorkspaceName}** where **WorkspaceName** is the name of each workspace.

    Attribute                 |    Description
  ----------------------------|-----------------------------------------------
  `Name`                      |  The name of the workspace container.
  `RegisteredComponentNam es` | The list of registered component names in the workspace.

  Operation                     |     Description
  ------------------------------|--------------------------------------------------
  `getName`                     |     Returns the workspace container name.
  `getRegisteredComponent Names`|   Returns the list of registered component names in the workspace.

#### LockManager

- Each Workspace has an MBean to manage locks. The Object Name of LockManager MBeans: **exo:portal=portal,repository=repository,workspace={WorkspaceName},service=lockmanager** where **WorkspaceName** is the name of each workspace.

    Attribute        |   Description
  -------------------|---------------------------------------------------
  `NumLocks`         | The number of active locks.

     Operation         |       Description
  ---------------------|------------------------------------------------------
  `cleanExpiredLocks`  |  Removes all expired JCR locks.
  `getNumLocks`        |  Returns the number of active JCR locks
  
::: tip

Currently, the REST View managements of SessionRegistry, LockManager, Repository and Workspace are not exposed in this version.
:::

### Portal management view

#### Template statistics

Template statistics exposes various templates used by the portal and its
components to render markups. Various statistics are available for
individual templates, and aggregated statistics, such as the list of the
slowest templates. Most management operations are performed on a single
template; those operations take the template identifier as an argument.

- The Object Name of Template statistics MBean: **exo:portal=portal,service=statistic,view=portal,type=template**.

    Attribute               |   Description
  --------------------------|------------------------------------------------
  `TemplateList`            | The list of templates loaded.
  `SlowestTemplates`        | The list of the 10 slowest templates.
  `MostExecutedTemplates`   | The list of the 10 most used templates.
  `FastestTemplates`        | The list of 10 fastest templates
  
  Operation                         |    Description
  ----------------------------------|-----------------------------------------------------------
  `getAverageTime(templateId)`      | Returns the average rendering time of a specified template in seconds.
  `getExecutionCount(templateId)`   | Returns the number of times executed by the specified template.
  `getMinTime(templateId)`          | Returns the minimum rendering time of the specified template in seconds.
  `getMaxTime(templateId)`          | Returns the maximum rendering time of the specified template in seconds.
  `getSlowestTemplates`             | Returns the list of the 10 slowest templates.
  `getMostExecutedTemplates`        | Returns the list of the 10 most used templates.
  `getTemplateList`                 | Returns the list of templates loaded.
  `getFastestTemplates`             | Returns the list of the 10 fastest templates
  
#### Template management

Template management provides the capability to force the reload of a specified template.

- The Object Name of Template management MBean: **exo:portal=portal,service=management,view=portal,type=template**.

   Operation                            | Description
  --------------------------------------|----------------------------------------------
  `reloadTemplates`                     | Clears the template cache.
  `listCachedTemplates`                 | Lists identifiers of the cached templates.
  `reloadTemplate(templ ateId)`         | Clears the template cache for a specified template identifier.

#### Skin management

- The Object Name of Skin management MBean: **exo:portal=portal,service=management,view=portal,type=skin**.

  Attribute           | Description
  --------------------|--------------------------------------------------
  `SkinList`          | The list of loaded skins by the skin service.

     Operation           |     Description
  -----------------------|-----------------------------------------------------
  `reloadSkin(skinId )`  | Forces a reload of the specified skin and the operation.
  `reloadSkins`          | Forces a reload of the loaded skins.
  `getSkinList`          | Returns the list of loaded skins by the skin service.

#### TokenStore

- The Object Name of TokenStore MBeans: **exo:portal=portal,service=TokenStore,name={Name}** where **Name** is the name of each specific token.

  Attribute         |   Description
  --------------------|--------------------------------------------------
  `Name`              |  The name of one specific token.
  `ValidityTime`      | The expiration period of one specific token in seconds.
  `PeriodTime`        | The expiration daemon period of one specific token in seconds. The token is deleted after the specified period.
  
  Operation             |  Description
  --------------------------|----------------------------------------------------
  `cleanExpiredTokens`      | Removes all expired tokens.
  `size`                    | Returns the number of tokens, including valid tokens and expired tokens undeleted yet.
  `getName`                 | Returns the token name.
  `getValidityTime`         | Returns the expiration time of one specific token in seconds.
  `getPeriodTime`           | Returns the expiration daemon period of one specific token in seconds.

eXo Platform provides the following TokenStore instances:

  Token Name           | Description
  ---------------------|-----------------------------------------------------
  `gadget-token`       | Stores tokens of the Oauth gadget into the JCR node, such as **org.exoplatform.portal.gadget.core.Gadget TokenInfoService**.
  `jcr-token`          | Stores common tokens into the JCR node, such as **org.exoplatform.web.security.security.CookieTokenService**, and **org.exoplatform.web.security.security.RemindPasswordTokenService**.
  
#### Portal statistics

- The Object Name of Portal statistics MBean:  **exo:portal=portal,service=statistic,view=portal,type=portal**.

     Attribute            |   Description
  ------------------------|----------------------------------------------
  `PortalList`            | The list of identifiers of loaded portals.

     Operation                  |       Description
  ------------------------------|------------------------------------------------------
  `getThroughput(portalId)`     |   Returns the number of requests for the specified portal per second.
  `getAverageTime(portalId)`    |   Returns the average execution time of the specified portal in seconds.
  `getExecutionCout(port alId)` |   Returns the number of times the specified portal has been executed.
  `getMinTime(portalId)`        |   Returns the minimum time of the specified portal in seconds.
  `getMaxTime(portalId)`        |   Returns the maximum time of the specified portal in seconds.
  `getPortalList`               |   Returns the list of identifiers of loaded portals.

#### Application statistics

Various applications are exposed to provide relevant statistics.

- The Object Name of Application statistics MBean: **exo:portal=portal,service=statistic,view=portal,type=application**.

    Attribute                           |       Description
  --------------------------------------|-----------------------------------------------
  `ApplicationList`                     |  The list of loaded applications.
  `SlowestApplications`                 |  The list of the 10 slowest applications.
  `MostExecutedApplications`            |  The list of the 10 most executed applications.
  `FastestApplications`                 |  The list of the 10 fastest applications

  Operation                           |     Description
  ------------------------------------|-----------------------------------------------
  `getAverageTime(applicationId)`    |  Returns the average time spent of the specified application.
  `getExecutionCount(applicationId)` |  Returns the number of times the specified application has been executed.
  `getMinTime(applicationId)`         |  Returns the minimum time spent of the specified application.
  `getMaxTime(applicationId)`         |  Returns the maximum time spent of the specified application.
  `getSlowestApplications`            |  Returns the list of the 10 slowest applications.
  `getMostExecutedApplications`       |  Returns the list of the 10 most executed applications.
  `getFastestApplications`            |  Returns the list of the 10 fastest applications.
  `getApplicationList`                |  Returns the list of application identifiers classified in the alphabetic order.

::: tip

Template statistics, Template management, Skin management, Portal statistics and Application statistics can be controlled through the following paths respectively:

- <http://mycompany.com:8080/rest/management/templatestatistics>
- <http://mycompany.com:8080/rest/management/templateservice>
- <http://mycompany.com:8080/rest/management/skinservice>
- <http://mycompany.com:8080/rest/management/portalstatistic>
- <http://mycompany.com:8080/rest/management/applicationstatistic>

However, the REST View management of TokenStore is currently not exposed in this version.
:::

## Jobs and Job Scheduler {#Management.JobScheduler}

Jobs are components that run in background and perform scheduled tasks,
such as sending notification emails every day.

In eXo Platform, jobs are managed by Quartz Scheduler. This framework allows to schedule jobs using simple patterns (daily, weekly) and `Cron expressions`.

The following tables are the jobs and their default configuration:

  Name                 |   Description                     |    Schedule
  -----------------------|-----------------------------------|--------------
  changeStateJobToPublished (Content)  | Scans *collaboration:/sites* for awaiting content and publishes them. |  Every 2 minutes
  changeStateJobToUnpublished (Content)  | Scans *collaboration:/sites* for awaiting content and un-publishes them. | Every 2  minutes
  NotificationWeeklyJob  | Sends weekly notification.        |  11 am, every Sunday
  NotificationDailyJob   | Sends daily notification.         |  11 pm, every day
  WebNotificationJob     | Cleans the web notifications that are older than 30 days. | On the 23rd of every month

You can **suspend** or **resume** the jobs via JMX. Find the MBean `exo:portal=portal,service=JobSchedulerService` like in the screenshot, it gives you the two operations.

![image0](/img/administration/jmx/job_scheduler_mbean.png)

## eXo Platform notifications monitoring

Monitoring is a means to be aware about your system\'s state. You can monitor different parts of eXo Platform through JConsole.

To monitor and observe notification settings in eXo Platform, you should follow these steps:

1. In the file `exo.properties`, add this property `exo.social.notification.statistics.active` and set it to true.
2. Start your server and then open a new terminal to start JConsole using the command jconsole.
3. Go to MBeans tab.
4. Navigate in the tree to **exo** --> **portal** --> **notification** --> **statistic** to get statistics about eXo Platform notifications.

![image1](/img/administration/jmx/jconsole.png)
