
[mailjet]: http://www.mailjet.com
[api_credential]: https://app.mailjet.com/account/api_keys
[api_token]: https://app.mailjet.com/sms
[eventemitter]: https://nodejs.org/api/events.html
[doc]: http://dev.mailjet.com/guides/?javascript#
[api_doc_repo]: https://github.com/mailjet/api-documentation

![alt text](https://www.mailjet.com/images/email/transac/logo_header.png "Mailjet")

[![Build Status](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs.svg?branch=master)](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs)
![Current Version](https://img.shields.io/badge/version-3.2.1-green.svg)

# Mailjet NodeJs Wrapper

Welcome to the [Mailjet][mailjet] official NodeJS API wrapper!

Check out all the resources and PHP code examples in the official [Mailjet Documentation][doc].

(Please refer to the [Mailjet Documentation Repository][api_doc_repo], in case you want to contribute to the documentation)


## Getting started

First, create a project folder:

`mkdir mailjet-project && cd $_`

### Installation

`npm install node-mailjet`

If you want to do a global installation, add the `-g` flag.

### Show me the code

To authenticate, go get your API Key and API Secret [here][api_credential]. Then open your favorite text editor and import the Mailjet module:

``` javascript

var Mailjet = require('node-mailjet').connect('api key', 'api secret');

```

Additional connection options may be specified as a third argument. The supported values are:

- `proxyUrl`: HTTP proxy URL to send the API requests through
- `timeout`: API request timeout in milliseconds
- `url` (default: `api.mailjet.com`): Base Mailjet API URL. If your account is moved to the Mailjet US architecture, you should set this to `api.us.mailjet.com` instead.
- `version`: API version to use in the URL
    - `v3` - The Email API
    - `v3.1` - Email Send API v3.1, which is the latest version of our Send API
    - `v4` - SMS API
- `perform_api_call` (default: true): controls if the must call must be performed to Mailjet API or not (dry run)

``` javascript

// The third argument (the object) is not mandatory. Each configuration key is also optional
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE, {
        url: 'api.mailjet.com', // default is the API url
        version: 'v3.1', // default is '/v3'
        perform_api_call: true // used for tests. default is true
      })
```
On top of that, you can also pass those options locally to a request:

```javascript
// the second argument (the object) is not mandatory. Each configuration key is also optional
const request = mailjet
    .post("send", {
      url: 'api.mailjet.com', version: 'v3.1', perform_api_call: false
    })
    .request({
        "Messages":[
                {
                "From": {
                        "Email": "pilot@mailjet.com",
                        "Name": "Mailjet Pilot"
                },
                "To": [
                        {
                        "Email": "passenger1@mailjet.com",
                        "Name": "passenger 1"
                        }
                ],
                "Subject": "Your email flight plan!",
                "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                "HTMLPart": "<h3>Dear passenger 1, welcome to Mailjet!</h3><br />May the delivery force be with you!"
                }
        ]
    })
```

The proxy URL is passed directly to [superagent-proxy](https://github.com/TooTallNate/superagent-proxy).

### Get cozy with Mailjet

#### Save and use your API Keys

`echo 'export MJ_APIKEY_PUBLIC=MY_API_KEY' >> ~/.zshrc`

`echo 'export MJ_APIKEY_PRIVATE=MY_API_SECRET' >> ~/.zshrc`

`source ~/.zshrc`

Replace `zshrc` with `bash_profile` if you are simply using bash. 

Then use it in your projects:

``` javascript

var apiKey = process.env.MJ_APIKEY_PUBLIC,
  apiSecret = process.env.MJ_APIKEY_PRIVATE;

```

### Store a Mailjet resource

``` javascript

// GET resource
var user = Mailjet.get('user');

// POST resource
var sender = Mailjet.post('sender');

```

### Request your resource with a callback function

``` javascript

user.request(function (error, response, body) {
  if (error)
    console.log ('Oops, something went wrong ' + response.statusCode);
  else
    console.log (body);
});

```

### Make the same request with a Promise

``` javascript

user.request()
  .then(function (result) {
    // do something with the result
    // result structure is {response: {...}, body: {...}}
  })
  .catch(function (reason) {
    // handle the rejection reason
    console.log(reason.statusCode)
  })

```

### Pass data to your requests

``` javascript

sender.request({ Email: 'mr@mailjet.com' })
  .then(handleData)
  .catch(handleError);

```

### Pass parameters as well as a callback

``` javascript

var getContacts = Mailjet.get('contact');

getContacts.request({Limit: 3}, handleContacts);

```

### Request a resource with an ID

``` javascript

getContacts.id(2).request(handleSingleContact)

````

### Request a ressource with an Action

``` javascript

var postContact = Mailjet.post('contact');

postContact.action('managemanycontacts').request({
  ContactLists: MyContactListsArray,
    Contacts: MyContactsArray,
}, handlePostResponse)

```

### Send an Email

``` javascript

var sendEmail = Mailjet.post('send', {'version': 'v3.1'});

var emailData = {
    "Messages":[{
        "From": {
            "Email": "pilot@mailjet.com",
            "Name": "Mailjet Pilot"
          },
        "To": [{
            "Email": "passenger1@mailjet.com",
            "Name": "passenger 1"
          }],
        'Subject': 'Test with the NodeJS Mailjet wrapper',
        'Text-part': 'Hello NodeJs !',
        'Attachments': [{
            "ContentType": "text-plain",
            "Filename": "test.txt",
            "Base64Content": "VGhpcyBpcyB5b3VyIGF0dGFjaGVkIGZpbGUhISEK", // Base64 for "This is your attached file!!!"
          }]
    }]    
}

sendEmail
  .request(emailData)
    .then(handlePostResponse)
    .catch(handleError);

```

You can also use the previous version of Mailjet's Send API (v3). You can find the documentation explaining the overall differences and code samples [here](https://dev.mailjet.com/guides/?javascript#sending-a-basic-email-v3).


### Send two Emails

``` javascript

var sendEmail = Mailjet.post('send', {'version': 'v3.1'});

const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[
                {
                "From": {
                        "Email": "pilot@mailjet.com",
                        "Name": "Mailjet Pilot"
                },
                "To": [
                        {
                        "Email": "passenger1@mailjet.com",
                        "Name": "passenger 1"
                        }
                ],
                "Subject": "Your email flight plan!",
                "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                "HTMLPart": "<h3>Dear passenger 1, welcome to Mailjet!</h3><br />May the delivery force be with you!"
                },
                {
                "From": {
                        "Email": "pilot@mailjet.com",
                        "Name": "Mailjet Pilot"
                },
                "To": [
                        {
                        "Email": "passenger2@mailjet.com",
                        "Name": "passenger 2"
                        }
                ],
                "Subject": "Your email flight plan!",
                "TextPart": "Dear passenger 2, welcome to Mailjet! May the delivery force be with you!",
                "HTMLPart": "<h3>Dear passenger 2, welcome to Mailjet!</h3><br />May the delivery force be with you!"
                }
        ]
    })
request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })

