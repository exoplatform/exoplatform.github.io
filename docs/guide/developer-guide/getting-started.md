# Getting started

## Setting up development environment

This guideline helps developers to set up their development environment (SCM, IDE and building tools).

To set up development environment, see the followings:

- JDK 11+ is required.
- [Maven](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) (3.6 or later) and [Git](#git-and-github-com) are required to developers who want to contribute to eXo projects (mainly the company’s developers).
- Any Java IDE tool can be used, such as [Eclipse](https://www.eclipse.org), [NetBean](https://netbeans.org).
- Developers who write extensions are free to choose their favorite tools. Maven and GIT are recommended to get the best support from eXo Company and Community.

### Setting eXo Repository in Maven

To set up Maven, you can follow instructions in [Apache's Maven in 5 minutes](http://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) for quick start or see [The Apache Maven definitive guide by
Sonatype](http://books.sonatype.com/mvnref-book/reference/index.html) for a complete reference.

To use eXo APIs in your own projects, you have to add the eXo Platform Maven repository to your Maven `settings.xml` file.

- Open the `settings.xml` file in `$M2_HOME/conf/` or `${user.home}/.m2/`, depending on your Maven installation. Refer to [Maven settings guideline](http://maven.apache.org/settings.html) for more details.

- Add a repository to this file, as stated in [Maven's Guide to using Multiple Repositories](http://maven.apache.org/guides/mini/guide-multiple-repositories.html).

- Replace the repository URL in your settings with <http://repository.exoplatform.org/public>.

- An example of `settings.xml`:

  ``` xml
  <settings>
  ...
  <profiles>
  ...
      <profile>
          <id>myprofile</id>
          <repositories>
              <repository>
               <id>eXo-pub-repo</id>
               <name>eXoPlatform public repo</name>
               <url>http://repository.exoplatform.org/public</url>
              </repository>
          </repositories>
      </profile>
  ...
  </profiles>
  
  <activeProfiles>
      <activeProfile>myprofile</activeProfile>
  </activeProfiles>
  ...
  </settings>
  ```

### Importing eXo dependencies

You can, of course, add any eXo artifact as a dependency of your project. To avoid losing time looking for the good version of the artifacts you want to add as dependencies, eXo Platform provides an [import
dependency](https://repository.exoplatform.org/content/groups/public/org/exoplatform/social/social/) which defines all of the versions for you. You just need to give the version of eXo Platform you are using, without concerning about proper versions of all artifacts. To import the right eXo dependencies, you can refer to [Dependency Management](http://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Dependency_Management) for more details.

- Here is an example of the `pom.xml` file using implicit variables to
  indicate the artifact version:

  ``` xml
  <?xml version="1.0" encoding="UTF-8"?>
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
          <modelVersion>4.0.0</modelVersion>
          <groupId>com.mycompany</groupId>  
          <artifactId>my-project</artifactId>
          <version>1.0-SNAPSHOT</version>
          <packaging>war</packaging>
          <name>My project</name>
          <properties>
              <exoplatform.version>6.3.0</exoplatform.version>
          </properties>
          <dependencyManagement>
              <dependencies>
              <!-- Import versions from social project -->
                  <dependency>
                      <groupId>org.exoplatform.social</groupId>
                      <artifactId>social</artifactId>
                      <version>${exoplatform.version}</version>
                      <type>pom</type>
                      <scope>import</scope>
                  </dependency>
              </dependencies>
          </dependencyManagement>
      </project>
  ```

  In this file, the property `exoplatform.version` was declared under `properties` tag, indicating a specific platform version used for the project. After that, each dependency (under `dependencyManagement` tag) can reuse this parameter as an implicit variable `${exoplatform.version}` without specifying its artifact version.

### Git and github.com

eXo projects use Git and [github.com](https://github.com) for managing source code. Thus, to contribute to the projects, you need to install Git and register a [github.com](https://github.com) account. See <http://git-scm.com/docs> to learn to use Git.

Many eXo projects are public at [Meeds-io
repositories](https://github.com/meeds-io/) and [eXo Platform repositories](https://github.com/exoplatform/). To contribute to a project, you can follow steps described in [Community member
contribution guide](http://developer.exoplatform.org/#id-community-contributions).

::: tip Note
To write your own extension, see [this sample project](https://github.com/exo-samples/docs-samples/tree/master/custom-extension).
:::
## How to contribute on eXo Platform
> 🚧 Work in progress

## Customization Capabilities with eXo Platform
::: warning
🚧🛑 To rework
:::
eXo Platform can be easily customized and extended by:

- Creating extensions that allows you to customize all resources of
  eXo Platform, including templates, skin, default configuration, and
  more.
- Creating new applications (portlets or gadgets) that you can add to
  your portal's pages.

### Extensions

Almost everything in eXo Platform can be customized through extensions.
The main concept behind extensions is that resources of your extensions
will override resources of eXo Platform. See `eXo Platform Extensions
<PLFDevGuide.eXoAdd-ons.PortalExtension>` for more details.

Here are some examples of what can be done with extensions:

- Creating a site with some pages and navigations.
- Customizing internationalized labels.
- Changing the default connector for users/groups/roles.
- Creating and customizing a new site. See `Creating a new site
  <#PLFDevGuide.Site.CreateNew>` for details.
- Adding or removing languages. See `Adding/Removing a language
  <#PLFDevGuide.Site.Features.Languages>` for details.
- Creating a new skin for `your site
  <#PLFDevGuide.Site.LookAndFeel.CreatingNewSiteSkin>` and `portlet
  <#PLFDevGuide.Site.LookAndFeel.CreatingNewPortletSkin>`.
- Creating and customizing templates for content. See `Developing
  Content <#PLFDevGuide.DevelopingContent>` for more details.
- Creating a Groovy REST script in your extension that will be loaded
  at startup by the REST engine. See `Using Groovy REST service
  <#PLFDevGuide.DevelopingRESTServices.UsingGroovyRESTService>` for
  more details.

### Applications

Applications are blocks that compose a portal page. eXo Platform comes
with a lot of out-of-the-box applications which allow you to display a
navigation menu, display a content or a list of content, manage
bookmarks, display your next calendar events, and more. Also, you can
create your own applications.

From a technical point of view, an application can be either a portlet
or a gadget. Therefore, it is important to understand distinctions
between gadgets and portlets. While portlets are user interface
components that provide fragments of markup code from the server side,
gadgets generate dynamic web content on the client side. With gadgets,
small applications can be built quickly, and mashed up on the client
side using lightweight Web-Oriented Architecture (WOA) technologies,
like REST or RSS.


