# Introduction

## About this documentation
This documentation is the starting point for developers looking to start a project with eXo Platform. It describes how to run eXo locally, how to sep up a developer environment and start developing with eXo. It also documents eXo Platform extension points, APIs and more.

The documentation focuses primarily on developers. **Administrator and User guides** are packaged within the platform. eXo platform **website**, resource center and **blog** also provide end-user oriented content about the product.

## About eXo Platform
<img src="/img/introduction/about-exo.png" width="400" height="400" style="margin:60px" align="left">

eXo Platform is a **digital workplace platform**, providing a number of interconnected features and tools :
- facilitating internal communications
- collaboration and remote work
- knowledge management
- employee productivity and recognition.

The platform allows to create **modern intranets, social networks, community management** platforms, **collaboration platforms** and employee centered **digital workplaces**.

Moreover, the platform is a great way to organize and **centralize** your **employee tools** in one place, thanks to its existing connectors, its many **API REST** exposed services and the use of modern frameworks.  

<br clear="both"/>

## Licencing
eXo Platform is distributed under two editions - **eXo Platform CE** (**community** edition) and **eXo Platform EE** (**enterprise** edition). The present documentation applies to both editions.

eXo Platform Community Edition is distributed for free, under the open source **AGPL license**.
eXo Platform Enterprise Edition is distributed under a **commercial license**, using a **subscription** model.

In terms of product functionalities, both editions are based on **the same core** and include the **same features**.
There are however a few **notable exceptions** :
- **Connectors to paid third party software** (Microsoft, Google) are excluded from the community edition
- **OnlyOffice** and **Jitsi** modules are not distributed with the community edition. However, connectors are included and can be used to package open source versions of those tools
- **Advanced administration** and **security** features are excluded from the community edition
Moreover, eXo Platform CE does not benefit from professional grade **support** and **maintenance** programs, included in the subscription, nor from our enterprise **on demand services**.

## Third-Party Software
eXo Platform includes several third party open-source modules to power up some user facing features. In particular these features are based on integrations with third party tools  :
- eXo Platform **unified search** module is based on Elastic Search
- eXo **Chat** module on MongoDB
- eXo **videoconferencing** is based on Jitsi
- eXo **co-editing** is based on OnlyOffice
Regarding Jitsi and OnlyOffice, those tools are distributed under their own licensing conditions. Depending on the edition, open-source licensing or commercial licensing may apply. For that reason, we do not package and distribute them with the eXo Platform CE.

However, connectors developed for eXo Platform EE (which packages both OnlyOffice and Jitsi) can be used to package open-source distributions of those tools. In this documentation, we include a guide as to how to do so (in progress).

## eXo Trial
If you want to see what eXo Platform looks like, you can check [our hosted trial](https://trial.exoplatform.org/).

The trial runs on eXo Platform Enterprise Edition. The trial is under continuous deployment and is based on the **latest version in development**.

The trial stages a **sample** environment with content examples. It is a **shared** trial - shared by multiple users. The trial also **limits** what any user can do. However, it provides a good first introduction as to what eXo Platform is and how it can be used.

The trial is **reset** regularly and ALL DATA erased permanently. 
 
