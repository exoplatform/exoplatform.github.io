# Scheduled jobs

Job scheduler defines a job to execute a given number of times during a given period. It is a service that is in charge of unattended background executions, commonly known for historical reasons as batch processing. It is used to create and run jobs automatically and continuously, to schedule event-driven jobs and reports.

Job Scheduler service is widely used in eXo products. Here are some examples of Jobs:

- Content publication Change state job: A user plans a time to publish a content, and the job scans data to find out and publish the planned content in schedule.

- Agenda Reminder job that reminds attendees of incoming events.

By using Job Scheduler service, you do not need to take care how and when your job is triggered in Java code. Just write a Job (a class implements Job interface of Quartz library) and configure plugin for JobSchedulerService and it is done.

## How does Job Scheduler work?

Jobs are scheduled to run when a given Trigger occurs. Triggers can be created with nearly any combination of the following directives:

- at a certain time of day (to the millisecond)

- on certain days of the week

- on certain days of the month

- on certain days of the year

- not on certain days listed within a registered Calendar (such as business holidays)

- repeated for a specific number of times

- repeated until a specific time/date

- repeated indefinitely

- repeated with a delay interval

Jobs are named by their creator and can also be organized into named groups. Triggers may also be named and placed into groups, in order to easily organize them within the Scheduler. Jobs can be added to the Scheduler once, but registered with multiple Triggers.

## Samples

Follow this to write a simple and complete job.

Create a Maven project that contains:

- A Java class: src/main/java/com/acme/samples/DumbJob.java.

- A configuration xml: src/main/resources/conf/portal/configuration.xml.

Here is the pom.xml:

``` xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.acme.samples</groupId>
    <artifactId>dumb-job</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <dependencies>
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>2.3.2</version>
            <scope>provided</scope>
        </dependency>
        <!-- You need this dependency because you'll use eXo Log -->
        <dependency>
            <groupId>org.exoplatform.kernel</groupId>
            <artifactId>exo.kernel.commons</artifactId>
            <version>6.4.0</version> <!-- could be replaced by the version of your eXo platform server -->
        </dependency>
    </dependencies>
    <build>
        <finalName>dumb-job</finalName>
    </build>
</project>
```

## Defining a job

Here is our Java class for the Job implementatikon:

```java

package com.acme.samples;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.exoplatform.services.log.Log;
import org.exoplatform.services.log.ExoLogger;
import org.exoplatform.services.mail.MailService;
import org.exoplatform.services.mail.Message;

public class DumbJob implements Job {

    private static final Log log = ExoLogger.getLogger(DumbJob.class);

    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("DumbJob is running!!!");
    }
}

```

All jobs are required to implement the method execute of org.quartz.Job interface. This method will be called when a job is triggered. With DumbJob, you just use logging to see that it will work.

## Job configuration

In `conf/portal/configuration.xml`, you add *external-component-plugin* for *org.exoplatform.services.scheduler.JobSchedulerService*. You can use these methods below for setting component plugin:

### Periodic job

The periodic job is used to perform actions that are executed in a period of time. You generally configure when this job starts, when it ends, how many times it is executed and the time interval between executions. In this sample you configure the job to execute every minute (60000 millisecond).
This type of job is a component plugin based on the class *org.exoplatform.services.scheduler.PeriodJob*.

- **addPeriodJob**

``` java
public void addPeriodJob(ComponentPlugin plugin) throws Exception;
```

``` xml
<configuration>
    <external-component-plugins>
        <target-component>org.exoplatform.services.scheduler.JobSchedulerService</target-component>
        <component-plugin>
            <name>DumbJob</name>
            <set-method>addPeriodJob</set-method>
            <type>org.exoplatform.services.scheduler.PeriodJob</type>
            <description>DumbJob</description>
            <init-params>
                <properties-param>
                    <name>job.info</name>
                    <description>DumbJob</description>
                    <property name="jobName" value="DumbJob" />
                    <property name="groupName" value="DumbGroup" />
                    <property name="job" value="com.acme.samples.DumbJob" />
                    <property name="repeatCount" value="0" />
                    <property name="period" value="60000" />
                    <property name="startTime" value="+45" />
                    <property name="endTime" value="" />
                </properties-param>
            </init-params>
        </component-plugin>
    </external-component-plugins>
</configuration>
```

### Cron job

- **addCronJob**

``` java
public void addCronJob(ComponentPlugin plugin) throws Exception;
```

 This is used to perform actions at specified time with Unix cron-like definitions. The component plugin for this method must be the type of *org.exoplatform.services.scheduler.CronJob*. For example, at 12pm every day =\> \"0 0 12 \* \* ?\"; or at 10:15am every Monday, Tuesday, Wednesday, Thursday and Friday =\> \"0 15 10 ? \* MON-FRI\". To see more about Cron expression, please refer to: [CRON expression](http://en.wikipedia.org/wiki/CRON_expression). Here is an example:

``` xml
<configuration>
    <external-component-plugins>
        <target-component>org.exoplatform.services.scheduler.JobSchedulerService</target-component>
        <component-plugin>
            <name>CronJob Plugin</name>
            <set-method>addCronJob</set-method>
            <type>org.exoplatform.services.scheduler.CronJob</type>
            <description>cron job configuration</description>
            <init-params>
                <properties-param>
                    <name>cronjob.info</name>
                    <description>dumb job executed by cron expression</description>
                    <property name="jobName" value="DumbJob"/>
                    <property name="groupName" value="DumbJobGroup"/>
                    <property name="job" value="com.acme.samples.DumbJob"/>
                    <!-- The job will be performed at 10:15am every day -->
                    <property name="expression" value="0 15 10 * * ?"/> 
                </properties-param>
            </init-params>
        </component-plugin>
    </external-component-plugins>
</configuration>
```

### Other functions provided by the job scheduler service

- **addGlobalJobListener** and **addJobListener**

``` java
public void addGlobalJobListener(ComponentPlugin plugin) throws Exception;
```

``` java
public void addJobListener(ComponentPlugin plugin) throws Exception;
```

The component plugin for two methods above must be the type of *org.quartz.JobListener*. This job listener is used so that it will be informed when a *org.quartz.JobDetail* executes.

``` java
public void addGlobalTriggerListener(ComponentPlugin plugin) throws Exception;
```

``` java
public void addTriggerListener(ComponentPlugin plugin) throws Exception;
```

The component plugin for two methods above must be the type of *org.quartz.TriggerListener*. This trigger listener is used so that it will be informed when a *org.quartz.Trigger* fires.
