# Create a new REST service

> 🚧 Work in progress
>
> This page will describe how to create a new REST Service exposing data and how to deploy it in eXo 
Jax-RS ([JSR 311](https://jcp.org/aboutJava/communityprocess/final/jsr311/index.html)) is a Java API for developing applications using the REST architecture.

## Develop a Rest service
You will use the same extension we created in [Prepare your extension project tutorial](../prepare-extension-project)
1.  Copy the extension to your new project and rename it to **my-connections-birthdays-extension** as described in [Rename your extension](../prepare-extension-project.md#rename-the-extension) tutorial
2.  Create a new Java package *com.acme.services* under **my-connections-birthdays-extension/services/src/main/java**
3.  Create a new Java class **MyConnectionsBirthdaysService** under **my-connections-birthdays-extension/services/src/main/java/com/acme/services** . This class will represent the RESTfull service. It should implement the class interface *org.exoplatform.services.rest.resource.ResourceContainer*
    ```java
      
    ```
5.  