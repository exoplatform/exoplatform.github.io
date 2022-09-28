# Event listeners

eXo platform includes a mechanism to implement event listeners. 
An event listener is a component that will be executed following a specific user action or a system event.
It is an implementation of the interface **org.exoplatform.services.listener.Listener**, and should implement the function onEvent where you can add extra logic to existing functionality.
## Lifecycle of an event
1- User performs an action 
2- A backend service will handle that action, once fulfilled broadcasts an event identified by the event name, with data related to the completed operation
3- The event listener attached to that event will be fired 
4- You can add as many events as you need for each event
## Create an Event listener
There are a list of predefined events in the platform. You will use the login event as an example for this exercise.
This section will walk you through a complete sample extension that instructs you how to build your first event listener :
1.  Create a new project based on [the template](https://github.com/exo-samples/docs-samples/tree/master/custom-extension) of eXo platform extension
2.  Create a new class LoginEventListener.java under a new package named **org.exoplatform.samples.listener** : 
    ```java
      package org.exoplatform.samples.listeners;

      import org.exoplatform.services.listener.Event;
      import org.exoplatform.services.listener.Listener;
      import org.exoplatform.services.log.ExoLogger;
      import org.exoplatform.services.log.Log;
      import org.exoplatform.services.security.ConversationRegistry;
      import org.exoplatform.services.security.ConversationState;

      // The class LoginEventListener should extend class Listener
      // The class Listener takes two parametrized types that will be passed to the event object and be used respectively as :
      // 1- Event source object
      // 2- Event data object
      public class LoginEventListener extends Listener<ConversationRegistry, ConversationState> {

        // Logger object for this Listener
        private static final Log LOG = ExoLogger.getLogger(LoginEventListener.class);

        @Override
        public void onEvent(Event<ConversationRegistry, ConversationState> event) throws Exception {
          // Retrieve the source for this event
          ConversationRegistry source = event.getSource();
          // Retrieve the data of the event
          ConversationState data = event.getData();
          LOG.info("An event was received from {} : The user {} was logged in", source.getClass(), data.getIdentity().getUserId());
        }
      }
    ```
3.  Add the needed configuration to activate this listener, and specify the name of the event that it will be listening to :
    ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd http://www.exoplatform.org/xml/ns/kernel_1_2.xsd"
      xmlns="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd">
        <!-- register new event listener that will be fired when a user logs in-->
        <external-component-plugins>
          <!-- The service ListenerService registers all listeners with their respective event names -->
          <target-component>org.exoplatform.services.listener.ListenerService</target-component>
          <component-plugin>
            <!-- The event name, it identifies an event, we can have many listeners for the same event -->
            <name>exo.core.security.ConversationRegistry.register</name>
            <!-- This is the function in ListenerService called to register each new listener -->
            <set-method>addListener</set-method>
            <!-- Here you put the FQN of the new listener -->
            <type>org.exoplatform.samples.listener.LoginEventListener</type>
          </component-plugin>
        </external-component-plugins>
      </configuration>

    ```          

4.  Build the project using Maven :
```shell
   cd $EXO_HOME/sources/sample-event-listener 
   mvn package
```
5.  Copy the built jar and war files to their destination folders inside the $EXO_HOME 
```shell
   cp services/target/sample-notification-services.jar $EXO_HOME/lib/sample-notification-services.jar
   cp webapp/target/sample-notification-webapp.war $EXO_HOME/webapps
```    
6.  Deploy both files inside the eXo platform container, using the volumes section in **docker-compose.yml** :
```shell
       volumes:
         - exo_data:/srv/exo
         - exo_logs:/var/log/exo
         - $EXO_HOME/lib/sample-event-listeners.jar:/opt/exo/lib/sample-event-listeners.jar
         - $EXO_HOME/webapps/event-listeners-webapp.war:/opt/exo/webapps/event-listeners-webapp.war
```
7.  Start eXo platform : 
```shell
   docker-compose -f /path/to/docker-compose.yml up
```
8.  If the above steps are successfully applied, you should see a new line in docker logs :
```
exo_1      | 2022-09-28 20:36:23,202 | INFO  | An event was received from class org.exoplatform.services.security.ConversationRegistry : The user haroun was logged in [o.e.samples.listener.LoginEventListener<http-nio-0.0.0.0-8080-exec-2>] 
``` 

## List of built-in events
Event name | Description
------|------
exo.core.security.ConversationRegistry.register | A user logs in
exo.core.security.ConversationRegistry.unregister | a user logs out
login.failed | 
metadata.tag.added | 
dlp.listener.event.detect.item | 
exo.agenda.event.created | 
exo.agenda.event.updated | 
exo.agenda.event.responseSaved | 
exo.agenda.event.responseSent | 
exo.agenda.event.poll.created | 
exo.agenda.event.poll.voted | 
exo.agenda.event.poll.dismissed | 
exo.agenda.event.poll.voted.all | 
exo.onlyoffice.editor.opened | 
exo.task.taskCreation | 
exo.task.taskUpdate | 
share_document_event | 
rename_file_event | 
Document.event.TagAdded | 
Document.event.TagRemoved | 