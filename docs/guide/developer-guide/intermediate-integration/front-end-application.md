# Develop a front end application 

eXo Platform uses Portlets ([JSR-168](https://www.jcp.org/en/jsr/detail?id=168)) are user interface components that provide fragments of markup code from the server side. 
We can use many Frontend technologies to build portlets like :
1.  Java Server Pages (JSP)
1.  Java Server Faces (JSF)
1.  Spring MVC
1.  HTML/Javascript : Angular - React - VueJS

In this tutorial , we will build a VueJS portlet.
[VueJS](https://vuejs.org/) is a approachable, performant and versatile framework for building web user interfaces using Javascript.
Since eXo platform 6.0, VueJS became the principal framework for building frontend application in eXo platform.

Download the complete example from [VueJS portlet sample](https://github.com/exo-samples/docs-samples/tree/master/portlet/vue-portlet-webpack)
  
## Project structure

This is the structure for our project, it consists of 2 parts :
1.  A frontend application that will be implemented with VueJS
1.  An eXo extension that will hold the configuration needed to add the application in a new page, and provide static resources like CSS, JS and i18n assets

    ```
      📦vue-portlet-webpack
      ┣ 📂.vscode
      ┃ ┗ 📜settings.json
      ┣ 📂src
      ┃ ┣ 📂main
      ┃ ┃ ┣ 📂resources
      ┃ ┃ ┃ ┗ 📂locale
      ┃ ┃ ┃ ┃ ┗ 📂addon
      ┃ ┃ ┃ ┃ ┃ ┗ 📜Sample_en.properties
      ┃ ┃ ┗ 📂webapp
      ┃ ┃ ┃ ┣ 📂META-INF
      ┃ ┃ ┃ ┃ ┗ 📂exo-conf
      ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
      ┃ ┃ ┃ ┣ 📂WEB-INF
      ┃ ┃ ┃ ┃ ┣ 📂conf
      ┃ ┃ ┃ ┃ ┃ ┣ 📂custom-extension
      ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂portal
      ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂portal
      ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂dw
      ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜navigation.xml
      ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜pages.xml
      ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜bundle-configuration.xml
      ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜portal-configuration.xml
      ┃ ┃ ┃ ┃ ┃ ┗ 📜configuration.xml
      ┃ ┃ ┃ ┃ ┣ 📜gatein-resources.xml
      ┃ ┃ ┃ ┃ ┣ 📜portlet.xml
      ┃ ┃ ┃ ┃ ┗ 📜web.xml
      ┃ ┃ ┃ ┣ 📂css
      ┃ ┃ ┃ ┃ ┗ 📜sample.css
      ┃ ┃ ┃ ┣ 📂vue-app
      ┃ ┃ ┃ ┃ ┣ 📂components
      ┃ ┃ ┃ ┃ ┃ ┣ 📜app.vue
      ┃ ┃ ┃ ┃ ┃ ┗ 📜todo-list-component.vue
      ┃ ┃ ┃ ┃ ┣ 📜initComponents.js
      ┃ ┃ ┃ ┃ ┗ 📜main.js
      ┃ ┃ ┃ ┗ 📜index.html
      ┃ ┗ 📂test
      ┃ ┃ ┗ 📜globals.js
      ┣ 📜.eslintrc.json
      ┣ 📜package-lock.json
      ┣ 📜package.json
      ┣ 📜pom.xml
      ┣ 📜webpack.prod.js
      ┗ 📜webpack.watch.js
    ```

1.  Here is the list of files that will create tha application (portlet) : 
    -  ```src/main/webapp/WEB-INF/portlet.xml``` : XML descriptor for portlets, mandatory when we have portlets in the webapp. it contains the basic information about the application : name, resource-bundles location, portlet class, etc ...
       ```xml
          <portlet-app version="2.0" xmlns="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd">

            <!-- block to define a new portlet-->
            <portlet>
              <!-- Portlet name -->
              <portlet-name>vueWebpackSample</portlet-name>
              <!-- Portlet class -->
              <portlet-class>org.exoplatform.commons.api.portlet.GenericDispatchedViewPortlet</portlet-class>
              <!-- Parameters needed to initiate the portlet. In this case the path to the HTML file of the VueJS application -->
              <init-param>
                <name>portlet-view-dispatched-file-path</name>
                <value>/index.html</value>
              </init-param>
              <!-- supported mimetypes -->
              <supports>
                <mime-type>text/html</mime-type>
              </supports>
              <!-- Extra information for the portlet -->
              <portlet-info>
                <title>Vue Webpack Sample</title>
              </portlet-info>
            </portlet>

           </portlet-app>
       ```
    -  ```src/main/webapp/WEB-INF/gatein-resources.xml``` : XML descriptor for CSS and javascript files managed by eXo platform.
       ```xml
          <gatein-resources xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.exoplatform.org/xml/ns/gatein_resources_1_4 
                  http://www.exoplatform.org/xml/ns/gatein_resources_1_4"
                  xmlns="http://www.exoplatform.org/xml/ns/gatein_resources_1_4">
            <!-- This block will add a new CSS file that will be loaded in the page 
            along with a related portlet (it won't be available for other pages) -->      
            <portlet-skin>
              <!-- application name : the display name of the war in web.xml file --> 
              <application-name>vue-webpack-sample</application-name>
              <!-- portlet name defined in portlet.xml file -->
              <portlet-name>vueWebpackSample</portlet-name>
              <!-- Skin name : default to Enterprise-->
              <skin-name>Enterprise</skin-name>
              <!-- Path to CSS file under this webapp-->
              <css-path>/css/sample.css</css-path>
            </portlet-skin>

            <!-- This block will add a new JS to the site. This CSS will be loaded in the page 
            along with a related portlet (it won't be available for other pages) -->
            <portlet>
              <!-- portlet name defined in portlet.xml file -->
              <name>vueWebpackSample</name>
              <!-- JS file will be added as a Javascript module -->
              <module>
                <script>
                  <!-- JS is already minified by NPM, no need to minify it again -->
                  <minify>false</minify>
                  <!-- Path to JS file under this webapp-->
                  <path>/js/sample.bundle.js</path>
                </script>
                <!-- Javascript dependencies for this JS module -->
                <depends>
                  <module>vue</module>
                </depends>
                <depends>
                  <module>eXoVueI18n</module>
                </depends>
              </module>
            </portlet>
          </gatein-resources>
       ```
    -  ```src/main/webapp/vue-app/main.js``` : it is used to initialize the application inside an element in the HTML file index.html
       ```js  
        import './initComponents.js'; // initialize other VueJS components
        import app from './components/app.vue'; // import the main VueJS application

        // Get the user language
        const lang = eXo && eXo.env && eXo.env.portal && eXo.env.portal.language || 'en';

        // Get the name of the resource bundle
        const resourceBundleName = 'locale.addon.Sample';

        // Get the URL to load the resource bundles
        const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/${resourceBundleName}-${lang}.json`;

        // getting the resource bundles
        exoi18n.loadLanguageAsync(lang, url)
          .then(i18n => {
            // init Vue app when locale resources are ready
            new Vue({
              render: h => h(app),
              i18n
            }).$mount('#vue_webpack_sample'); // mount the application on the HTML element with id = 'vue_webpack_sample'
          });
       ```
    -  ```src/main/webapp/index.html``` : should at least provide the HTML element where the VueJS application will be mounted. This file will load the main.js file to initialize the application on the page.
       ```html
          <div id="vue_webpack_sample"></div>
       ```  
    -  ```src/main/webapp/vue-app/components/app.vue``` : the VueJS main application
       ```vue
          <template>
            <div id="vue_webpack_sample">
              <span>{{ $t('sample.i18n.label') }}</span>
              <todo-list />
            </div>
          </template>
       ```
    -  ```src/main/webapp/vue-app/components/todo-list-component.vue```: another vue component that was loaded in the Vue JS application 
       ```vue
          <template>
            <div id="todoList">
              <input v-model="newTodo" @keyup.enter="addTodo">
              <ul>
                <li v-for="(todo, index) in todos" :key="index">
                  <span :id="'todo' + index">{{ todo.text }}</span>
                  <button :id="'btnRemove' + index" @click="removeTodo($index)">X</button>
                </li>
              </ul>
            </div>
          </template>
          <script>
          export default {
            data() {
              return {
                newTodo: '',
                todos: [
                  { text: 'Add some todos' }
                ]
              };
            },
            methods: {
              addTodo: function () {
                const text = this.newTodo.trim();
                if (text) {
                  this.todos.push({ text: text });
                  this.newTodo = '';
                }
              },
              removeTodo: function (index) {
                this.todos.splice(index, 1);
              }
            }
          };
          </script>
       ```  
    -  ```src/main/webapp/vue-app/initComponents.js```: a JS script used to register all components created in the current project in the Vue global context to be used by the application.
       ```js
          import TodoList from './components/todo-list-component.vue';

          const components = {
            'todo-list': TodoList,
          };
          for (const key in components) {
            Vue.component(key, components[key]);
          }
       ```    
    -  ```src/main/webapp/css/sample.css``` : CSS classes that will be used to provide styling to the VueJS components. It will be configured in gatein-resources.xml to load it just when the portlet is displayed
       ```css
          #vue_webpack_sample {
            display: flex;
            background: white;
            flex-direction: column;
            align-items: center;
            margin: auto;
            padding: 0;
          }
          #vue_webpack_sample > span {
              color: red;
              margin: auto;
            }
          }
       ```
    -  Node & NPM files :
       -  ```.babelrc```babel configuration file for our VueJS application, for more details check [Babel documentation](https://babeljs.io/docs/en/)
       -  ```.eslintrc.json``` : eslint configuration file check [ESlint documentation](https://eslint.org/docs/latest/user-guide/)
       -  ```package.json```: NPM configuration file, for more details check [NPM documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
       -  ```package-lock.json```: generated NPM configuration file, for more details check [NPM documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json)
       -  ```webpack.common.js```: Common configuration for [Webpack](https://webpack.js.org/concepts/) needed to package the application 
       -  ```webpack.dev.js``` : Development configuration of the application for Webpack, needed to simplify developing and debugging the application
       -  ```webpack.prod.js```:Production configuration of the application for Webpack, used to build final package deployable on production
2.  Here is the list of files included that form the extension : 
   -  ```src/main/webapp/META-INF/exo-conf/configuration.xml``` : extension activator configuration, more details in [Prepare extension project](/guide/developer-guide/prepare-extension-project)
   -  ```src/main/webapp/WEB-INF/web.xml``` : Web application descriptor. it contains 
      -  PortalContainerConfigOwner listener to register the current war as an eXo extension 
      -  ResourceRequestFilter filter to add CSS/JS resources and make them retrieved as declared in gatein-resources.xml file
      ```xml
         <?xml version="1.0" encoding="ISO-8859-1" ?>
          <web-app
                  version="3.0"
                  metadata-complete="true"
                  xmlns="http://java.sun.com/xml/ns/javaee"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
            <!-- display name should be the name of the war file. It will be used as the application name -->
            <display-name>vue-webpack-sample</display-name>
            <absolute-ordering/>

            <!-- This web listener is used to register the current war in the list of deployed extension files -->
            <listener>
              <listener-class>org.exoplatform.container.web.PortalContainerConfigOwner</listener-class>
            </listener>

            <!-- This web filter will load static CSS/JS files according to the declaration in the gatein-resources.xml file -->
            <filter>
              <filter-name>ResourceRequestFilter</filter-name>
              <filter-class>org.exoplatform.portal.application.ResourceRequestFilter</filter-class>
            </filter>

            <filter-mapping>
              <filter-name>ResourceRequestFilter</filter-name>
              <url-pattern>/*</url-pattern>
            </filter-mapping>
          </web-app>
      ```
      -  ```src/main/webapp/WEB-INF/conf/configuration.xml``` : main entry point for configurations available in this extension. This configuration file will loads other configuration files using the import tag. 
      ```xml
         <?xml version="1.0" encoding="UTF-8"?>
          <configuration
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd http://www.exoplatform.org/xml/ns/kernel_1_3.xsd"
            xmlns="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd">

            <!-- Import the configuration file of the resource bundles -->
            <import>war:/conf/custom-extension/bundle-configuration.xml</import>
          </configuration>
      ```
     -  ```src/main/webapp/WEB-INF/conf/custom-extension/bundle-configuration.xml``` : Configuration for the resource bundle files that will be added to the resource bundles of the site to provide internationalization of text
        ```xml
          <?xml version="1.0" encoding="UTF-8"?>
          <configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd http://www.exoplatform.org/xml/ns/kernel_1_3.xsd"
            xmlns="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd">

            <external-component-plugins>
              <!-- Service managing resource bundles -->
              <target-component>org.exoplatform.services.resources.ResourceBundleService</target-component>
              <component-plugin>
                <!-- Name of the plugin -->
                <name>Vue Sample Portlet Resource Bundle</name>
                <!-- function to add the resource bundle -->
                <set-method>addResourceBundle</set-method>
                <!-- type of the plugin -->
                <type>org.exoplatform.services.resources.impl.BaseResourceBundlePlugin</type>
                <init-params>
                  <!-- this resource bundle will be added to the portal (site) resource bundles-->
                  <values-param>
                    <name>portal.resource.names</name>
                    <!-- the location of resource bundles under resources folder -->
                    <value>locale.addon.Sample</value>
                  </values-param>
                </init-params>
              </component-plugin>
            </external-component-plugins>
          </configuration>
        ```
   -  ```src/main/resources/locale/addon/Sample_en.properties``` : the resource bundle file that will be added to the resource bundles of the site. It is a text file composed of key/value pairs representing all text keys with their translation 

## Insert the video using the wizard : add a new page
Please follow this video to know how to add a new page to your digital workplace and insert the new application inside it : 

<video width="640" height="480" controls>
  <source src="/vids/create-frontent-application/add-application-to-new-page.mp4" type="video/mp4">
</video>

## Insert application using configuration
If you want to insert the application automatically when you install the extension in eXo platform server, you can add the following files to your extension. Those files will add automatically a new page and will insert the application inside it.


   -  ```src/main/webapp/WEB-INF/conf/configuration.xml``` : main entry point for configurations available in this extension. This configuration file will loads other configuration files using the import tag. 
      ```xml
         <?xml version="1.0" encoding="UTF-8"?>
          <configuration
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd http://www.exoplatform.org/xml/ns/kernel_1_3.xsd"
            xmlns="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd">

            <!-- Import the configuration file of the resource bundles -->
            <import>war:/conf/custom-extension/bundle-configuration.xml</import>
            <!-- Added a new import to activate configuration of new page / navigation link-->
            <import>war:/conf/custom-extension/portal-configuration.xml</import>

          </configuration>
      ```
   -  ```src/main/webapp/WEB-INF/conf/custom-extension/portal-configuration.xml``` : Configuration for site metadata configuration, it will add a new navigation link and a new page to the site **DW**
      ```xml
         <?xml version="1.0" encoding="UTF-8"?>
          <configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd http://www.exoplatform.org/xml/ns/kernel_1_3.xsd"
            xmlns="http://www.exoplatform.org/xml/ns/kernel_1_3.xsd">
            <external-component-plugins>
              <target-component>org.exoplatform.portal.config.UserPortalConfigService</target-component>
              <component-plugin>
                <name>new.portal.config.user.listener</name>
                <set-method>initListener</set-method>
                <type>org.exoplatform.portal.config.NewPortalConfigListener</type>
                <description>This listener creates a page for Vue sample application</description>
                <init-params>
                  <!-- this configuration will allow to edit the current site pages and navigation links -->
                  <value-param>
                    <name>override</name>
                    <value>true</value>
                  </value-param>
                  <object-param>
                    <name>portal.configuration</name>
                    <description>description</description>
                    <object type="org.exoplatform.portal.config.NewPortalConfig">
                      <!-- Type of site : portal for site, group for spaces  -->
                      <field name="ownerType">
                        <string>portal</string>
                      </field>
                      <!-- This configuration will override existing site configuration -->
                      <field name="override">
                        <boolean>true</boolean>
                      </field>
                      <!-- This configuration will insert new pages/navigation links if not found -->
                      <field name="importMode">
                        <string>insert</string>
                      </field>
                      <!-- Site name -->
                      <field name="predefinedOwner">
                        <collection type="java.util.HashSet">
                          <value>
                            <string>dw</string>
                          </value>
                        </collection>
                      </field>
                      <!-- location of pages/navigation links to import -->
                      <field name="location">
                        <string>war:/conf/custom-extension/portal</string>
                      </field>
                    </object>
                  </object-param>
                </init-params>
              </component-plugin>
            </external-component-plugins>
          </configuration>
      ```
   -  ```src/main/webapp/WEB-INF/conf/custom-extension/portal/portal/dw/navigation.xml``` : configuration for the new added navigation link
      ```xml
         <?xml version="1.0" encoding="ISO-8859-1"?>
         <node-navigation
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.gatein.org/xml/ns/gatein_objects_1_6 http://www.gatein.org/xml/ns/gatein_objects_1_6"
         xmlns="http://www.gatein.org/xml/ns/gatein_objects_1_6">
         <priority>4</priority>
         <page-nodes>
          <!-- Definition of a new navigation link -->
          <node>
            <!-- name of the navigation link, it will be displayed in the link -->
            <name>vueSampleApp</name>
            <!-- Label of the link, it will be the title of the page -->
            <label>Sample Vue App</label>
            <!-- This navigation link will lead to the following page reference -->
            <page-reference>portal::dw::vueSampleAppPage</page-reference>
          </node>
         </page-nodes>
       </node-navigation>
      ```
   -  ```src/main/webapp/WEB-INF/conf/custom-extension/portal/portal/dw/pages.xml``` : configuration for the new page
      ```xml
         <?xml version="1.0" encoding="ISO-8859-1"?>
          <page-set 
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.gatein.org/xml/ns/gatein_objects_1_6 http://www.gatein.org/xml/ns/gatein_objects_1_6"
                  xmlns="http://www.gatein.org/xml/ns/gatein_objects_1_6">
            <page>
              <!-- page name -->
              <name>vueSampleAppPage</name>
              <!-- page title -->
              <title>Sample App</title>
              <!-- page access permissions-->
              <access-permissions>*:/platform/users</access-permissions>
              <!-- page edit permissions -->
              <edit-permission>*:/platform/administrators</edit-permission>
              <!-- structure of the page -->
              <container template="system:/groovy/portal/webui/container/UIContainer.gtmpl">
                <access-permissions>*:/platform/users</access-permissions>
                <!-- portlet insertion inside the page -->
                <portlet-application>
                  <portlet>
                    <!-- application-ref : name of the war file as in display-name in web.xml -->
                    <application-ref>vue-webpack-sample</application-ref>
                    <!-- Portlet ref : name of the portlet as in portlet.xml -->
                    <portlet-ref>vueWebpackSample</portlet-ref>
                  </portlet>
                  <!-- title of the application -->
                  <title>Vue Webpack Sample</title>
                  <!-- Access permission to the page -->
                  <access-permissions>*:/platform/users</access-permissions>
                  <!-- Info bar of the application will be hidden -->
                  <show-info-bar>false</show-info-bar>
                </portlet-application>
              </container>
            </page>
          </page-set>
      ```

## Deploy and test the application
1.  Build the project available in [vue-portlet-webpack](https://github.com/exo-samples/docs-samples/tree/master/portlet/vue-portlet-webpack) sample project
    ```shell
      cd docs-samples/portlet/vue-portlet-webpack
      mvn clean package
    ```
2.  Deploy the file in the eXo platform server
    ```shell
      cp target/vue-portlet-webpack.war $EXO_HOME/webapps/
    ```
3.  Update docker compose configuration to mount the new war file in the webapps of the server. The **volumes** section should be like this :
    ```
      volumes:
        - exo_data:/srv/exo
        - exo_logs:/var/log/exo
        - $EXO_HOME/webapps/vue-webpack-sample.war:/opt/exo/webapps/vue-webpack-sample.war
    ```
3.  Restart the docker containers of eXo platform :
    ```shell
      docker-compose -f docker-compose.yml up
    ```      
