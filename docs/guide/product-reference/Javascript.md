# Developing JavaScript

This chapter discusses the right way to write your JavaScript code and include libraries in eXo Platform. How the code can be modularized to share and re-use, and how to avoid conflict as well is the main topic.

The topic will be developed from the JavaScript primitive module patterns to the GateIn approach. You will walk through it by examples, from simple inline scripts to portlet applications. In this chapter:

- `JavaScript module patterns`
- `AMD and RequireJS`
- `Shim configuration and Non-AMD modules`
- `GateIn Module Definition`
- `JQuery versions and plugins`

A little knowledge of JavaScript is required, so if necessary, you should learn [JavaScript, W3 Schools](http://www.w3schools.com/js/) first.

## JavaScript module patterns

### Why module patterns?

As you might experience before, some problems that you often have to deal with in JavaScript are:

- Global variables are modified by not your code.
- Your code invokes a method of a library that is not loaded yet.
- Other code uses the same library but different versions.

In eXo Platform, your application is not a whole page. Your portlet can be added to a page containing many other applications. That emphasizes the importance of modularity. You need to understand the module patterns to write JavaScript safely, even if you are writing only one script file that will use JQuery.

### Closure and self-invoking

Let\'s see an example of global variables. In the page you have a button that counts the number of clicks on it:

``` html
<!DOCTYPE html>
<html>
<head>
<script>
    var counter = 0;
    function count(){
        counter++;
        document.getElementById("result").innerHTML = counter;
    }
</script>
</head>
<body>
    <p>You've clicked <span id="result">0</span> times!</p>
    <button onclick="count();">Click me</button>
</body>
</html>
```

Here you maintain a global variable that increases each time users click on the button. The code should work, but the problem is the variable can be modified by any other code of the page.

If you make the variable a function-scoped one that can only be changed by the function, it will not work as expected because the variable is reset (to zero) every time the function is invoked.

The problem can be solved if you have a way to define a variable at function scope but is initialized only one time. The **closure pattern** is a JavaScript feature that makes it possible:

``` html
<script>
    var counter = (function(){
        var privateCounter = 0;
        return function(){ return privateCounter++; };
    })();
    function count(){
        document.getElementById("result").innerHTML = counter();
    }
</script>
```

Focus on the function declaration first:

```javascript
    function(){...}
```

It is an anonymous function that cannot be invoked by later code, but you make it invoke itself immediately - and only this time - by adding parentheses after the declaration:

```javascript
    (function(){...})();
```

By that way, the private variable is created only one time, but is accessible by any child function under the scope. The next thing is to return that child function to a variable that becomes the only access holder.

``` html
<script>
    var counter = (function(){
        var privateCounter = 0;                                                 //this runs only one time in self-invocation
        return function(){ return privateCounter++; };  //this keeps the access to the private variable
    })();
</script>
```

### The module pattern

From the self-invoking function you can return not only a function but an object that contains many properties and functions. It makes the ability to create a namespace, or in other words, a module. The idea is to return an object with only things that you want to expose to the world, and keep the other things private.

Let\'s see how the code is built step by step before it completes the module pattern:

```javascript
    // create a new scope
    (function (){

    })();

    // give it a name
    var module = (function (){

    })();

    // private method and property
    var module = (function (){
        var privateProperty = "smth";
        var privateMethod = function () {};
    })();

    // public method and property
    var module = (function (){
        return {
            publicPropertyyy: "smth";
            publicMeeethod: function() { //some code };
        }
    })();

    // the complete form
    var module = (function (){
        // private properties and functions
        return {
            // public properties and functions
        }
    })();

    // access it from outside
    module.publicPropertyyy;
    module.publicMeeethod();
```

### The module extension pattern

You can add properties and functions to an existing module, by passing it as a parameter to a new self-invoking function:

```javascript
    var module2 = (function(module){
        module.extension = function() {};
        return module;
    }(module || {});
```

### A Java-like example

To ones who are more familiar with Java, this variation of the pattern is easy to understand because it imitates a simple Java class:

```javascript
    var module = (function(){
        //private
        var name = "default";
        var getName = function(){
            return name;
        };
        var setName = function(newName){
            name = newName;
        };

        //public
        var obj = {
            getName: getName,
            setName: setName
        };
        return obj;
    })();
```

### References

At this point you touch a JavaScript core feature which is the base for many libraries that support modularity. Next, you are introduced to [AMD and RequireJS](Javascript.md#amd-and-requirejs). But you may break to read some other references:

- [JavaScript Function Closures, W3 Schools](http://www.w3schools.com/js/js_function_closures.asp)
- [Module Patterns In-Depth, Ben Cherry](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)
- [Mastering the Module Pattern, Todd Motto](http://toddmotto.com/mastering-the-module-pattern/)

## AMD and RequireJS

### What is AMD?

The module pattern gives you a way to create your namespace to protect private things inside. What if your module depends on other libraries, and the libraries use each other in chain? What if different versions of a library are used by other applications in the same page? Is there a way to always have the right libraries loaded in the right order?

The answer is to modularize the libraries themselves. The AMD (Asynchronous Module Definition) standard defines the way that a library is loaded as a module - as opposite to a global object, and that module is available for only the other module that \"requires\" it.

### How it works?

Let\'s say there are three companions in an AMD system: the library as a dependency, an AMD loader, and a consumer - the module that wishes to use the library. To avoid confusion, all are JavaScript. Here is how they work:

- The library defines itself as a module, by writing a function named `define`:

```javascript
   define(function(){});
```

This is one of the signatures of *define*, which has only one parameter. The parameter, often documented as *factory*, is a function that returns a global(?) object, similarly as you see in the module pattern. Picking up the \"counter\" example, the code looks like that:

```javascript
    define(function(){
        var counter = 0;
        count = function(){
            return (++counter);
        }
        return {
            count: count
        };
    });
```

- The returned object will be global if you declare the library as an external script file, that is not AMD. In AMD, you \"register\" the library with the loader. The returned object then is wrapped under a new scope (so it is not global actually) created by the loader. As indicated by AMD specification, the scope is named `require`.
  RequireJS - an AMD implementation - defines the alias `requirejs`, both are the same object.
  The only way for the consumer to access the library is via the `require()` function given by the loader:
  
  ```javascript
        require(["dependency1"], function("dependency1"){
            // here is your code that "consume" the dependency1
        });
  ```

  Next, you will learn it via examples with RequireJS and jQuery.

### RequireJS

RequireJS is an AMD loader. To download it, check out [Get RequireJS](http://requirejs.org/docs/start.html#get) page.

As said, you do not declare a library directly in script tags, but register it to the loader instead. How registration is done depends on the loader. Here you write an example of RequireJS in which you use jQuery and one module of your own.

::: tip

The code sample can be found at [eXo Samples repository](https://github.com/exo-samples/docs-samples/tree/master/js/requirejs).
:::

It is built up from the previous example. Now \"count\" function is wrapped into an AMD module, called `util`. The consumer is `my.js` that contains onclick function. The html file simply gives a button to test the function.

Look at the html file first:

``` html
<!DOCTYPE html>
<meta charset="utf-8" />
<html>
<head>
<script data-main="js/my" src="js/require.js"></script>
</head>
<body>
    <p>You've clicked <span id="result">0</span> times.</p>
    <button onclick="myClick();">Click me</button>
</body>
</html>
```

So here it is RequireJS that is loaded in script tag. `my.js` is not loaded traditionally, instead it is the *data-main* source of RequireJS. `my.js` registers the dependencies by calling `require.config({...})`:

``` JavaScript
require.config({
    baseUrl: "js",
    paths: {
        jquery: "jquery-3.2.1",
        util: "util"
    }
});
```

This is a conventional configuration of RequireJS. You may omit the configuration for \"util\", because RequireJS can auto-load scripts that are located right under the baseUrl directory. In that case the module name will be the file name without extension.

The `util.js` module is re-written from the \"count\" example. You define an anonymous AMD module:

``` JavaScript
define(function(){
    var counter = 0;
    var count = function(){
        if (counter > 10) {
            alert("Stop! You're too excited!");
        }
        return (++counter);
    }
    return {
        count: count
    };
});
```

JQuery accompanies AMD specification, though it also produces global variables. The following code is much more than a define() function, because it tries detecting if there is an AMD loader.

``` JavaScript
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
}
```

The last gap is how the consumer uses the libararies. In `my.js`:

``` JavaScript
function myClick(){
    require(["util", "jquery"], function(util, $){
        $("#result").text(util.count());
    });
}
```

Next, you will learn how to use non-AMD libraries with RequireJS.

::: tip

- References

This tutorial helps you understand the gist of JavaScript modularity, by walking through the patterns from basic to advance. It does not cover everything, indeed it avoids explaining a lot of things. So do not limit yourself. Go ahead and read other references.
At this point you should read:

- [AMD Specification](https://github.com/amdjs/amdjs-api/wiki/AMD)
- [RequireJS Usage](http://requirejs.org/docs/api.html#usage)
:::

## Shim configuration and Non-AMD modules

In this section you learn uses of shim configuration. Basically shim configuration is something you add in *requirejs.config()* when you need:

- Synchronous dependencies loading.
- Non-AMD libraries.

RequireJS documentation introduces shim configuration in [one example](http://requirejs.org/docs/api.html#config-shim). Here it breaks into three simpler samples: deps, exports and init.

### Synchronous dependencies loading

Remember \"A\" in AMD stands for \"Asynchronous\"? It aims at optimizing performance. However when you need two libraries and one of them depends on the other, you use shim **deps** configuration to load them in order.

``` JavaScript
require.config({
    baseUrl: "js",
    paths: {
        jquery: "jquery-3.2.1",
        util: "util"
    },
    shim: {
        // util depends on jquery.
        // util is non-AMD.
        "util": {
            deps: ["jquery"]
        }
    }
});
```

The idea is as simple as you see it. Only one thing that needs
explanation: \"util\" in this example is non-AMD, because shim will not
work on AMD libraries. If \"util\" complies AMD, it should declare its
dependencies using this form of define():

``` JavaScript
define(["jquery"], function(jquery){...});
```

## Non-AMD with exports

With the following shim configuration, the `util` module will hold a local (in require scope) reference to the global `count` variable.

``` JavaScript
shim: {
    "util": {
        exports: "count"
    }
}
```

To see it in action, let\'s modify [the previous example](https://github.com/exo-samples/docs-samples/tree/master/js) to make \"util\" a non-AMD module.

1. Edit `util.js` to be a closure which declares a global variable:

   ``` JavaScript
    (function (){
        var counter = 0;
        // count is global
        count = function(){
            return ++counter;
        };
    })();
   ```

2. In `my.js`, \"count\" is exported and referenced by the name \"util\", in the scope of \"require\":

    ``` JavaScript
     require.config({
        baseUrl: "js",
        paths: {
            jquery: "jquery-3.2.1",
            util: "util"
        },
        shim: {
            "util": {
                exports: "count"
            }
        }
    });
    
    function myClick(){
        require(["util", "jquery"], function(util, $){
           $("#result").text(util);
        });
    }
    ```

As you may ask, the global \"count\" is still available (after require() execution finishes).

### Non-AMD with init

The init function can be used to do some tweaks with non-AMD library, for example to remove a global variable.

The simplest use of init function can be considered as an alternative of exports. In the below example, you return \"count\" in init function, it is equivalent to exporting \"count\".

``` JavaScript
  require.config({
    baseUrl: "js",
    paths: {
        jquery: "jquery-3.2.1",
        util: "util"
    },
    shim: {
        "util": {
            //exports: "count"
            init: function() {
                return count;
            }
        }
    }
  });
```

If you need to use dependencies in init function, write it with parameters as below:

``` JavaScript
require.config({
    baseUrl: "js",
    paths: {
        jquery: "jquery-3.2.1",
        util: "util"
    },
    shim: {
        "util": {
            deps: ["jquery"],
            init: function (jquery) {
                //
            }
        }
    }
});
```

::: tip

- References

This section explains uses of shim configuration and how Non-AMD modules can be used with RequireJS. Please do not miss the important notes in RequireJS documentation:

- [Shim configuration](http://requirejs.org/docs/api.html#config-shim)
:::

## GateIn Module Definition

As you understood the module pattern explained in previous sections, now you are convinced to stick with it when developing in eXo Platform. The Platform is built on top of GateIn that introduces the GMD as a standard for writing and packaging JavaScript modules as portal resources.

### The counter example as a portlet

For easily starting with GMD (GateIn Module Definition), you will turn the single html page in \"counter\" example into a portlet.

::: tip

Please get the source code at [eXo Samples Repository](https://github.com/exo-samples/docs-samples/tree/master/js/counter-portlet).
:::

Though you still can write inline scripts into your portlet JSP, in this example you turn all into modules, so the first thing is to re-write `my.js`. In the single html example it was:

``` JavaScript
require.config({
    baseUrl: "js",
    paths: {
        jquery: "jquery-3.2.1",
        util: "util"
    }
});

function myClick(){
    require(["util", "jquery"], function(util, $){
        $("#result").text(util.count());
    });
}
```

The *require.config()* will be replaced by GMD configuration (later in `gatein-resources.xml`). Wrap any other code in a closure:

``` JavaScript
(function(util, $){
    $(document).ready(function(){
        $("body").on("click", ".counter-portlet button", function(){
            $("#result").text(util.count());
        });
    });
})(util, jq);
```

It changes much because you no longer write a global named function (myClick) and attach it to a button directly in HTML. Instead you use jQuery and a CSS selector. The selector should point to the right HTML element that you write in your portlet template, in this example it is `counter.jsp`:

``` JSP
<div class='counter-portlet'>
    <h2>The Counter Portlet</h2>
    <p>You've clicked <span id="result">0</span> times.</p>
    <button>Click me</button>
</div>
```

The last thing is to declare your GMD modules. It is done in `gatein-resources.xml`:

``` xml
<gatein-resources xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.gatein.org/xml/ns/gatein_resources_1_3 http://www.gatein.org/xml/ns/gatein_resources_1_3"
xmlns="http://www.gatein.org/xml/ns/gatein_resources_1_3">
    <module>
        <name>util</name>
        <script>
            <path>/js/util.js</path>
        </script>
    </module>
    <portlet>
        <name>Counter</name>
        <module>
            <script>
                <path>/js/my.js</path>
            </script>
            <depends>
                <module>jquery</module>
                <as>jq</as>
            </depends>
            <depends>
                <module>util</module>
            </depends>
        </module>
    </portlet>
</gatein-resources>
```

The both dependencies - jQuery and util - are AMD modules. Simply declare \"util\" as a shared module. There is already a shared module named \"jquery\", and its version does not matter for now, so you use it without packaging a jQuery file. You do not need to package `require.js` too.

Now you can build, deploy and test the counter portlet before you look deeper into GMD.

### Understanding GMD

So what happens to your modules then?

First, your js files are treated as GateIn **resources**, that means GateIn manages their lifecycle. They are deployed to the server, thus they are available all the time, but only loaded in the pages that use them.

To a JS resource, basically GateIn tweaks it into AMD modules, deploys it then loads it in the right pages. Here you see what happens to the `my.js` module:

1. The code is wrapped in an AMD define():

   ``` JavaScript
    define('PORTLET/counter-portlet/Counter', ["SHARED/jquery","SHARED/util"], function(jq,util) {
        var require = eXo.require, requirejs = eXo.require,define = eXo.define;
        eXo.define.names=["jq","util"];
        eXo.define.deps=[jq,util];
        return (function(util, $){
            $(document).ready(function(){
                $("body").on("click", ".counter-portlet button", function(){
                    $("#result").text(util.count());
                });
            });
        })(util, jq);
    });
   ```

   It is a normal AMD named module. The AMD name is formed with scope (PORTLET), the name of the app where the resource is registered (counter-portlet) and the module name configured in `gatein-resources.xml` (Counter).

2. The module then is minified and deployed as a web resource that can be accessed by a URL like this:

   http://localhost:8080/portal/scripts/4.3.0/PORTLET/counter-portlet:COUNTER-min.js

   It mimics the following RequireJS paths configuration:

   ```json
    baseUrl: "http://localhost:8080",
    paths: {
        "PORTLET/counter-portlet/Counter": "/portal/scripts/4.3.0/PORTLET/counter-portlet:COUNTER-min"
    }
   ```

   The minified version is the one that takes effect, but you can view the unminified version by eliminating the \"-min\" part in the URL.

3. Finally in the pages that contain your portlet, the modules (name and path) are added to the \"require\" object. This is a page object defined by eXo.

   ``` html
   <html>
      <head>
        <script type="text/javascript">
          var require = {
              "shim":     {...},
              "paths":    {...
                  "SHARED/util": "/portal/scripts/4.3.0/SHARED/util-min",
                  "PORTLET/counter-portlet/Counter": "/portal/scripts/4.3.0/PORTLET/counter-portlet:Counter-min",
              ...}
          };
      </script>
      </head>
    </html>
    ```

### GMD and Non-AMD libraries

Now assume the library util is not compatible with AMD. For example, it is the following plain old JavaScript:

``` JavaScript
  var counter = 0;
  var count = function(){
      return (++counter);
  }
```

You will use the **adapter** script in `gatein-resources.xml` configuration to make its AMD compatible:

``` xml
<module>
    <name>util</name>
    <script>
        <adapter>
            (function() {
                <include>/js/util.js</include>
                return {
                    count: count
                };
            })();
        </adapter>
    </script>
</module>
```

This adapter code wraps the original script (pay attention to **include** tag) in a closure, and returns the function count() that will be accessed by util.count(). The final code that is loaded in the page will be:

``` JavaScript
define('SHARED/util', [], function() {
    var require = eXo.require, requirejs = eXo.require,define = eXo.define;
    eXo.define.names=[];
    eXo.define.deps=[];
    return (function() {
        var counter = 0;
        var count = function(){
            return (++counter);
        }
        return {
            count: count
        };
    })();
});
```

## JQuery versions and plugins

Because of JQuery\'s popularity, it is necessary to have this guideline that helps you use JQuery safely, especially if its versions and extensions matter to your application.

### The built-in SHARED module jquery

As in the counter portlet example, you can use the default \"jquery\" shared module. It is packaged and declared in `eXoResources.war`.

``` xml
<module>
    <name>jquery</name>
    <as>$</as>
    <script>
        <adapter>
            (function() {
            <include>/javascript/jquery-3.2.1.js</include>
            return jQuery.noConflict(true);
            })();
        </adapter>
    </script>
</module>
```

So the version is 3.2.1 at the time this document is written. To check it in your eXo instance, use this URL when PRODUCT PLF_VERSION is starting locally:

```html
    http://localhost:8080/portal/scripts/5.0.0/SHARED/jquery.js
```

N.B: The URL cited above is for a 5.0.0 PRODUCT instance, you should replace it by the correct version of your server.

### Using a different version of JQuery

In case you want to use a different version of JQuery, for example 1.8.3, declare it as a GMD module with another name than \"jquery\".

```xml
    <module>
        <name>jquery-1.8.3</name>
        <script>
            <adapter>
                (function() {
                <include>/js/jquery-1.8.3.js</include>
                return jQuery.noConflict(true);
                })();
            </adapter>
        </script>
    </module>
```

### Using JQuery plugins

Using JQuery plugins/extensions probably causes conflict over global variables. The problems vary, but usually you can deal with it by using GMD adapter pattern. A simple and useful method is to save the current global one at first and restore it at last. Here is an example:

``` xml
<module>
    <name>bootstrap_tooltip</name>
    <script>
        <adapter>
            (function() {
            var oldJQuery = window.jQuery;
            window.jQuery = $;
            <include>/WEB-INF/classes/org/exoplatform/task/management/assets/javascripts/bootstrap/bootstrap-tooltip.js</include>
            window.jQuery = oldJQuery;
            return $;
            })();
        </adapter>
    </script>
    <depends>
        <module>jquery</module>
    </depends>
</module>
```

See some other examples in [Task Management Addon project](https://github.com/exo-addons/task/blob/develop/task-management/src/main/webapp/WEB-INF/gatein-resources.xml).

## Adding JavaScript to your site

eXo Platform comes with some very powerful JavaScript management capabilities. You can easily control how your own JavaScript files are included in your site\'s pages and manage their dependencies.

Most of these capabilities can be done with some declarations in the `gatein-resources.xml` file of your extension.

### Adding JavaScript to all pages of a site

This usecase is used when you want to add JavaScript to all pages of a site named \"my-site\":

``` xml
<portal>
    <name>my-site</name>
    <module>
        <script>
            <path>/bar.js</path>
        </script>
    </module>
</portal>
```

### Adding JavaScript to a page when its portlet is displayed

This usecase is used when you want to add JavaScript to a portlet named \"my-portlet\".

``` xml
<portlet>
    <name>my-portlet</name>
    <module>
        <script>
            <path>/bar.js</path>
        </script>
    </module>
</portlet>
```

### JavaScript modules

The eXo Platform JavaScript improvements are built on top of the notion of JavaScript module. JavaScript does not provide a natural way for namespacing and the notion of module was designed to solve this problem. Namespacing can be perceived as a natural lack, however this lack should be seen as an advantage as modules provide more and more namespacing. Indeed, the module pattern allows creating and resolving dependencies between modules at runtime on demand and loading JavaScript resources in parallel.

The notion of module can be viewed as:

- An identifier or name.
- A list of dependencies on the modules required to work properly.
- The code packaged is usually expressed as a self-executing function. The product, which is an object produced by the module, is usually consumed by other modules.

  At runtime, the dependency system defines a graph of function to execute that makes the product of each module be injected in the other modules. It can be seen as a simple dependency injection system which can load modules in an asynchronous and parallel fashion providing parallel loading, namespacing and dependency management.
  When adding JavaScript to your site, you need to consider the following specific usecases:

- `Declaring an eXo Platform module`
- `Declaring an AMD module`
- `Using eXo Platform jQuery module`
- `Using a custom jQuery version`
- `Configuring jQuery plugins`
- `Exposing version of jQuery globally`
- `Implementing a global jQuery plugin`
- `Using CommonJS modules`
- `Using Mustache.js module`
- `Using Text.js module`
- `Overriding the dependency of a native AMD module`
- `Accessing a module from a script`
- `Disabling minification`

#### Declaring an eXo Platform module

This part takes the [Highlight.js](http://softwaremaniacs.org/soft/highlight/en/) library as an example to show you how to declare an eXo Platform module. This library is actually a `jQuery` plugin which follows the self-invoking pattern that consumes the `jquery` dependency as \$. Here is an overview of the `Highlight.js` source:

``` JavaScript
  (function($) {
          ...
  }(jQuery)
```

Assume that you have added it to the `javascript` folder in your extension, and now declare this module using the XML declaration in `/WEB-INF/gatein-resources.xml` as follows:

``` xml
<module>
  <name>highlight</name>
  <script>
    <path>/javascript/highlight/highlight.js</path>
  </script>
  <depends>
    <module>jquery</module>
    <as>jQuery</as>
  </depends>
</module>
```

The module is named `highlight` and uses the `/javascript/highlight/highlight.js` source code bundled in the `war` file.

The `depends` tag creates a dependency on the `jquery` module. The dependency is aliased as jQuery using the `as` tag to match the \$ argument of the `Highlight.js` self-executing function. Refer [here](#PLFDevGuide.Site.Features.JavaScript.UsingeXoPlatformjQueryModule) to check which jQuery versions are provided in eXo Platform.

#### Declaring an AMD module

eXo Platform is capable of integrating native AMD (Asynchronous Module Definition) modules, and eXo Platform modules are currently translated into AMD modules. To further understand the AMD declaration, see the [RequireJS](http://requirejs.org/docs/api.html#define) documentation.

AMD modules follow the pattern as below:

``` JavaScript
define("module", ["dependency1",...,"dependencyN"],
 function(dep1,...,depN) {
});
```

eXo Platform can use such a module out of the box, however some parts will be overridden by the declaration in `gatein-resources.xml`:

- The \"`module`\" name will be ignored and replaced with the declared module name. The module dependencies from \"`dependency1`\" to \"`dependencyN`\" have to be declared with the same name in `gatein-resources.xml`.
- Assuming that the dependencies from `dependency1` to `dependencyN` have been declared in XML, such module definition can be declared with the following XML:

    ``` xml
    <module>
      <name>MyModule</name>
      ...
      <depends>
        <module>dependency1</module>
      </depends>
      ...
      <depends>
        <module>dependencyN</module>
      </depends>
    </module>
    ```

#### Using eXo Platform jQuery module

eXo Platform provides the jQuery library 3.2.1 as a jquery module, the configuration of this module can be found in the `eXoResources.war` file. To reuse this jQuery version, just declare a dependency over it:

``` xml
<portlet>
  <name>RequireJSPortlet</name>
  <module>
    <depends>
      <module>jquery</module>
    </depends>
</portlet>
```

The default `jquery` module alias is \$, so if you are using it, it should be named \$ in the self-executing function:

If your library uses a different name, such as jQuery, the XML `as` tag should be used:

``` xml
<portlet>
  <name>RequireJSPortlet</name>
  <module>
    <depends>
      <module>jquery</module>
      <as>jQuery</as>
    </depends>
</portlet>
```

With the following self-executing function:

``` JavaScript
(function($) {
    ...
}(jQuery)
```

#### Using a custom jQuery version

If you are not satisfied with the jQuery version provided by eXo Platform, you can integrate your desired version. It is common that products built over eXo Platform depend on the third party JavaScript frameworks depending on other versions of jQuery libraries, so deploying other jQuery libraries is unavoidable at some points. Multiple jQuery instances within a web page conflict with global variables, however the module system allows you to use such a library with no hassles.

The following example is about a jQueryPortlet using jQuery version 1.6.4, which is configured properly:

``` xml
<module>
  <name>jquery-1.6.4</name>
  <script>
    <adapter>
(function() {
  <include>/javascript/jquery-1.6.4.js</include>
  return jQuery.noConflict(true);
})();
    </adapter>
  </script>
</module>
<portlet>
    <name>jQueryPortlet</name>
        <module>
            <script>
                <path>/javascript/MyJSFile.js</path>
                ...
            </script>
            <depends>
                <module>jquery-1.6.4</module>
                <as>$</as>
            </depends>
        </module>
</portlet>
```

::: tip

Return to the beginning part of the`Adding JavaScript to your site` section to learn about use of JavaScript in eXo Platform.
:::

#### Configuring jQuery plugins

This section shows you how to configure a jQuery plugin and how to use it in the `jQueryPluginPortlet` portlet.

1. Use the jQuery plugin as a minimal one:

    ``` javascript
    (function($) {
     $.fn.doesPluginWork = function() {
        alert('YES, it works!');
     };
    })(jQuery);
    ```

2. Declare it as a module:

    ``` xml
    <module>
      <name>jquery-plugin</name>
      <as>jqPlugin</as>
      <script>
        <path>/jqueryPlugin/jquery-plugin.js</path>
      </script>
      <depends>
        <module>jquery</module>
        <as>jQuery</as>
      </depends>
    </module>
    ```

3. Use this plugin in your portlet:

    ``` xml
    <portlet>
      <name>jQueryPluginPortlet</name>
      <module>
        <script>
          <path>/jqueryPlugin/jqueryPluginPortlet.js</path>
        </script>
        <depends>
          <module>jquery</module>
          <as>$</as>
        </depends>
        <depends>
          <module>jquery-plugin</module>
        </depends>
      </module>
    </portlet>
    ```

::: tip

Your portlet module should depend on the jquery and you need to declare:

- The dependency on `jquery` that allows using the jQuery object.
- The dependency on `jquery-plugin` that ensures the plugin to be loaded in the `jquery` dependency before it is injected in the portlet module.
:::

#### Exposing version of jQuery globally

The built-in jQuery is currently declared as an AMD module. By default, jQuery will not be available in the window object of the browser. This section shows how to make jQuery available so you can write a code like in a plain script.

The following script will make jQuery available by mounting the jQuery object in the window object:

```javascript
    require( ["SHARED/jquery"], function($) {
      // the '$' in window.$ is alias, you can make the other for yourself.
      window.$ = $;
    });
```

This script must be integrated as a shared script:

``` xml
<scripts>
  <name>imediatejs</name>
  <script>
    <path>/myfolder/imediateJScript.js</path>
  </script>
</scripts>
```

A portlet can then provide its own script on which it depends:

``` xml
<portlet>
  <name>foo</name>
  <script>
    <name>portletjs</name>
    <path>/myfolder/portlet.js</path>
  </script>
  <depends>
    <scripts>imediatejs</scripts>
  </depends>
</scripts>
```

With the following JavaScript:

```javascript
    $("#foo").html("<h1>hello global jQuery</h1>");
```

#### Implementing a global jQuery plugin

There are a few ways to implement the usage of a global jQuery plugin.However, make sure that the global jQuery is available before the global jQuery plugin is loaded.

As you have seen before how you can scope a module to a portlet, the module will be loaded when the portlet is on a page using the `PORTLET` scope. Accordingly, use the `PORTAL` scrope instead of `PORTLET`. The main difference is that the loading of your plugin will be triggered on a specific site instead of a specific portlet.

1. Create the `jQuery` plugin as a script named `myPlugin.js` and integrate it to your plugin:

    ```javascript
            require(["SHARED/jquery"], function($) {
              $.fn.myPluginFunction = function() {
                // Your work here;
              };
            });
    ```

2. Bind the script in the site and reuse the `immediatejs` script seen before:

    ``` xml
    <portal>
      <name>classic</name>
      <scripts>
        <script>
          <name>myPlugin</name>
          <path>/myfolder/myPlugin.js</path>
        </script>
        <script>
          <name>imediatejs</name>
          <path>/myfolder/imediateJScript.js</path>
        </script>
      </scripts>
    </portal>
    ```

3. Now, your plugin is globally available and you can use it:
  
  ```javascript
    <script type="text/javascript">
    $('#foo').myPluginFunction();
    </script>
  ```

#### Using CommonJS modules

CommonJS defines its [own module format](http://wiki.commonjs.org/wiki/Modules/1.1), although it is not supported by eXo Platform. The adapter format can be used to adapt CommonJS modules to work well in eXo Platform.

Here are two simple CommonJS modules:

- `math.js`

    ``` javascript
    exports.add = function() {
      var sum = 0, i = 0, args = arguments, l = args.length;
      while (i < l) {
        sum += args[i++];
      }
      return sum;
    };
    ```

- `increment.js`

    ``` javascript
    var add = require('math').add;
    exports.inc = function(val) {
      return add(val, 1);
    };
    ```

CommonJS modules use their required function which conflicts with the RequireJS same function. So, to make it work in the AMD enabled environment, these modules need to be wrapped and injected predefined modules: `require`, `exports` and `module` provided by Requirejs (See the details [here](http://requirejs.org/docs/commonjs.html)). eXo Platform will wrap the code basing on the configuration using the adapter format:

``` xml
<module>
  <name>math</name>
  <script>
    <adapter>
      define(["require", "exports"], function(require, exports) {
      <include>/commonjs/math.js</include>
      });
    </adapter>
  </script>
  <depends>
    <module>require</module>
  </depends>
  <depends>
    <module>exports</module>
  </depends>
</module>
<module>
  <name>increment</name>
  <script>
    <adapter>
      define(["require", "exports", "math"], function(require, exports) {
      <include>/commonjs/increment.js</include>
      });
    </adapter>
  </script>
  <depends>
    <module>require</module>
  </depends>
  <depends>
    <module>exports</module>
  </depends>
  <depends>
    <module>math</module>
  </depends>
</module>
```

#### Using Mustache.js module

[Mustache.js](https://github.com/janl/mustache.js) is a popular JavaScript template engine. Mustache is written to be executed in several kinds of environment as a global object, a CommonJS module, or as a native AMD module. If the \"`module`\", \"`exports`\" dependencies are available, Mustache will register it as a CommonJS module. It can be adapted to eXo Platform thanks to the adapter format:

``` xml
<module>
  <name>mustache</name>
  <script>
    <adapter>
define(["require", "exports", "module"], function(require, exports, module) {
  <include>/requirejs/js/plugins/mustache.js</include>
});
    </adapter>
  </script>
  <depends>
    <module>require</module>
  </depends>
  <depends>
    <module>exports</module>
  </depends>
  <depends>
    <module>module</module>
  </depends>
</module>
```

Use the `adapter` tag here and declare the `require`, `exports` and `module` dependencies of the `CommonJS` module. Now any module can have Mustache instance injected just by declaring it in its dependencies list:

``` xml
<module>
  <name>foo</name>
  ...
  <depends>
    <module>mustache</module>
  </depends>
</module>
```

``` javascript
(function(mustache){
//code that use Mustache
mustache.render(template);
})(mustache);
```

#### Using Text.js module

`RequireJS` supports the loader plugin which enables a module to be a plugin and uses the AMD system to load web resources in an efficient manner.

When there are many templates or the template has a large size, embedding template in the page is not a good choice for front-end performance reason. It would be better to use `Text.js` to load the separate template files and inject them as dependencies.

`Text.js` which is a native AMD module also depends on the module dependency predefined by the AMD loader. Thanks to the native AMD support of eXo Platform, it is straightforward to declare and use `Text.js` in eXo Platform:

``` xml
<module>
  <name>text</name>
  <script>
    <path>/requirejs/js/plugins/text.js</path>
  </script>
  <depends>
    <module>module</module>
  </depends>
</module>
```

Now you can use the mustache and text modules to load templates and render them in your own module:

``` xml
<portlet>
  <name>foo</name>
  <module>
    ...
    <depends>
      <module>mustache</module>
    </depends>
    <depends>
      <module>text</module>
      <as>tmpl</as>
      <resource>/path/to/template.html</resource>
    </depends>
  </module>
</portlet>
```

You have the text module in the dependency list with a `<resource>` tag, `Text.js` will load that resource template and inject it with the `tmpl` name. Here is the JavaScript of the portlet:

```javascript
    function(mustache, tmpl) {
      var html = mustache.render(tmpl);
      //append rendered html to DOM
    })(mustache, tmpl);
```

#### Overriding the dependency of a native AMD module

While declaring a native AMD module, the module dependency names must match with the AMD dependencies declared in the `define` function arguments. When there is a mismatch between a module declared in the native module and the module  system of eXo Platform, the `as` tag can be used to rename the dependencies.

There is a `foo.js` file defining an AMD module named `foo` with two dependencies `["dep1", "dep2"]` as follows:

```javascript
    define("foo", ["dep1", "dep2"], function(a1, a2) {
    // The module
    });
```

Supposing that the dependencies are declared as `module1` and `module2` in eXo Platform and the names do not match. To override them, use the `as` tag to rename the dependencies:

``` xml
<module>
  <name>foo</name>
  <script>
    <path>/path/to/foo.js</path>
  </script>
  <depends>
    <module>module1</module>
    <as>dep1</as>
  </depends>
 <depends>
   <module>module2</module>
   <as>dep2</as>
 </depends>
</module>
```

#### Accessing a module from a script

Sometimes it is required to access a module from a script, RequireJS provides such capability by using the `require` function to execute a function in the managed context:

```javascript
    require(["SHARED/ModuleA"], function(a) {
      // Codes of interacting with module A
      a.doSomething();
    });
```

In such a situation, you need to use the AMD module name of the module on which you need to depend, this case uses `PORTLET/ModuleA`. The prefix in uppercase is the module scope among `SHARED`, `PORTLET` and `PORTAL`.

#### Disabling minification

In eXo Platform, Javascript scripts declared as modules are minified by default in order to reduce their size and therefore the data volume when downloaded in web page.

This minification may lead to conflicts and errors when the script is incompatible with eXo Platform minifier (Google Closure Compiler).

The minification can be disabled with the new module attribute \'minify\' :

```javascript
    <minify>false</minify>
```

This option could be set in `gatein-resources.xml` in script tag:

```javscript
    <module>
        <name>myModule</name>
         <script>
         <path>/javascript/myScript.js</path>
         <minify>false</minify>
         </script>
    </module>
```

::: tip

We highly recommend to always enable scripts minification. If you have conflicts, take care to not deactivate minification in the whole platform.
:::

To use this new option, the new [XSD 1.4](www.exoplatform.org/xml/ns/gatein_resources_1_4) should be used.
