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

This is a non exhaustive list of events already present in eXo platform

Event name | Description
------|------
exo.core.security.ConversationRegistry.register | A user logs in
exo.core.security.ConversationRegistry.unregister | A user logs out
login.failed | A user failed to login
exo.onlyoffice.editor.opened | OnlyOffice editor opened to edit a document
share_document_event | A document was shared to a space/user
rename_file_event | A file was renamed
exo.automatic-translation.event.translate | A request to translate an activity was sent 
Document.event.TagAdded   | A new tag added to a document
Document.event.TagRemoved | A tag removed from a document
metadata.tag.added | a new tag added to metadata
meeds.poll.createPoll | Poll created
meeds.poll.votePoll   | A poll was voted
exo.agenda.event.created |   An event was created
exo.agenda.event.poll.created | A poll created for an event  
exo.agenda.event.updated   | an event was updated
exo.agenda.event.poll.voted   | A poll for an event gets voted
exo.agenda.event.poll.dismissed  |  A vote for an event poll was dismissed
exo.agenda.event.poll.voted.all   | All participants in an event did vote
exo.agenda.event.responseSent   | A response was sent for an event
org.exoplatform.web.GenericHttpListener.sessionCreated | new HTTP session was created
org.exoplatform.web.GenericHttpListener.sessionDestroyed | an HTTP session was destroyed  
dlp.listener.event.detect.item | An item was detected by DLP
dlp.listener.event.delete.item | An item was deleted by DLP 
dlp.listener.event.restore.item | A deleted item was restored by DLP 
social.metadataItem.created | a new metadata item was created
social.metadataItem.deleted  | a metadata item was deleted
social.metadataItem.updated  | a metadata item was updated
social.metadataItem.shared | a new metadata item was shared
exo.wiki.edit | a Notes (aka Wiki) page was updated
WCMPublicationService.event.updateState | Publication state of a document was updated 
PublicationService.event.postChangeState | Event fired before updating the publication state of a content 
CmsService.event.postCreate | A new content created  
CmsService.event.postEdit   | A content is updated     
WebDavService.event.postUpload | A file was uploaded from Webdav connector 
PublicationService.event.postUpdateState | A publication state will be changed
ActivityNotify.event.FileCreated | A new file was created/uploaded
ActivityNotify.event.StateChanged | the publication state of a content\file has been changed 
ActivityNotify.event.PropertyUpdated | a property of a content as updated
FileActivityNotify.event.PropertyAdded | a content was added a new property
FileActivityNotify.event.PropertyRemoved | a property of a content was removed
FileActivityNotify.event.FileRemoved  | A file was removed
FileActivityNotify.event.PropertyUpdated | a property of a content was updated
ActivityNotify.event.AttachmentAdded | A file was attached to an activity
ActivityNotify.event.AttachmentRemoved | An attached file was removed from an activity
ActivityNotify.event.CategoryAdded | A content was added to a Category
ActivityNotify.event.CategoryRemoved | A content was removed from an activity
ActivityNotify.event.CommentAdded | A comment was added to an activity
ActivityNotify.event.CommentUpdated | A comment was updated 
ActivityNotify.event.CommentRemoved | A comment was removed
ActivityNotify.event.NodeMoved | A content was moved
ActivityNotify.event.NodeRemoved | A content was removed
ActivityNotify.event.RevisionChanged | A content revision was restored
exo.news.gamification.postArticle | A new article was posted
exo.news.gamification.PublishArticle | A new article was published
exo.news.postArticle | A new article was posted
exo.news.updateArticle | An article was updated
exo.news.deleteArticle | An article was deleted
exo.news.viewArticle | An article was viewed
exo.news.shareArticle | An article was shared
exo.news.commentArticle | An article was commented
exo.news.likeArticle | An article was liked
exo.news.archiveArticle | An article was archived
exo.news.unarchiveArticle | An article was un-archived
exo.news.scheduleArticle | An article publication was scheduled
exo.news.unscheduleArticle | An article publication was unscheduled
exo.task.taskCreation | A task was created
exo.task.taskUpdate | A task was updated
exo.task.taskCommentCreation | A task had a new comment
exo.project.projectModified | A task's project was modified
exo.task.labelAddedToTask | A label was added to a task
exo.task.labelDeletedFromTask | A label deleted from a task
challenge.announcement.activity | A challenge was announced
exo.gamification.generic.action | A generic action for gamification events
exo.gamification.domain.action | A generic event for adding/updating/deleting gamification domains
exo.kudos.activity | A kudos activity was created
exo.kudos.sent | A kudos was sent
exo.perkstore.order.createOrModify | An order created/updated
exo.perkstore.product.createOrModify | A Product created/updated
exo.perkstore.settings.modified | The settings of perkstore updated
exo.wallet.reward.report.success | Rewarding report generated successfully
exo.wallet.transaction.replaced | A blockchain transaction was replaced by another onEvent
exo.wallet.addressAssociation.new | the address of the wallet created
exo.wallet.block.mined | A new block mined in the Blockchain
exo.wallet.transaction.mined | A transaction was mined in the blockchain
exo.wallet.transaction.modified | A transaction was modified in the blockchain
exo.wallet.transaction.sent | A transaction was sent to the blockchain
exo.wallet.modified | A wallet was modified
exo.wallet.contract.modified | The blockchain contract was modified
exo.wallet.deleted | The wallet was deleted
exo.webconferencing.callCreated | Web conferencing : call created
exo.webconferencing.callStarted | Web conferencing : call started
exo.webconferencing.callJoined | Web conferencing : user joined the call
exo.webconferencing.callLeft | Web conferencing : user left the call
exo.webconferencing.callStopped | Web conferencing : call stopped
exo.webconferencing.callRecorded | Web conferencing : call was recorded successfully