```

## Have Fun !
``` javascript
var mailjet = require ('./mailjet-client')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

function handleError (err) {
  throw new Error(err.ErrorMessage);
}

function newContact (email) {
  mailjet.post('contact')
      .request({Email: email})
      .catch(handleError);
}

function testEmail (text) {
  email = {};
  email.FromName = 'Your Name';
  email.FromEmail = 'Your Sender Address';
  email.Subject = 'Test Email';
  email.Recipients = [{Email: 'Your email'}];
  email['Text-Part'] = text;

  mailjet.post('send')
    .request(email)
    .catch(handleError);
}

testEmail('Hello World!');
```
## SMS API

##### `IMPORTANT`

In mailjet-client v4 we have introduced a new Bearer Token authentication method for the SMS API.
You can generate a token from the [SMS Dashboard][api_token] in the Mailjet app.

```javascript
var Mailjet = require('node-mailjet').connect('api token');
```
Additional connection options may be passed as a **_second_** argument. The supported values are:

- `proxyUrl`: HTTP proxy URL to send the API requests through
- `timeout`: API request timeout in milliseconds
- `url` (default: `api.mailjet.com`): Base Mailjet API URL. If your account is moved to the Mailjet US architecture, you should set this to `api.us.mailjet.com` instead.
- `version` (default: v3): API version to use in the URL
- `perform_api_call` (default: true): controls if the must call must be performed to Mailjet API or not (dry run)

``` javascript

// The second argument (the object) is not mandatory. Each configuration key is also optional
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_API_TOKEN, {
        url: 'api.mailjet.com', // default is the API url
        version: 'v4', // default is '/v3'
        perform_api_call: true // used for tests. default is true
      })
```
**_We kept all other functionalities unchanged_**

### Get cosy with Mailjet SMS

#### Save your `API_TOKEN`:

`echo 'export MJ_API_TOKEN=MY_API_TOKEN' >> ~/.zshrc`

`source ~/.zshrc`

replace `zshrc` with `bash_profile` if you are simply using bash

#### And use it in your projects

``` javascript

var apiToken = process.env.MJ_API_TOKEN;

```

### Store SMS resource
``` javascript

// GET resource
var sms = Mailjet.get('sms');

// POST resource
var sendSms = Mailjet.post('sms-send');

```
### Send SMS

``` javascript

var smsSend = Mailjet.post('sms-send');

var smsData = {
    'Text': 'Have a nice SMS flight with Mailjet !',
    'To': '+33600000000',
    'From': 'MJPilot'
}

smsSend
  .request(smsData)
    .then(handlePostResponse)
    .catch(handleError);

```

## Run Test

``` bash
npm test
```
## Node.js compatibility
Officially supported Node.js versions:
 - ~~v0.12.0~~ (deprecated)
 - v4.1
 - v4.0
 - v5.0.0
 - v6.11.1

## Contribute

Mailjet loves developers. You can be part of this project!

This wrapper is a great introduction to the open source world, check out the code!

Feel free to ask anything, and contribute:

- Fork the project.
- Create a new branch.
- Implement your feature or bug fix.
- Add documentation to it.
- Commit, push, open a pull request and voila.

TODO:

- Extend Error class to create Api errors
