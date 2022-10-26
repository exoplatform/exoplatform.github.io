# Activity types

> 🚧 Work in progress
> 
> This page will describe how to create a new activity type in eXo Platorm

In this tutorial, we will see how to add a new activity type in eXo Platform.
Activities are short messages sent by users of the platform in different spaces stream. We already have few activity types like this : 
- Simple activity

  ![](/img/activity-type/simple-activity.png)

- Poll activity

  ![](/img/activity-type/poll-activity.png)

- Kudo activity

  ![](/img/activity-type/kudo-activity.png)


Each activity type define how the activity object is displayed. 

To illustrate this tutorial, we will create a new activity type named "Mood of the day"

## Init the extension

As first step, follow the tutorial for [preparing the extension](/guide/developer-guide/prepare-extension-project.html#exo-extension), and use the example named 'activity-extensions'.

## Create the Vuejs component

This component will be in charge of displaying all activities of our new type. 
After copying the example project 'activity-extensions', go in folder src/main/webapp/vue-apps and create a new folder named 'mood-of-the-day-activity-type' :
```bash
cd $EXO_HOME/sources/docs-sample/activity-extensions/src/main/webapp/vue-apps
mkdir mood-of-the-day-activity-type
```

In folder mood-of-the-day-activity-type, create a new file named MoodOfTheDayActivityType.vue, containing
```vue
<template>
  <v-card white flat>
    <v-card-title :class="titleSize">
      Mood of the day
    </v-card-title>
    <v-card-subtitle v-sanitized-html="activity && activity.title" />
  </v-card>
</template>

<script>
export default {
  props: {
    activity: {
      type: Object,
      default: null,
    },
  },
  computed: {
    titleSize() {
      return this.isComment && 'text-h6' || 'text-h5';
    },
  }
};
</script>
```

In this file, you can see the props activity : 
```vue
  props: {
    activity: {
      type: Object,
      default: null,
    },
  },
```
This props comes from the upper vue component, and represent the activity object we want to display.
We will display it with a v-card, containing two lines : the first one (the v-card title) will contains "Mood of the day", and the second one (the v-card subtitle) will contain the activity title.

## Register the new activity extension

In the same folder, create a file named main.js, containing
```js
import MoodOfTheDayActivityType from './MoodOfTheDayActivityType.vue';

export function init() {
  extensionRegistry.registerExtension('activity', 'type', {
    /* Activity.type. 'default' corresponds
    to all activities which doesn't have
    a corresponding extension */
    type: 'moodActivity',
    options: {
      // Redefine all the activity display by a custom one
      getExtendedComponent: () => ({
        component: MoodOfTheDayActivityType,
        overrideHeader: false,
        overrideFooter: false,
      }),
      // Whether to display edit button or not when user have permission
      canEdit: () => false,
      canShare: () => false,
    },
  });
}
```

This file allow to register our Vue component in the eXo Platform extensionRegistry. The two first parameter of the function registerExtension define which kind of extension we are registring, the third one defines the object we want to register.
The 'type' parameter is our extension type. All activities with this type we be displayed with our Vue component.

## Load the Vue Component

Create the folder `$EXO_HOME/sources/docs-sample/activity-extensions/src/main/webapp/groovy/MoodOfTheDayActivityExtension.gtmpl`

Fill this file with 

```js
<script type="text/javascript" defer="defer">
  require(["SHARED/moodOfTheDayActivityType"],
    function (moodOfTheDayActivityType) {
      moodOfTheDayActivityType.init();
    });
</script>
```

Update file `$EXO_HOME/sources/docs-sample/activity-extensions/src/main/webapp/WEB-INF/conf/activity-extensions/body-template-extension-configuration.xml`

Replace the existing  `external-component-plugin` by 

```xml
<external-component-plugins>
    <target-component>org.exoplatform.groovyscript.text.TemplateService</target-component>
    <component-plugin>
      <name>UIPortalApplication-End-Body</name>
      <set-method>addTemplateExtension</set-method>
      <type>org.exoplatform.groovyscript.text.TemplateExtensionPlugin</type>
      <init-params>
        <values-param>
          <name>templates</name>
          <description>Add MoodOfTheDayActivityType in portal</description>
          <value>war:/groovy/MoodOfTheDayActivityExtension.gtmpl</value>
        </values-param>
      </init-params>
    </component-plugin>
  </external-component-plugins>
```

This xml configuration will indicate to the portal, to insert the gtmpl `.MoodOfTheDayActivityExtension.gtmpl` in the dynamic container `UIPortalApplication-End-Body` when loading the portal. The gtmpl load the javascript file which load the activity extension. 



## Deploy the extension

1.  We will now build and deploy our extension
    ```bash
    cd $EXO_HOME/sources/docs-sample/activity-extensions
    mvn clean package
    ```

2. And deploy it to the server
    ```bash    
    cp target/activity-extensions.war $EXO_HOME/webapps
    ```

3.  Update docker compose configuration to mount the new war file in the webapps of the server. The **volumes** section should be like this :
    ```
      volumes:
        - exo_data:/srv/exo
        - exo_logs:/var/log/exo
        - $EXO_HOME/webapps/activity-extensions.war:/opt/exo/webapps/activity-extensions.war
    ```
3.  Restart the docker containers of eXo platform :
    ```bash
    docker-compose -f docker-compose.yml up
    ```      

## Create an activity with the new type
To create an activity we will use REST service which [manage activities](/guide/openapi/social.html#/v1%2Fsocial%2Factivities/postActivity).

To use it, we firstly need a space in which we will create the activity. Access to the application, and create a new space. Then access to url to get user spaces :

    http://{eXoServer}/portal/rest/v1/social/spaces?limit=10

Find your space and note the attribute "id". If the space is the first one create, the id will be 1

The create the activity, we need to make a POST request. In this example, we will make it with curl, but you can use tools like [Talent API Tester](https://chrome.google.com/webstore/detail/talend-api-tester-free-ed/aejoelaoggembcahagimdiliamlcdmfm?hl=fr) or [YARC](chrome-extension://ehafadccdcdedbhcbddihehiodgcddpl/index.html) which will help to make REST requests.

With curl tool, launch theses requests in your command line tool : 

```bash
curl -X POST -c cookies -d 'username=root&password=password' http://localhost:8080/portal/login
curl -X POST -b cookies -H 'Content-Type: application/json' -d '{"title": "Im happy","type": "moodActivity"}' http://localhost:8080/portal/rest/v1/social/activities?spaceId=1
```

The first command make the login and store cookies in `cookies` file. The second command makes the POST request using `cookies file for the authentication. 

Access to the space :
    ![](/img/activity-type/mood-result.png)

The activity is displayed in the stream using the Vue file we created. Each activity with type `moodActivity` will use this template for display. 
We can now imagine an application in which the user can give his mood, and the application automatically create the associated activity.

