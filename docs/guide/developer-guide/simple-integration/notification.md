# Notifications

> 🚧 Work in progress
>
> This page will describe how to create a new notification type in eXo Platorm

 - Extending notification system : Steps to create an extension which plugs a new notification type into current notification system of eXo Platform.

 - Overriding email notification : Steps to create an extension which overrides the email notification templates following your own style.

 ## Extending notification system
 eXo Platform provides you with a notification system that allows you to extend in 2 mechanisms:
 - The extensibility of notification channels : add/remove channels such as email, on-site or through mobile push systems.
 - The extensibility of notification types : add/remove notification types linked to system events or user actions such as connection invitation, posting some space activities, uploading documents or sharing contents etc ...

 This section will walk you through a [complete sample extension](https://github.com/exo-samples/docs-samples/tree/master/sample-notification) that instructs you how to:
 1. Create a new notification that pushes notification information following an event or acion on the server.
 2. Override existing notification templates 

### How to develop the new notification type

First you need to create a new Maven project with the overall structure:

```
📦sample-notification
 ┣ 📂services
 ┃ ┣ 📂src
 ┃ ┃ ┗ 📂main
 ┃ ┃ ┃ ┗ 📂java
 ┃ ┃ ┃ ┃ ┗ 📂org
 ┃ ┃ ┃ ┃ ┃ ┗ 📂exoplatform
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂samples
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂notification
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂plugin
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜UpdateProfilePlugin.java
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜SocialProfileListener.java
 ┃ ┗ 📜pom.xml
 ┣ 📂webapp
 ┃ ┣ 📂src
 ┃ ┃ ┗ 📂main
 ┃ ┃ ┃ ┣ 📂resources
 ┃ ┃ ┃ ┃ ┗ 📂locale
 ┃ ┃ ┃ ┃ ┃ ┗ 📂notification
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂template
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜Notification_en.properties
 ┃ ┃ ┃ ┗ 📂webapp
 ┃ ┃ ┃ ┃ ┣ 📂META-INF
 ┃ ┃ ┃ ┃ ┃ ┗ 📂exo-conf
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
 ┃ ┃ ┃ ┃ ┗ 📂WEB-INF
 ┃ ┃ ┃ ┃ ┃ ┣ 📂conf
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
 ┃ ┃ ┃ ┃ ┃ ┗ 📜web.xml
 ┃ ┗ 📜pom.xml
 ┗ 📜pom.xml
```
The new project **sample-notification** is composed of two modules.
#### Services module : business logic module

when built, this module will generate a jar file that will be deployed in the **lib** folder of eXo platform server. In the current tutorial, this module will contain two classes :
   1. **SocialProfileListener.java** : this is an event listener that will be executed when a user updates his profile information. 
   ```java
    package org.exoplatform.samples.notification;

    import org.exoplatform.commons.api.notification.NotificationContext;
    import org.exoplatform.commons.api.notification.model.PluginKey;
    import org.exoplatform.commons.notification.impl.NotificationContextImpl;
    import org.exoplatform.samples.notification.plugin.UpdateProfilePlugin;
    import org.exoplatform.social.core.identity.model.Profile;
    import org.exoplatform.social.core.profile.ProfileLifeCycleEvent;
    import org.exoplatform.social.core.profile.ProfileListenerPlugin;

    /**
    *  This class extends ProfileListenerPlugin to trigger avatar/experience updating events
    *  and plug them into UpdateProfilePlugin as notifications
    */
    public class SocialProfileListener extends ProfileListenerPlugin {
      @Override
      public void avatarUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void bannerUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void experienceSectionUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void contactSectionUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void createProfile(ProfileLifeCycleEvent event) {}

      @Override
      public void aboutMeUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void basicInfoUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      @Override
      public void headerSectionUpdated(ProfileLifeCycleEvent event) {
        sendNotification(event);
      }

      private void sendNotification(ProfileLifeCycleEvent event) {
        // Load user profile
        Profile profile = event.getProfile();
        // Create the notification context and append the profile object
        NotificationContext ctx = NotificationContextImpl.cloneInstance().append(UpdateProfilePlugin.PROFILE, profile);
        // Call notification executor that will load the notification type configuration and create a new notification to be sent to concerned users
        ctx.getNotificationExecutor().with(ctx.makeCommand(PluginKey.key(UpdateProfilePlugin.ID))).execute(ctx);
      }
    }
   ```
   2. **UpdateProfilePlugin.java** : this is a Notification System plugin that will create a new notification and store it in database before it will be sent to concerned users.
   ```java 
    package org.exoplatform.samples.notification.plugin;

    import java.util.ArrayList;
    import java.util.HashSet;
    import java.util.Set;
    import org.exoplatform.commons.api.notification.NotificationContext;
    import org.exoplatform.commons.api.notification.model.ArgumentLiteral;
    import org.exoplatform.commons.api.notification.model.NotificationInfo;
    import org.exoplatform.commons.api.notification.plugin.BaseNotificationPlugin;
    import org.exoplatform.commons.utils.CommonsUtils;
    import org.exoplatform.commons.utils.ListAccess;
    import org.exoplatform.container.xml.InitParams;
    import org.exoplatform.services.log.ExoLogger;
    import org.exoplatform.services.log.Log;
    import org.exoplatform.social.core.identity.model.Identity;
    import org.exoplatform.social.core.identity.model.Profile;
    import org.exoplatform.social.core.manager.RelationshipManager;

    /**
    * This class extends BaseNotificationPlugin to push new notification type of
    * profile updating event
    */
    public class UpdateProfilePlugin extends BaseNotificationPlugin {
      public final static ArgumentLiteral<Profile> PROFILE = new ArgumentLiteral<Profile>(Profile.class, "profile");

      private static final Log                     LOG     = ExoLogger.getLogger(UpdateProfilePlugin.class);

      public final static String                   ID      = "UpdateProfilePlugin";

      public UpdateProfilePlugin(InitParams initParams) {
        super(initParams);
      }

      @Override
      public String getId() {
        return ID; // return the Identifier of the notification plugin
      }

      @Override
      public boolean isValid(NotificationContext ctx) {
        return true; // this function could be used to decide if a notification is valid to be sent
      }

      @Override
      protected NotificationInfo makeNotification(NotificationContext ctx) {
        // Load the user profile from the notification context
        Profile profile = ctx.value(PROFILE);

        // Load the list of contacts that are connected to the current user who updated his profile,
        // all of them should receive the notification
        Set<String> receivers = new HashSet<String>();
        RelationshipManager relationshipManager = CommonsUtils.getService(RelationshipManager.class);
        Identity updatedIdentity = profile.getIdentity();
        ListAccess<Identity> listAccess = relationshipManager.getConnections(updatedIdentity);
        try {
          Identity[] relationships = relationshipManager.getConnections(updatedIdentity).load(0, listAccess.getSize());
          for (Identity i : relationships) {
            receivers.add(i.getRemoteId());
          }
        } catch (Exception ex) {
          LOG.error(ex.getMessage(), ex);
        }

        //Create the notification item object that will be added to the queue of notification to be sent
        return NotificationInfo.instance()
                              .setFrom(updatedIdentity.getRemoteId())
                              .to(new ArrayList<String>(receivers))
                              .setTitle(updatedIdentity.getProfile().getFullName() + " updated his/her profile.<br/>")
                              .key(getId());
      }
    }

   ```
   3. **pom.xml** : the maven descriptor of the services module is simple and does just create a new jar file when the module is built
   ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
          <groupId>org.exoplatform.samples</groupId>
          <artifactId>notification</artifactId>
          <version>1.0.x-SNAPSHOT</version>
        </parent>
        <artifactId>sample-notification-services</artifactId>
        <packaging>jar</packaging>
        <dependencies>
          <dependency>
            <groupId>org.exoplatform.social</groupId>
            <artifactId>social-component-api</artifactId>
            <scope>provided</scope>
          </dependency>
          <dependency>
            <groupId>org.exoplatform.social</groupId>
            <artifactId>social-component-core</artifactId>
            <scope>provided</scope>
          </dependency>
        </dependencies>
        <build>
          <finalName>sample-notification-services</finalName>
        </build>
      </project>
   ```
#### Webapp : the extension module

 This module is similar to the extension built in the tutorial of [Prepare extension project](/guide/developer-guide/prepare-extension-project). Inside this extension we will add the configuration that will activate the new notification type.
Inside the file **webapp/src/main/webapp/WEB-INF/conf/configuration.xml** we will add the following configuration :
```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd http://www.exoplatform.org/xml/ns/kernel_1_2.xsd"
  xmlns="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd">
    <!-- register new event listener that will be fired when a user updates his profile-->
    <external-component-plugins>
      <target-component>org.exoplatform.social.core.manager.IdentityManager</target-component>
      <component-plugin>
        <name>SocialProfileListener</name>
        <set-method>registerProfileListener</set-method>
        <type>org.exoplatform.samples.notification.SocialProfileListener</type>
      </component-plugin>
    </external-component-plugins>
    <!-- register new notification type -->
    <external-component-plugins>
      <target-component>org.exoplatform.commons.api.notification.service.setting.PluginContainer</target-component>
      <component-plugin>
        <name>notification.plugins</name>
        <set-method>addPlugin</set-method>
        <!-- Add here the FQN of the new notification plugin -->
        <type>org.exoplatform.samples.notification.plugin.UpdateProfilePlugin</type>
        <description>Initial information for plugin.</description>
        <init-params>
          <object-param>
            <name>template.UpdateProfilePlugin</name>
            <description>The template of UpdateProfilePlugin</description>
            <object	type="org.exoplatform.commons.api.notification.plugin.config.PluginConfig">

              <!-- The ID of the plugin as it was declared in the class org.exoplatform.samples.notification.plugin.UpdateProfilePlugin -->
              <field name="pluginId">this folder is  representating the extension : t

              <!-- The label that will be displayed for this notification type in 'Manage Notifications' user settings page -->
              <field name="resourceBundleKey">
                <string>UINotification.label.UpdateProfilePlugin</string>
              </field>

              <!-- Priority order of this plugin in the list of Notification plugins -->
              <field name="order">
                <string>11</string>
              </field>

              <!-- Default configuration of the sending frequency of this notification type for all users -->
              <field name="defaultConfig">
                <collection type="java.util.ArrayList">
                  <value>
                    <string>Instantly</string>
                  </value>
                </collection>
              </field>
              
              <!-- The group where the system will add this notification type in 'Manage Notifications' user settings page -->
              <field name="groupId">
                <string>general</string>
              </field>
              
              <!-- the path of the resource bundle file containing all the translated texts (dots . will be replaced by slashes / under the resources folder of the project) -->
              <field name="bundlePath">
                <string>locale.notification.template.Notification</string>
              </field>
            </object>
          </object-param>
        </init-params>
      </component-plugin>
    </external-component-plugins>
  </configuration>

```

### Deploy and test the notification type

1. Under **$EXO_HOME** folder, create the folders lib and webapps if they do not exist
1. Build Services and webapp modules, then copy it under **$EXO_HOME/lib** and **$EXO_HOME/webapps** respectively :
```shell
cd $EXO_HOME/sources/sample-notification
mvn clean package
cp services/target/sample-notification-services.jar $EXO_HOME/lib/
cp webapp/target/sample-notification-webapp.war $EXO_HOME/webapps/
```
1. Add both files to the docker-compose.yml file inside the **volumes** section. Both files will be mounted when the **exo** container is restarted, and they will be added to the lib and webapps folders of eXo server.
```yml
       volumes:
      - exo_data:/srv/exo
      - exo_logs:/var/log/exo
      - $EXO_HOME/lib/sample-notification-services.jar:/opt/exo/lib/sample-notification-services.jar
      - $EXO_HOME/webapps/sample-notification-webapp.war:/opt/exo/webapps/sample-notification-webapp.war
```
1. Restart the eXo docker containers
```shell
docker-compose -f docker-compose.yml up 
```
1. To test the new notification type, follow the steps below :
  - Create two users **ali** and **john**
  - Login with **ali** on first browser
  - Login with **john** on another browser
  - **ali** sends an invitation to connect with **john**, the latter should accept it
  - **ali** updates his profile, bu editing his *About Me* or uploading anew avatar 
  - **john** should receive an on-site notification and an email notification (if the server is correctly configured with an SMTP server)

<div>
  <figure>
    <img src='/img/notification/mail-sample-notif.png' class="center">
    <figcaption class="center-text">Mail received for the new notification</figcaption>
  </figure>

  <figure>
    <img src='/img/notification/web-sample-notif.png' class="center">
    <figcaption class="center-text">On site notification</figcaption>
  </figure>
</div>  

### Customize the Look & Feel of the notification

As you noticed, the notification is very basic and shows the text with no formatting. To provide a better visual for the notification, you should add a templte provider.
The template provider is a class that will decorate the notification with a template written in Groovy language.
To provide a better looking for the Mail and On-site notifications, you will add some customization. Notification system requires a set of components to allow customizing how do notifications look like : 
1- A groovy template : mix of HTML and groovy code to personalize how data is displayed. 
2- A Message builder : a Java class that will process then inject notification data in template.
3- A Template provider : a java class that will associate each notification plugin with an associated notification builder, we will have a template provider per channel.

#### Mail notification
To proceed with customizing the display of Mail notifications, you will need to :

1- Add the template of the email notification. Create a new groovy template file named **updateProfileMailNotification.gtmpl** *sample-notification/webapp/src/main/webapp/WEB-INF/templates/notification/mail/updateProfileMailNotification.gtmpl* 
```groovy
<table border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#ffffff" align="center"
       style="background-color: #ffffff; font-size: 12px;color:#333333;line-height: 18px;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;">
  <!-- common header for all templates under eXo platform -->
  <%
  _templateContext.put("header_title", _ctx.appRes("Notification.title.UpdateProfilePlugin"));
  _ctx.include("war:/notification/templates/mail/NotificationHeader.gtmpl", _templateContext);
  %>
  <!-- end header -->

  <!--The main content of the email-->
  <tr>
    <td bgcolor="#ffffff" style="background-color: #ffffff;">
      <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff"
             style="background-color: #ffffff; border-left:1px solid #d8d8d8;border-right:1px solid #d8d8d8;">
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff;">
            <div style="text-align: center;vertical-align: middle; line-height: 100px;">
              $USER_FULL_NAME updated his information, you can check by visiting <a href="$USER_PROFILE_URL">his
              profile</a></div>
          </td>
        </tr>
      </table>

    </td>
  </tr>
  <!--end content area-->

  <!-- common footer for all templates under eXo platform -->
  <% _ctx.include("war:/notification/templates/mail/NotificationFooter.gtmpl", _templateContext);%>
  <!-- end footer -->

</table>
```

2- Add the template builder for the Mail notification, create a new java class named **UpdateProfileMailNotificationBuilder.java** under *sample-notification/src/main/java/org/exoplatform/samples/notification/mail*
```java
package org.exoplatform.samples.notification.mail;

import org.exoplatform.commons.api.notification.NotificationContext;
import org.exoplatform.commons.api.notification.channel.template.AbstractTemplateBuilder;
import org.exoplatform.commons.api.notification.model.MessageInfo;
import org.exoplatform.commons.api.notification.model.NotificationInfo;
import org.exoplatform.commons.api.notification.service.template.TemplateContext;
import org.exoplatform.commons.notification.template.TemplateUtils;
import org.exoplatform.commons.utils.CommonsUtils;

import java.io.Writer;

import static org.exoplatform.samples.notification.plugin.UpdateProfilePlugin.USER_FULL_NAME;
import static org.exoplatform.samples.notification.plugin.UpdateProfilePlugin.USER_PROFILE_URL;

// All template builders should extend org.exoplatform.commons.api.notification.channel.template.AbstractTemplateBuilder
public class UpdateProfileMailNotificationBuilder extends AbstractTemplateBuilder{

  // each template bulder will override function makeMessage which returns a MessageInfo object that represents the sent notification
  @Override
  protected MessageInfo makeMessage(NotificationContext ctx) {

    // retrieve notification from the context
    NotificationInfo notification = ctx.getNotificationInfo();
    // Detect the language of the receiver
    String language = getLanguage(notification);

    // Create a templateContext for the Mail notification
    TemplateContext templateContext = new TemplateContext(notification.getKey().getId(), language);

    // Fill it with data, we should put all the variables with their values that will be replaced later in the notification template
    // they will be prefixed with the $ symbol inside the template
    templateContext.put("USER_FULL_NAME", notification.getValueOwnerParameter(USER_FULL_NAME.getKey()));

    templateContext.put("USER_PROFILE_URL", CommonsUtils.getCurrentDomain() + notification.getValueOwnerParameter(USER_PROFILE_URL.getKey()));

    // compute the mail subject
    String subject = TemplateUtils.processSubject(templateContext);

    // compute the mail body
    String body = TemplateUtils.processGroovy(templateContext);
    //binding the exception in case it was thrown by processing template
    ctx.setException(templateContext.getException());

    // Create and return the MessageInfo object
    MessageInfo messageInfo = new MessageInfo();
    return messageInfo.subject(subject).body(body).end();
  }

  @Override
  protected boolean makeDigest(NotificationContext notificationContext, Writer writer) {
    // This plugin does not generate a Digest email (daily/weekly)
    return false;
  }
}
```

3- Add the template provider for Mail notifications, create a new java class named **MailNotificationProvider.java** under *sample-notification/src/main/java/org/exoplatform/samples/notification/mail*
```java
package org.exoplatform.samples.notification.mail;

import org.exoplatform.commons.api.notification.annotation.TemplateConfig;
import org.exoplatform.commons.api.notification.annotation.TemplateConfigs;
import org.exoplatform.commons.api.notification.channel.template.TemplateProvider;
import org.exoplatform.commons.api.notification.model.PluginKey;
import org.exoplatform.container.xml.InitParams;
import org.exoplatform.samples.notification.plugin.UpdateProfilePlugin;

// Add the URL to load the template used by the notification plugin
@TemplateConfigs(templates = {
        @TemplateConfig(pluginId = UpdateProfilePlugin.ID, template = "war:/templates/notification/mail/updateProfileMailNotification.gtmpl")
})
// All template providers should extend org.exoplatform.commons.api.notification.channel.template.TemplateProvider class
public class MailNotificationProvider extends TemplateProvider {

  //constructor where we add the builder of mail notification to the list of templateBuilders inside the server
  public MailNotificationProvider(InitParams initParams) {
    super(initParams);
    this.templateBuilders.put(PluginKey.key(UpdateProfilePlugin.ID), new UpdateProfileMailNotificationBuilder());
  }
}
```
4- Update the configuration by telling the Channel manager to use the new Mail template provider for all email notifications related to the UpdateProfilePlugin. You need to add the following configuration in the file **sample-notification/webapp/src/main/webapp/WEB-INF/conf/configuration.xml**
```xml
	<!-- template channel register -->
	<external-component-plugins>
		<!-- Target service to update-->
		<target-component>org.exoplatform.commons.api.notification.channel.ChannelManager</target-component>
		<component-plugin profiles="all">
			<!-- unique name of our new plugin -->
			<name>mail.channel.updateProfile.template</name>
			<set-method>registerTemplateProvider</set-method>
			<!-- The new Template provider that we have just added -->
			<type>org.exoplatform.samples.notification.mail.MailNotificationProvider</type>
			<init-params>
				<!-- Target notification channel -->
				<value-param>
					<name>channel-id</name>
					<value>MAIL_CHANNEL</value>
				</value-param>
			</init-params>
		</component-plugin>
	</external-component-plugins>
```

#### Web notification
The same steps are needed for customizing the on-site notification.

1- Add the template of the email notification. Create a new groovy template file named **updateProfileWebNotification.gtmpl** under the folder *sample-notification/webapp/src/main/webapp/WEB-INF/templates/notification/web/* 
```groovy
<li class="$READ clearfix" data-id="$NOTIFICATION_ID">
  <div class="media">
    <div class="media-body">
      <div class="contentSmall" data-link="$USER_PROFILE_URL">
        <div class="content">
          <a href=$USER_PROFILE_URL>
            Your connection $USER_FULL_NAME has updated his profile information
          </a>
        </div>
        <div style="display:none;">$MESSAGE</div>
        <div class="lastUpdatedTime">$LAST_UPDATED_TIME</div>
      </div>
    </div>
  </div>
  <span class="remove-item" data-rest=""><i class="uiIconClose uiIconLightGray"></i></span>
</li>
```

2- Add the template builder for the Mail notification, create a new java class named **UpdateProfileWebNotificationBuilder.java** under *sample-notification/src/main/java/org/exoplatform/samples/notification/web*
```java
package org.exoplatform.samples.notification.web;

import org.exoplatform.commons.api.notification.NotificationContext;
import org.exoplatform.commons.api.notification.NotificationMessageUtils;
import org.exoplatform.commons.api.notification.channel.template.AbstractTemplateBuilder;
import org.exoplatform.commons.api.notification.model.ChannelKey;
import org.exoplatform.commons.api.notification.model.MessageInfo;
import org.exoplatform.commons.api.notification.model.NotificationInfo;
import org.exoplatform.commons.api.notification.service.template.TemplateContext;
import org.exoplatform.commons.notification.template.TemplateUtils;
import org.exoplatform.commons.utils.CommonsUtils;
import org.exoplatform.webui.utils.TimeConvertUtils;

import java.io.Writer;
import java.util.Calendar;
import java.util.Locale;

import static org.exoplatform.samples.notification.plugin.UpdateProfilePlugin.USER_FULL_NAME;
import static org.exoplatform.samples.notification.plugin.UpdateProfilePlugin.USER_PROFILE_URL;
// All template builders should extend org.exoplatform.commons.api.notification.channel.template.AbstractTemplateBuilder
public class UpdateProfileWebNotificationBuilder extends AbstractTemplateBuilder {
  // each template builder will override function makeMessage which returns a MessageInfo object that represents the notification to be sent
  @Override
  protected MessageInfo makeMessage(NotificationContext ctx) {
    // retrieve notification from the context
    NotificationInfo notification = ctx.getNotificationInfo();
    // Detect the language of the receiver
    String language = getLanguage(notification);

    // Create a templateContext for the Mail notification, note that we need to specify the channel here, otherwise it will take the default channel : Mail channel
    TemplateContext templateContext = TemplateContext.newChannelInstance(ChannelKey.key("WEB_CHANNEL"), notification.getKey().getId(), language);
    // Fill it with data, we should put all the variables with their values that will be replaced later in the notification template
    // they will be prefixed with the $ symbol inside the template
    templateContext.put("USER_FULL_NAME", notification.getValueOwnerParameter(USER_FULL_NAME.getKey()));
    templateContext.put("USER_PROFILE_URL", CommonsUtils.getCurrentDomain() + notification.getValueOwnerParameter(USER_PROFILE_URL.getKey()));

    // the following variables should be present in all web notification
    templateContext.put("NOTIFICATION_ID", notification.getId());
    templateContext.put("MESSAGE", notification.getTitle());
    templateContext.put("READ",
            Boolean.TRUE.equals(Boolean.valueOf(notification.getValueOwnerParameter(NotificationMessageUtils.READ_PORPERTY.getKey()))) ? "read" : "unread");
    Calendar cal = Calendar.getInstance();
    cal.setTimeInMillis(notification.getLastModifiedDate());
    templateContext.put("LAST_UPDATED_TIME", TimeConvertUtils.convertXTimeAgoByTimeServer(cal.getTime(), "EE, dd yyyy", new Locale(language), TimeConvertUtils.YEAR));

    // compute the on-site notification content
    String body = TemplateUtils.processGroovy(templateContext);
    //binding the exception in case it was thrown by processing template
    ctx.setException(templateContext.getException());

    // Create the MessageInfo object
    MessageInfo messageInfo = new MessageInfo();
    return messageInfo.body(body).end();
  }

  @Override
  protected boolean makeDigest(NotificationContext notificationContext, Writer writer) {
    return false;
  }
}
```

3- Add the template provider for Mail notifications, create a new java class named **WebNotificationProvider.java** under *sample-notification/src/main/java/org/exoplatform/samples/notification/web*
```java
package org.exoplatform.samples.notification.mail;

import org.exoplatform.commons.api.notification.annotation.TemplateConfig;
import org.exoplatform.commons.api.notification.annotation.TemplateConfigs;
import org.exoplatform.commons.api.notification.channel.template.TemplateProvider;
import org.exoplatform.commons.api.notification.model.PluginKey;
import org.exoplatform.container.xml.InitParams;
import org.exoplatform.samples.notification.plugin.UpdateProfilePlugin;

// Add the URL to load the template used by the notification plugin
@TemplateConfigs(templates = {
        @TemplateConfig(pluginId = UpdateProfilePlugin.ID, template = "war:/templates/notification/mail/updateProfileMailNotification.gtmpl")
})
// All template providers should extend org.exoplatform.commons.api.notification.channel.template.TemplateProvider class
public class MailNotificationProvider extends TemplateProvider {

  //constructor where we add the builder of mail notification to the list of templateBuilders inside the server
  public MailNotificationProvider(InitParams initParams) {
    super(initParams);
    this.templateBuilders.put(PluginKey.key(UpdateProfilePlugin.ID), new UpdateProfileMailNotificationBuilder());
  }
}
```

4- Update the configuration by telling the Channel manager to use the new Web template provider for all email notifications related to the UpdateProfilePlugin. You need to add the following configuration in the file **sample-notification/webapp/src/main/webapp/WEB-INF/conf/configuration.xml** and add the new template provider under the Mail template provider :
```xml
	<external-component-plugins>
		<!-- Target service to update-->
		<target-component>org.exoplatform.commons.api.notification.channel.ChannelManager</target-component>
		<component-plugin profiles="all">
			<!-- unique name of our new plugin -->
			<name>mail.channel.updateProfile.template</name>
			<set-method>registerTemplateProvider</set-method>
			<!-- The new Template provider that we have just added -->
			<type>org.exoplatform.samples.notification.mail.MailNotificationProvider</type>
			<init-params>
				<!-- Target notification channel -->
				<value-param>
					<name>channel-id</name>
					<value>MAIL_CHANNEL</value>
				</value-param>
			</init-params>
		</component-plugin>
		<component-plugin profiles="all">
			<!-- unique name of our new plugin -->
			<name>web.channel.updateProfile.template</name>
			<set-method>registerTemplateProvider</set-method>
			<!-- The new Template provider that we have just added -->
			<type>org.exoplatform.samples.notification.web.WebNotificationProvider</type>
			<init-params>
				<!-- Target notification channel -->
				<value-param>
					<name>channel-id</name>
					<value>WEB_CHANNEL</value>
				</value-param>
			</init-params>
		</component-plugin>
	</external-component-plugins>
```

**Our notications will look like this :**

<div>
  <figure>
    <img src='/img/notification/mail-sample-notif-templated.png' class="center">
    <figcaption class="center-text">Mail notification decorated with a template</figcaption>
  </figure>

  <figure>
    <img src='/img/notification/web-sample-notif-templated.png' class="center">
    <figcaption class="center-text">On site notification decorated with a template</figcaption>
  </figure>
</div>  


## Overriding email notification templates

Thanks to the extensibility mechanisms in eXo platform, it is also possible to change how an existing notification is displayed. 
The steps are pretty simple :

1- Get the notification template to override

2- copy it and paste it under the same relative path inside your extension.

**Example**: if the template is originally under **social-extension.war/WEB-INF/notification/templates/LikePlugin.gtmpl**, you will have just to :

1- copy the file under **custom-extension.war/WEB-INF/notification/templates/LikePlugin.gtmpl**

2- Modify it to get the required changes applied.

3- Deploy it, and restart the server

::: tip Note
The template of the header **NotificationHeader.gtmpl** and the template of the footer **NotificationFooter.gtmpl** of all **email** notification are under **commons-extension.war/WEB-INF/notification/templates/mail/** 
Both are overridable, using the same steps.
:::