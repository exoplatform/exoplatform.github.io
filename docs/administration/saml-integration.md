# SAML Integration

SAML2 is version 2 of SAML (Security Assertion Markup Language), an XML-based standard for exchanging authentication and authorization data. The document of SAML2 Specifications is available [here](http://saml.xml.org/saml-specifications).

According to SAML2 Specifications, two parties which exchange
authentication and authorization data are called SP (Service Provider)
and IDP (Identity Provider). IDP issues the security assertion and SP
consumes it. The following scenario describes a SAML2 exchange:

1. A user, via web browser, requests a resource at the SP.
2. The SP checks and finds no security context for the request, then it
   redirects to the SSO service.
3. The browser requests the SSO service at IDP.
4. The IDP responds with an XHTML form after performing security check and
   identifying the user. The form contains SAMLResponse value.
5. The browser requests assertion consumer service at the SP.
6. The consumer service processes the SAMLResponse, creates a security
   context and redirects to the target resource.
7. The browser requests target resource again.
8. The SP finds a security context, so it returns the target resource.

![image0](/img/saml/saml-sequence.png)

eXo Platform SAML integration supports the SP role thus can be
integrated with various [IdP providers](https://en.wikipedia.org/wiki/SAML-based_products_and_services)
such as Salesforce or Shibboleth.

This chapter covers the following subjects:

-  [eXo Platform as SAML2 SP](#exo-platform-as-saml2-sp)

-  [Generating and using your own keystore](#generating-and-using-your-own-keystore)

## eXo Platform as SAML2 SP

1. Install SAML2 add-on with the command:

```bash
$PLATFORM_SP/addon install exo-saml
```

2. Open the file `$PLATFORM_SP/gatein/conf/exo.properties`.

Edit the following properties (add them if they don't exist):

```properties
# SSO
gatein.sso.enabled=true
gatein.sso.saml.sp.enabled=true
gatein.sso.callback.enabled=true
gatein.sso.valve.enabled=true
gatein.sso.valve.class=org.gatein.sso.saml.plugin.valve.ServiceProviderAuthenticator
gatein.sso.filter.login.sso.url=/portal/dologin

gatein.sso.filter.initiatelogin.enabled=false
gatein.sso.filter.logout.enabled=true
gatein.sso.filter.logout.class=org.gatein.sso.saml.plugin.filter.SAML2LogoutFilter
gatein.sso.filter.logout.url=${gatein.sso.sp.url}?GLO=true 
gatein.sso.saml.config.file=${exo.conf.dir}/saml2/picketlink-sp.xml

# Custom properties

gatein.sso.sp.host=SP_HOSTNAME
gatein.sso.sp.url=${gatein.sso.sp.host}/portal/dologin
gatein.sso.idp.host=IDP_HOSTNAME
gatein.sso.idp.url=IDP_SAML_ENDPOINT
gatein.sso.idp.url.logout=IDP_SAML_ENDPOINT_LOGOUT
gatein.sso.idp.alias=IDP_SIGNING_ALIAS
gatein.sso.idp.signingkeypass=IDP_SIGNING_KEY_PASS
gatein.sso.idp.keystorepass=IDP_KEYSTORE_PASS
# WARNING: This bundled keystore is only for testing purposes. You should generate and use your own keystore!
gatein.sso.picketlink.keystore=${exo.conf.dir}/saml2/jbid_test_keystore.jks
```

You need to modify **gatein.sso.idp.host**, **gatein.sso.idp.url**, **gatein.sso.idp.url.logout**, **gatein.sso.idp.alias**, **gatein.sso.idp.signingkeypass** and **gatein.sso.idp.keystorepass** according to your environment setup. You also need to install your own keystore as instructed in [Generating and using your own keystore](#generating-and-using-your-own-keystore).

::: tip
If your IDP send username in assertion with some char in capital letter, and you want to force lower case, you can add this property :

```properties
gatein.sso.saml.username.forcelowercase=true
```

3. Download and import your generated IDP certificate to your keystore
   using this command:

```bash
keytool -import -keystore $PLATFORM_SP/gatein/conf/saml/jbid_test_keystore.jks -file idp-certificate.crt -alias Identity_Provider-idp
```

::: tip
The Default password of the keystore jbid\_test\_keystore.jks is **store123**.

4. Start up the platform: use the following command on Linux operating systems:
```bash
./start_eXo.sh
```

and use this command for Windows operating systems:
```bash
start_eXo.bat
```



## Generating and using your own keystore

The default `jbid_test_keystore.jks` is useful for testing purpose,
but in eXo Platform you need to generate and use your own keystore as
follows:

1. Generate your file using the **keytool** command:
   
```bash
keytool -genkey -alias secure-key -keyalg RSA -keystore secure-keystore.jks
```

You will be asked to enter a *keystore password* and a *key password*. 
Remember them to use in next steps.
This command create a couple (publicKey, privateKey). During IDP configuration, you can provide the publicKey to the IDP, which will use is to encode the assertion content. 
Then, when eXo receive the assertion, it uses the privateKey present in the keystore to decode the assertion.

2. Install your file to
`PLATFORM_*/gatein/conf/saml2/` 

3. Modify picketlink configuration properties to provide your **keystore
   password** and a **key password**. In exo.properties file, change properties
```properties
gatein.sso.idp.alias=fellowtest
gatein.sso.idp.keystorepass=store123
gatein.sso.idp.signingkeypass=password
gatein.sso.picketlink.keystore=${exo.conf.dir}/saml2/jbid_test_keystore.jks
```

::: tip
On Windows, you should use the absolute link to the keystore file, for the property `gatein.sso.picketlink.keystore`.



