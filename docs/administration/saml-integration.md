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

### 1. Install SAML2 add-on with the command:

```bash
$PLATFORM_SP/addon install exo-saml
```

### 2. Open the file `$PLATFORM_SP/gatein/conf/exo.properties`.

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
gatein.sso.sp.alias=SP_SIGNING_ALIAS
gatein.sso.sp.signingkeypass=SP_SIGNING_KEY_PASS
gatein.sso.picketlink.keystorepass=SP_KEYSTORE_PASS
# WARNING: This bundled keystore is only for testing purposes. You should generate and use your own keystore!
gatein.sso.picketlink.keystore=${exo.conf.dir}/saml2/jbid_test_keystore.jks
```

You need to modify **gatein.sso.idp.host**, **gatein.sso.idp.url**, **gatein.sso.idp.url.logout**, **gatein.sso.idp.alias**, **gatein.sso.sp.alias**, **gatein.sso.sp.signingkeypass** and **gatein.sso.picketlink.keystorepass** according to your environment setup. You also need to install your own keystore as instructed in [Generating and using your own keystore](#generating-and-using-your-own-keystore).

::: tip
If your IDP send username in assertion with some char in capital letter, and you want to force lower case, you can add this property :

```properties
gatein.sso.saml.username.forcelowercase=true
```
::: 

### 3. Download and import your generated IDP certificate to your keystore

The certificate provided here is the public key provided by the IDP. This certificate will allow to verify signature of assertions coming from the IDP. 

In addition, if the IDP is configured to encrypt assertions, this certificate will be used to decrypt it.

```bash
keytool -import -keystore jbid_test_keystore.jks -file idp-certificate.crt -alias Identity_Provider-idp -storetype JKS
```
::: tip
The Default password of the keystore jbid\_test\_keystore.jks is **store123**.
:::

::: warning
For production environment, ensure to create a new keystore, with a more robust password. Ensure to save the keystore password
:::

### 4.  Create a couple private key/public key and add it to the keystore

To be able to sign assertions, you will need to create a private key and a public key, and add it to the keystore.

#### 4.1. Create private key and certificate :
```bash
openssl req -newkey rsa:4096 -keyout private.key -x509 -days 365 -out certificate.crt
```

#### 4.2. Transform certificate and private key in p12 file :
```bash
openssl pkcs12 -export -out certificate.p12 -inkey private.key -in certificate.crt
```

#### 4.3. Add p12 file in jks store

```bash
keytool -v -importkeystore -srckeystore certificate.p12 -srcstoretype PKCS12 -destkeystore jbid_test_keystore.jks -deststoretype JKS -destalias sp_alias -srcalias 1
```

You will be asked to enter the *keystore password* and a *key password* for the private key.
Remember them to use in next steps.
This command create a couple (publicKey, privateKey). 
This couple is added is the keystore with alias *sp_alias* (you can change it)

During IDP configuration, you can provide the publicKey to the IDP, which will use is to validate assertion signature if the feature is activated on IDP side.

::: tip 
In the command, srcalias indicate which alias from the P12 keystore we want to import in the JKS keystore. The P12 keystore can contains more than one key. As we just create it, we know that the alias we want is the first one.
:::

#### 4.4. Update properties
Change these properties :

```properties
gatein.sso.sp.signingkeypass=*key password*
gatein.sso.picketlink.keystorepass=*keystore password*
gatein.sso.sp.alias=sp_alias
```

#### 4.5. Provide SP public key to IDP
On IDP side, to be able to validate assertion signature, you will need to provide the SP public key, create in point 4.1

The process to store the public key will vary in function of your IDP.


### 5. Start up the platform: use the following command on Linux operating systems:
```bash
./start_eXo.sh
```

and use this command for Windows operating systems:
```bash
start_eXo.bat
```

## Use Another signature algotihm
To sign assertion, we use RSA256 by default.
If you want to change this, you can update theses properties :

```properties
gatein.sso.sp.sign.method=http://www.w3.org/2001/04/xmldsig-more#rsa-sha256
gatein.sso.sp.sign.digest=http://www.w3.org/2001/04/xmlenc#sha256
```

List of Signature Methods can be found in javax.xml.crypto.dsig.SignatureMethod.

List of Digest Methods can be found in javax.xml.crypto.dsig.DigestMethod.

## Use Encrypted Assertions

To increase security, IDP can be configured to encrypt assertions, it is an option to activate. The IDP will use his private key to encrypt, and the SP will use the IDP public key to decrypt.

As we already have the IDP public key in the keystore, the assertion decryption should work directly

## Configure NameId Format in SAMLRequest

The property `gatein.sso.saml.nameid.format` allow to configure the wanted nameid format. By dafault, value is `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`. It can be changed to `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified` if needed

## Use assertion with persistent or transient nameid
Some IDP requires that nameid contains a unique identifier, which will not change during this. 
In this case, we need that IDP provide the user name or the email in another assertion attribute.

- On IDP side, configure the Client scope to provide username or email in an attribute of the assertion. Note the name of the attribute, for example `uid`.
- on eXo side, set the property `gatein.sso.saml.use.namedid=false` and `gatein.sso.saml.subject.attribute` to the name of the attribute you want to use. For example, if you set `gatein.sso.saml.subject.attribute=uid`, eXo will use the value of the `uid` attribute in the assertion as username.

::: tip 

The user can be identified by his username or by his email.
:::
