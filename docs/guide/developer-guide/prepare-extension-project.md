# First step : Prepare extension project
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

::: warning
$EXO_HOME is the root of our working folder where we put the docker compose file and all the other files that will be used by our dockerized environment. Make sure to add it as an environment variable in your system, or replace it with the full path of the working folder. Please check [Start eXo platform guide](/guide/getting-started/start-community.html#start-exo-platform)
:::

### eXo extension structure
The extension is a maven project that has the following structure
```
📦custom-extension
 ┣ 📂services
 ┃ ┣ 📂src
 ┃ ┃ ┗ 📂main
 ┃ ┃ ┃ ┣ 📂java
 ┃ ┃ ┃ ┃ ┗ 📂org
 ┃ ┃ ┃ ┃ ┃ ┗ 📂exoplatform
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂samples
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂services
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜SampleService.java
 ┃ ┃ ┃ ┗ 📂resources
 ┃ ┗ 📜pom.xml
 ┣ 📂webapp
 ┃ ┣ 📂src
 ┃ ┃ ┗ 📂main
 ┃ ┃ ┃ ┣ 📂resources
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
The project custom-extension is a template for an eXo platform extension. We use Maven as our principal build tool.
The project consists of 2 modules :

1.  Services modules : You use this module for all services and plugins (Java classes) that you will develop. Once built, this module will generate a jar archive that you will deploy under the **lib** folder of your eXo platform server.
    - ``` services/pom.xml ``` : Maven descriptor that will be used to build the library of the extension services 
    - ``` services/src/main/java/ ``` : You create your packages and java classes inside this folder to be built and added to the resulting jar archive. We put a file **SampleService.java** to be used as example of services that are deployed in eXo platform server


2.  Webapp module : you use this module to add configuration for all services that you developed. You could use it also to alter default configurations of built-in services.
    - ``` webapp/src/main/webapp/META-INF/exo-conf/configuration.xml ``` : is the extension activator, it tells the eXo platform server that the current web app is an eXo extension
    - ``` webapp/src/main/webapp/WEB-INF/conf/configuration.xml ``` : an XML configuration file that could be used to add / modify an existing server configuration
    - ``` webapp/src/main/webapp/WEB-INF/web.xml ``` : web descriptor of the extension webapp. Usually we won't need  to modify it
    - ``` webapp/src/pom.xml ``` : Maven descriptor that will be used to build the extension webapp

 ## Deploy your extension

 1.  To deploy the extension, you need to build it using Maven
     ```shell
       mvn package
     ```

 2.  Create a two folders named **webapps** and **lib** under $EXO\_HOME
     ```shell
       cd $EXO_HOME
       mkdir webapps
       mkdir lib
     ```

 3.  Copy the file custom-extension-webapp.war under the folder $EXO\_HOME/webapps
     ```shell
       cp $EXO_HOME/sources/custom-extension/webapp/target/custom-extension-webapp.war $EXO_HOME/webapps
     ```

 3.  Tell the docker compose file to use the new file with the eXo platform server. Modify the file $EXO_HOME/docker-compose.yml and add this code under the **volumes** section of the exo container. It should look like this:
     ```
        volumes:
            - exo_data:/srv/exo
            - exo_logs:/var/log/exo
            - $EXO_HOME/webapps/custom-extension-webapp.war:/opt/exo/webapps/custom-extension-webapp.war
     ```

 4.  Restart exo docker environment, you should replace $EXO_DOCKER_NAME with the name of the container of eXo server.
     ```shell
       docker restart $EXO_DOCKER_NAME 
     ```

### Test your extension
Finally, let's test our extension and make sure it works.
We will modify the corporation name in the top bar of our digital workplace instance, by default it is Digital Workplace, we will change it to ACME corp :
1.  Using your file editor, open the file $EXO_HOME/sources/custom-extension/src/main/webapp/WEB-INF/conf/configuration.xml
2.  Add the following code inside it :
    ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <configuration
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd http://www.exoplatform.org/xml/ns/kernel_1_2.xsd"
         xmlns="http://www.exoplatform.org/xml/ns/kernel_1_2.xsd">
         <component>
          <key>org.exoplatform.portal.branding.BrandingService</key>
          <type>org.exoplatform.portal.branding.BrandingServiceImpl</type>
          <init-params>
           <value-param>
            <name>exo.branding.company.name</name>
            <value>ACME corp</value>
           </value-param>
           <value-param>
            <name>exo.branding.company.siteName</name>
            <value>ACME digital village</value>
           </value-param>
           <value-param>
            <name>exo.branding.company.link</name>
            <value>https://acme.com</value>
           </value-param>
           <value-param>
            <name>exo.branding.company.logo</name>
            <value>${exo.branding.company.logo:/images/logo/DefaultLogo.png}</value>
           </value-param>
           <value-param>
            <name>exo.branding.company.favicon</name>
            <value>${exo.branding.company.favicon:/images/favicon/DefaultFavicon.ico}</value>
           </value-param>
           <value-param>
            <name>authentication.background</name>
            <value>${portal.authentication.background:}</value>
           </value-param>
           <value-param>
            <name>authentication.title</name>
            <value>${portal.authentication.title:UILoginForm.label.pageTitle}</value>
           </value-param>
           <value-param>
            <name>authentication.subtitle</name>
            <value>${portal.authentication.subtitle:UILoginForm.label.pageSubTitle}</value>
           </value-param>
           <value-param>
            <name>exo.branding.theme.path</name>
            <value>${exo.branding.theme.path:war:/conf/branding/branding.less}</value>
           </value-param>
           <values-param>
            <name>exo.branding.theme.variables</name>
            <value>${exo.branding.theme.primaryColor:primaryColor:#476A9C}</value>
            <value>${exo.branding.theme.secondaryColor:secondaryColor:#476a9c}</value>
            <value>${exo.branding.theme.tertiaryColor:tertiaryColor:#476A9C}</value>
            <value>${exo.branding.theme.greyColorLighten1:greyColorLighten1:#5f708a}</value>
            <value>${exo.branding.theme.textColor:textColor:#333333}</value>
           </values-param>
          </init-params>
         </component>
      </configuration>
    ```       
::: tip Note 
In the configuration XML file above, we changed the value of the property **exo.branding.company.name**
:::

3.  Build your extension and copy it under the folder $EXO_HOME/webapps :
    ```shell
      cd $EXO_HOME/sources/custom-extension 
      mvn deploy
      cp $EXO_HOME/sources/custom-extension/webapp/target/custom-extension-webapp.war $EXO_HOME/webapps/custom-extension-webapp.war
    ```
4.  Restart your eXo platform environment
5.  Check the new instance name in the top banner, you should see : **ACME corp**

![eXo branding : site name changed](/img/prepare-extension-project/exo-branding-name-changed.png)

## Rename the extension
In the following tutorials and for your future developments on top of eXo platform, you will need to rename this extension project. 
To rename the extension to awesome-extension follow the steps above :
1.  Rename the project folder from **custom-extension** to **awesome-extension**
2.  In *awesome-extension/pom.xml*Rename the **groupid** to your organization's group ID like *com.acme* and **artifactid** to *awesome-extension*
3.  In the files *awesome-extension/services/pom.xml*  and *awesome-extension/webapp/pom.xml* , rename the **parent** tag to
    ```xml
      <parent>
         <groupId>com.acme</groupId>
         <artifactId>awesome-extension</artifactId>
         <version>1.0.x-SNAPSHOT</version>
      </parent> 
    ```   
4. In *awesome-extension/services/pom.xml* , rename *artifactId* and *finalName* to *awesome-extension-services*
5. In *awesome-extension/webapp/pom.xml* , rename *artifactId* and *finalName* to *awesome-extension-webapp*
6. In *awesome-extension/webapp/src/main/webapp/META-INF/exo-conf/configuration.xml* , replace **<string>custom-extension-webapp</string>** with **<string>awesome-extension-webapp</string>**
7. In *awesome-extension/webapp/src/main/webapp/WEB-INF/web.xml* , replace **<display-name>custom-extension-webapp</display-name>** with **<display-name>awesome-extension-webapp</display-name>**

That is it, you have now a new extension with a new name that you can add to the volumes of your eXo platform server.
