
[mailjet]: http://www.mailjet.com
[api_credential]: https://app.mailjet.com/account/api_keys
[eventemitter]: https://nodejs.org/api/events.html
[doc]: http://dev.mailjet.com/guides/?javascript#
[api_doc_repo]: https://github.com/mailjet/api-documentation

![alt text](http://cdn.appstorm.net/web.appstorm.net/files/2012/02/mailjet_logo_200x200.png "Mailjet")


[![Build Status](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs.svg?branch=master)](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs)
![Current Version](https://img.shields.io/badge/version-3.1.0-green.svg)
# Mailjet NodeJs Wrapper

Please welcome the new [Mailjet][mailjet] official NodeJS API wrapper!

[Mailjet][mailjet] is an Email Service Provider (ESP). Visit the website and get comfortable!

Every code examples can be find on the [Mailjet Documentation][doc]

(Please refer to the [Mailjet Documentation Repository][api_doc_repo] to contribute to the documentation examples)


## Getting started

first, create a project folder

`mkdir mailjet-project && cd $_`

### Installation

if you want to get a global installation, you can add `-g`

`npm install node-mailjet`



### Show me the code

To authenticate, go get your API key, and API secret [here][api_credential],
open your favorite text editor and import the mailjet module

``` javascript

var Mailjet = require('node-mailjet').connect('api key', 'api secret');

```

Additional connection options may be passed as the third argument. These values are supported:

- `proxyUrl`: HTTP proxy URL to send the email requests through
- `timeout`: API request timeout in milliseconds

Example:

``` javascript
var Mailjet = require('node-mailjet').connect('api key', 'api secret', {
  proxyUrl: process.env.https_proxy,
  timeout: 60000 // 1 minute
});
```

The proxy URL is passed directly to [superagent-proxy](https://github.com/TooTallNate/superagent-proxy).

### Get cosy with Mailjet


#### Save your `API_KEY` and `API_SECRET`:

`echo 'export MJ_APIKEY_PUBLIC=MY_API_KEY' >> ~/.zshrc`

`echo 'export MJ_APIKEY_PRIVATE=MY_API_SECRET' >> ~/.zshrc`

`source ~/.zshrc`

replace `zshrc` with `bash_profile` if you are simply using bash

#### And use it in your projects

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

var sendEmail = Mailjet.post('send');

var emailData = {
    'FromEmail': 'my@email.com',
    'FromName': 'My Name',
    'Subject': 'Test with the NodeJS Mailjet wrapper',
    'Text-part': 'Hello NodeJs !',
    'Recipients': [{'Email': 'roger@smith.com'}],
  'Attachments': [{
    "Content-Type": "text-plain",
    "Filename": "test.txt",
    "Content": "VGhpcyBpcyB5b3VyIGF0dGFjaGVkIGZpbGUhISEK",
  }],
}

sendEmail
  .request(emailData)
    .then(handlePostResponse)
    .catch(handleError);

```

### Send two Emails

``` javascript

var emailData = {
    'FromEmail': 'gbadi@student.42.fr',
    'FromName': 'Guillaume badi',
    'Subject': 'Coucou Mailjet2',
    'Text-part': 'Hello World2',
    'Recipients': [{'Email': 'gbadi@mailjet.com'}],
};

var emailData2 = {
    'FromEmail': 'gbadi@student.42.fr',
    'FromName': 'Guillaume badi',
    'Subject': 'Coucou Mailjet2',
    'Text-part': 'This is another Email',
    'Recipients': [{'Email': 'gbadi@mailjet.com'}],
};

sendEmail
  .request(emailData)
    .then(handleData)
    .catch(handleError);

sendEmail
  .request(emailData2)
    .then(handleData)
    .catch(handleError);

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
  email['FromName'] = 'Your Name';
  email['FromEmail'] = 'Your Sender Adress';
  email['Subject'] = 'Test Email';
  email['Recipients'] = [{Email: 'Your email'}];
  email['Text-Part'] = text;

  mailjet.post('send')
    .request(email)
    .catch(handleError);
}

testEmail('Hello World!');
```


## Run Test

``` bash
npm test
```

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
