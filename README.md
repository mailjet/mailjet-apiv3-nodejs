
[mailjet]: http://www.mailjet.com
[api_credential]: https://app.mailjet.com/account/api_keys
[api_token]: https://app.mailjet.com/sms
[eventemitter]: https://nodejs.org/api/events.html
[doc]: http://dev.mailjet.com/guides/?javascript#
[api_doc_repo]: https://github.com/mailjet/api-documentation

![alt text](https://www.mailjet.com/images/email/transac/logo_header.png "Mailjet")

# Mailjet NodeJs Wrapper

[![Build Status](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs.svg?branch=master)](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs)
![Current Version](https://img.shields.io/badge/version-3.3.1-green.svg)

## Overview

Welcome to the [Mailjet][mailjet] official NodeJs API wrapper!

Check out all the resources and NodeJs code examples in the official [Mailjet Documentation][doc].

## Table of contents

- [Mailjet NodeJs Wrapper](#mailjet-nodejs-wrapper)
  - [Overview](#overview)
  - [Table of contents](#table-of-contents)
  - [Compatibility](#compatibility)
  - [Installation](#installation)
  - [Authentication](#authentication)
  - [Make your first call](#make-your-first-call)
  - [Client / Call configuration specifics](#client--call-configuration-specifics)
    - [Options](#options)
      - [API Versioning](#api-versioning)
      - [Base URL](#base-url)
      - [Request timeout](#request-timeout)
      - [Use proxy](#use-proxy)
    - [Disable API call](#disable-api-call)
  - [Request examples](#request-examples)
    - [POST Request](#post-request)
      - [Simple POST request](#simple-post-request)
      - [Using actions](#using-actions)
    - [GET Request](#get-request)
      - [Retrieve all objects](#retrieve-all-objects)
      - [Use filtering](#use-filtering)
      - [Retrieve a single object](#retrieve-a-single-object)
    - [PUT Request](#put-request)
    - [DELETE Request](#delete-request)
  - [SMS API](#sms-api)
    - [Token authentication](#token-authentication)
    - [Example request](#example-request)
  - [Contribute](#contribute)

## Compatibility

This library officially supports the following Node.js versions:

 - v12

## Installation

First, create a project folder:

`mkdir mailjet-project && cd $_`

Then use the following code to install the wrapper:

`npm install node-mailjet`

If you want to do a global installation, add the `-g` flag.

## Authentication

The Mailjet Email API uses your API and Secret keys for authentication. [Grab][api_credential] and save your Mailjet API credentials.

```bash
export MJ_APIKEY_PUBLIC='your API key'
export MJ_APIKEY_PRIVATE='your API secret'
```

> Note: For the SMS API the authorization is based on a Bearer token. See information about it in the [SMS API](#sms-api) section of the readme.

Initialize your [Mailjet][mailjet] Client:

``` javascript
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
```

## Make your first call

Here's an example on how to send an email:

```javascript
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[{
            "From": {
                "Email": "pilot@mailjet.com",
                "Name": "Mailjet Pilot"
            },
            "To": [{
                "Email": "passenger1@mailjet.com",
                "Name": "passenger 1"
            }],
            "Subject": "Your email flight plan!",
            "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
            "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
        }]
    })
request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
```

## Client / Call configuration specifics

To instantiate the library you can use the following constructor:

```javascript
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
    .METHOD(RESOURCE, {OPTIONS})
```

 - `MJ_APIKEY_PUBLIC` : public Mailjet API key
 - `MJ_APIKEY_PRIVATE` : private Mailjet API key
 - `METHOD` - the method you want to use for this call (`post`, `put`, `get`, `delete`)
 - `RESOURCE` - the API endpoint you want to call
 - `OPTIONS` : associative array describing the connection options (see Options bellow for full list)

### Options

#### API Versioning

The Mailjet API is spread among three distinct versions:

- `v3` - The Email API
- `v3.1` - Email Send API v3.1, which is the latest version of our Send API
- `v4` - SMS API

Since most Email API endpoints are located under `v3`, it is set as the default one and does not need to be specified when making your request. For the others you need to specify the version using `version`. For example, if using Send API `v3.1`:

```javascript
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
    .post("send", {'version': 'v3.1'})
```

For additional information refer to our [API Reference](https://dev.mailjet.com/reference/overview/versioning/).

#### Base URL

The default base domain name for the Mailjet API is api.mailjet.com. You can modify this base URL by setting a value for `url` in your call:

```javascript
const request = mailjet
    .post("send", {'version': 'v3.1', 'url': 'api.us.mailjet.com'})
```

If your account has been moved to Mailjet's US architecture, the URL value you need to set is `api.us.mailjet.com`.

#### Request timeout

You are able to set a timeout for your request using the `timeout` parameter. The API request timeout is set in milliseconds:

```javascript
const request = mailjet
    .post("send", {'version': 'v3.1', 'timeout': 100})
```

#### Use proxy

The `proxyUrl` parameter allows you to set a HTTPS proxy URL to send the API requests through:

```javascript
const request = mailjet
    .post("send", {'version': 'v3.1', 'proxyUrl': 'YOUR_PROXY_URL'})
```

The proxy URL is passed directly to [superagent-proxy](https://github.com/TooTallNate/superagent-proxy).


### Disable API call

By default the API call parameter is always enabled. However, you may want to disable it during testing to prevent unnecessary calls to the Mailjet API. This is done by setting the `perform_api_call` parameter to `false`:

```javascript
const request = mailjet
    .post("send", {'version': 'v3.1', 'perform_api_call': false})
```

## Request examples

### POST Request

Use the `post` method of the Mailjet Client:

```javascript
const request = mailjet
  .post($RESOURCE, {$OPTIONS})
  .id($ID)
  .request({$PARAMS})
```

`.request` will contain the body of the POST request. You need to define `.id` if you want to perform an action on a specific object and need to identify it.

#### Simple POST request

```javascript
/**
 *
 * Create a new contact:
 *
 */
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.post("contact")
	.request({
	    "Email":"passenger@mailjet.com",
	    "IsExcludedFromCampaigns":"true",
	    "Name":"New Contact"
	})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

#### Using actions

```javascript
/**
*
* Manage the subscription status of a contact to multiple lists
*
**/
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.post("contact")
	.id($contact_ID)
	.action("managecontactslists")
	.request({
    "ContactsLists": [{
			"ListID": 987654321,
			"Action": "addnoforce"
		}]
	})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

### GET Request

Use the `get` method of the Mailjet Client:

```javascript
const request = mailjet
 .get($RESOURCE, {$OPTIONS})
 .id($ID)
 .request({$PARAMS})
```

`.request` will contain any query parameters applied to the request. You need to define `.id` if you want to retrieve a specific object.

#### Retrieve all objects

```javascript
/**
 *
 * Retrieve all contacts
 *
 */
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.get("contact")
	.request()
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

#### Use filtering

```javascript
/**
 *
 * Retrieve all contacts that are not in the campaign exclusion list :
 *
 */
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.get("contact")
	.request({'IsExcludedFromCampaigns': false})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```


#### Retrieve a single object

```javascript
/**
 *
 * Retrieve a specific contact ID :
 *
 */
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.get("contact")
	.id(Contact_ID)
	.request()
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

### PUT Request

Use the `put` method of the Mailjet Client:

```javascript
const request = mailjet
 .put($RESOURCE, {$OPTIONS})
 .id($ID)
 .request({$PARAMS})
```

You need to define `.id` to specify the object you need to edit. `.request` will contain the body of the PUT request.

A `PUT` request in the Mailjet API will work as a `PATCH` request - the update will affect only the specified properties. The other properties of an existing resource will neither be modified, nor deleted. It also means that all non-mandatory properties can be omitted from your payload.

Here's an example of a PUT request:

```javascript
/**
 *
 * Update the contact properties for a contact:
 *
 */
const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
    .put("contactdata")
    .id($CONTACT_ID)
    .request({
        "Data":[{
            "first_name": "John",
            "last_name": "Smith"
        }]
    })
request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
```

### DELETE Request

Use the `delete` method of the Mailjet Client:

```javascript
const request = mailjet
 .delete($RESOURCE, {$OPTIONS})
 .id($ID)
 .request()
```

You need to define `.id` to specify the object you want to delete. `.request` should be empty.

Upon a successful `DELETE` request the response will not include a response body, but only a `204 No Content` response code.

Here's an example of a `DELETE` request:

```javascript
/**
 *
 * Delete : Delete an email template.
 *
 */
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const request = mailjet
	.delete("template")
	.id(Template_ID)
	.request()
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

## SMS API

### Token authentication

Authentication for the SMS API endpoints is done using a bearer token. The bearer token is generated in the [SMS section](https://app.mailjet.com/sms) of your Mailjet account.

```javascript
var Mailjet = require('node-mailjet').connect('api token');
```

### Example request

Here's an example SMS API request:

```javascript
const mailjet = require ('node-mailjet')
	.connect(process.env.MJ_TOKEN)
const request = mailjet
    .post("sms-send", {'version': 'v4'})
    .request({
       "Text": "Have a nice SMS flight with Mailjet !",
       "To": "+33600000000",
       "From": "MJPilot"
  })

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
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

If you have suggestions on how to improve the guides, please submit an issue in our [Official API Documentation repo](https://github.com/mailjet/api-documentation).
