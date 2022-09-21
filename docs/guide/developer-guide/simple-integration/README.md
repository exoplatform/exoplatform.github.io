> 🚧 Work in progress

This section describes how to realize a simple integration in eXo Platform, by using existing framework and extension points. 

By following this tutorial, you will be able to :
- [Add a new activity type](/guide/developer-guide/simple-integration/activity-type.html)
- [Add a new notification type](/guide/developer-guide/simple-integration/notification.html)


eXo platform is offering many capabilities for developers to integrate their developments and customize its default functionality set.
To start developing on top of eXo platform, we need to start by creating a new empty project that will represent an eXo extension.

## eXo extension

### Why an eXo extension
An eXo extension covers almost all kind of customization needed by developers :
 - Adding/modifying backend services
 - Adding/modifying backend services plugins
 - Modifying default configuration of the server
 - Adding frontend widgets (called portlets) 

There are many reasons for developing in an eXo extension
 - Avoid changing the binary
 - Manage your project lifecycle independently from the eXo platform version
 - Improve maintenability by a clear separation between the product and your extension 

You can download an empty extension project from Github :
```shell
git clone https://github.com/exo-samples/docs-samples.git
```
This project contains a set of code samples, we will use just the extension that we can find under docs-samples/custom-extension
Create a sources directory then copy the source code of the **custom-extension** inside it : 
```shell
cd $EXO_HOME
mkdir sources
cp -r docs-samples/custom-extension $EXO_HOME/sources
```

### eXo extension structure
The extension is a maven project that has the following structure
```
📦custom-extension
 ┣ 📂src
 ┃ ┗ 📂main
 ┃ ┃ ┗ 📂webapp
 ┃ ┃ ┃ ┣ 📂META-INF
 ┃ ┃ ┃ ┃ ┗ 📂exo-conf
 ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
 ┃ ┃ ┃ ┗ 📂WEB-INF
 ┃ ┃ ┃ ┃ ┣ 📂conf
 ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
 ┃ ┃ ┃ ┃ ┗ 📜web.xml
 ┗ 📜pom.xml
```
 - ``` src/main/webapp/META-INF/exo-conf/configuration.xml ``` : is the extension activator, it tells the eXo platform server that the current web app is an eXo extension
 - ``` src/main/webapp/WEB-INF/conf/configuration.xml ``` : an XML configuration file that could be used to add / modify an existing server configuration
 - ``` src/main/webapp/WEB-INF/web.xml ``` : web descriptor of the extension webapp. Usually we won't need  to modify it
 - ``` src/pom.xml ``` : Maven descriptor that will be used to build the extension webapp

 ## Deploy your extension

 1. To deploy the extension, you need to build it using Maven
 ```shell
 mvn package
 ```
 2. Create a new folder named **webapps** under $EXO\_HOME
 ```shell
 cd $EXO_HOME
 mkdir webapps
 ```
 3. Copy the file custom-extension.war under the folder $EXO\_HOME/webapps
 ```shell
 cp $EXO_HOME/sources/custom-extension/target/custom-extension.war $EXO_HOME/webapps
 ```
 3. Tell the docker compose file to use the new file with the eXo platform server. Modify the file $EXO_HOME/docker-compose.yml and add this code under the **volumes** section of the exo container. It should look like this:
 ```
  volumes:
      - exo_data:/srv/exo
      - exo_logs:/var/log/exo
      - /opt/exo/webapps/custom-extension.war:$EXO_HOME/webapps/custom-extension.war
 ``` 
        
