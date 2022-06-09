[mailjet]: http://www.mailjet.com
[doc]: http://dev.mailjet.com/guides/?javascript#
[eventemitter]: https://nodejs.org/api/events.html
[api_token]: https://app.mailjet.com/sms
[api_credential]: https://app.mailjet.com/account/api_keys
[api_doc_repo]: https://github.com/mailjet/api-documentation

![alt text](https://www.mailjet.com/images/email/transac/logo_header.png "Mailjet")

# Mailjet JS

[![Build Status](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs.svg?branch=master)](https://travis-ci.org/mailjet/mailjet-apiv3-nodejs)
![Current Version](https://img.shields.io/badge/version-4.0.0-green.svg)

## Overview

Welcome to the [Mailjet][mailjet] official JavaScript SDK built with `webpack`, `babel` & `es5`. \
This can be used in **node** or in the **browser**.

Check out all the resources and JS code examples in the official [Mailjet Documentation][doc].

> **NOTE:** \
> If used in the **browser**, at the moment a **proxy is required** to communicate with the Mailjet API due to **CORS** limitations.\
> Also, do not publish your private api key in frontend code.

## Table of contents

- [Documentation](#documentation)
  - [Compatibility](#compatibility)
  - [Install](#install)
  - [Setup Client](#setup-client)
    - [Authentication](#authentication)
    - [API Setup](#api-setup)
    - [SMS Setup](#sms-setup)
    - [Make your first call](#make-your-first-call)
  - [Configuration](#configuration)
    - [Options](#options)
      - [Request timeout](#request-timeout)
      - [Request headers](#request-headers)
      - [Use proxy](#use-proxy)
    - [Config](#config)
      - [API Versioning](#api-versioning)
      - [Host URL](#host-url)
      - [Accept output](#accept-output)
    - [Disable API call](#disable-api-call)
  - [TypeScript](#typescript)
    - [Our Typings](#our-typings)
  - [Browser Demo](#browser-demo)
  - [App examples](#app-examples)
  - [Request examples](#request-examples)
    - [Basic API](#basic-api)
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
- [Development](#development)
  - [Requirements](#requirements)
  - [Build](#build)
  - [Tests](#tests)
  - [Release Process](#release-process)

# Documentation

## Compatibility

This library officially supports the following `Node.JS` versions:
- \>= `v12.x`

---

## Install

Install the SDK use the following code:

```sh
npm install node-mailjet
```

---

## Setup Client

### Authentication

The Mailjet `Email API` uses your `public` and `secret` keys for authentication.

```bash
export MJ_APIKEY_PUBLIC='your API key'
export MJ_APIKEY_PRIVATE='your API secret'

export MJ_API_TOKEN='your API token'
```

> **Note:** \
> For the `SMS API` the authorization is based on a **Bearer token**. \
> See information about it in the [SMS API](#sms-api) section of the readme.

### Basic setup

Next, require the module and initialize your [Mailjet][mailjet] client:

```javascript
const Mailjet = require('node-mailjet');
```

For `EMAIL API` and `SEND API`:
```js
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret'
});
```

For `SMS API`:
```js
const mailjet = new Mailjet({
  apiToken: process.env.MJ_API_TOKEN || 'your-api-token'
});
```

### API Setup

For `EMAIL API` and `SEND API` you can use static method `apiConnect`:
```js
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
    {
      config: {},
      options: {}
    } 
);
```

### SMS Setup

For `SMS API` you can use static method `smsConnect`:
```js
const mailjet = Mailjet.smsConnect(
    process.env.MJ_API_TOKEN,
    {
      config: {},
      options: {}
    } 
);
```

### Make your first call

Here's an example on how to send an email:
```javascript
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);

const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "pilot@mailjet.com",
                Name: "Mailjet Pilot"
              },
              To: [
                {
                  Email: "passenger1@mailjet.com",
                  Name: "passenger 1"
                }
              ],
              Subject: "Your email flight plan!",
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
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

---

## Configuration

To instantiate the library you can use the following constructor:
```javascript
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
  config: CONFIG,
  options: OPTIONS
});

const request = mailjet
    .METHOD(RESOURCE, CONFIG)
```

- `METHOD`: the method you want to use for this call (`post`, `put`, `get`, `delete`)
- `RESOURCE`: the API endpoint you want to call
- `OPTIONS`: associative array describing the connection options (see [Options](#options) bellow for full list)
- `CONFIG`: associative array describing the connection config (see [Config](#config) bellow for full list)

### Options

`options` have this structure:
- `requestHeaders` - associative array describing custom header fields which you can pass to the request
- `timeout` - sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the entire download can take
- `proxyUrl` - sets a `HTTPS` proxy URL to direct all requests to a specific URL

You can pass `options` on init `client` and this `options` will use for each `request`:
```javascript
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
  options: {
      requestHeaders: {
          'X-API-Key': 'foobar'
      },
      timeout: 1000,
      proxyUrl: 'www.test-proxy.com'
  }
});
```

#### Request timeout

You are able to set a timeout for your request using the `timeout` parameter.\

The `timeout` parameter describe maximum time to wait for the first byte to arrive from the server, but it does not limit how long the entire download can take. \
The API request `timeout` is set in **milliseconds**:

```javascript
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
    options: {
        timeout: 100
    }
});

const request = mailjet
    .post('send', { version: 'v3.1' })
```

#### Request headers

You are able to set a custom headers for your request using the `requestHeaders` parameter.

```javascript
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
    options: {
        requestHeaders: {
            'API-Key': 'foobar', 
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
});

const request = mailjet
    .post('send', { version: 'v3.1' })
```

#### Use proxy

The `proxyUrl` parameter allows you to set a `HTTPS` proxy URL to send the API requests through:

```javascript
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
    options: {
        proxyUrl: 'YOUR_PROXY_URL'
    }
});

const request = mailjet
    .post('send', { version: 'v3.1' })
```

The proxy URL is passed directly to [superagent.connect()](https://github.com/visionmedia/superagent/blob/master/docs/index.md#forcing-specific-connection-ip-address) as:
```javascript
if (clientOptions.proxyUrl) {
    request.connect({ '*': clientOptions.proxyUrl });
}
```

> **NOTE:** \
> This parameter worked only on the **node** side because in `Node.JS` it's possible to ignore DNS resolution and direct all requests to a specific IP address.

### Config

`config` have this structure:
- `host` - sets custom host URL
- `version` - sets required version of API for determinate endpoint _(set of `v3`, `v3.1`, `v4`)_
- `output` - sets the `Accept` header

You can pass `config` on init `client` and this `config` will use for each `request`:
```javascript
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
  config: {
      host: 'new.api.mailjet',
      version: 'v3.1',
      output: 'xml',
  }
});
```

And for each `request` manually _(this `config` will have **more precedence** than passed in `client`)_:
```javascript
const request = mailjet
    .post('send', {
        host: 'new.api.mailjet',
        version: 'v3.1',
        output: 'json',
    })
```

#### API Versioning

The Mailjet API is spread among three distinct versions:
- `v3` - The `Email API`
- `v3.1` - The `Email Send API v3.1`, which is the latest version of our `Send API`
- `v4` - The `SMS API`

Since most `Email API` endpoints are located under `v3`, it is set as the default one and does not need to be specified when making your request.\
For the others you need to specify the version using `version`.

For example, if using `Send API` `v3.1`:

```javascript
const request = mailjet
    .post('send', { version: 'v3.1' })
```

For additional information refer to our [API Reference](https://dev.mailjet.com/reference/overview/versioning/).

#### Host URL

The default **base host name** for the Mailjet API is `api.mailjet.com`. \
You can modify this **host URL** by setting a value for `host` in your call:

```javascript
const request = mailjet
    .post('send', { version: 'v3.1', host: 'api.us.mailjet.com' })
```

If your account has been moved to Mailjet's `US` architecture, the `host` value you need to set is `api.us.mailjet.com`.

#### Accept output

The default **accepted output** for the Mailjet API is `json`. \
You can modify this **accepted output data** by setting a value for `output` in your call:

```javascript
const request = mailjet
    .post('send', { version: 'v3.1', output: 'xml' })
```

The `output` parameter allowing you to specify either the full canonicalized MIME type name as `type/subtype` or the extension suffix form as `xml`, `json`, `png`, etc.

For more detailed information and set of supported `output` values visit [this doc](https://github.com/visionmedia/superagent/blob/master/docs/index.md#setting-accept).

> **NOTE:**\
> Keep in mind that not all passed values to `output` property will correctly execute by Mailjet server.

### Disable API call

By default, the API call parameter is always enabled. \
However, you may want to disable it during testing to prevent unnecessary calls to the Mailjet API.

This is done by passing the second argument with value `false` to `.request(data, performAPICall)` method:

```javascript
const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({}, false)
```

---

## TypeScript

At the moment library based on `TypeScript` and provide **generic** method `Request.request<TResult>(data)`:
```typescript
import Mailjet from 'node-mailjet'
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

interface IContract {
    IsExcludedFromCampaigns: boolean;
    Name: string;
    CreatedAt: string;
    DeliveredCount: number;
    Email: string;
}

type TResponse<TEntity> = {
    Count: number;
    Total: number;
    Data: Array<TEntity>
}

const request = mailjet
	.get('contact')
	.request<TResponse<IContract>>()
```

And `response` will have this shape:
```typescript
{
    response: Response;
    body: {
        Count: number;
        Total: number;
        Data: Array<{
            IsExcludedFromCampaigns: boolean;
            Name: string;
            CreatedAt: string;
            DeliveredCount: number;
            Email: string;
        }>;
    }
}
```

But at the moment library don't provide a types for Mailjet API only for library level.
But we work on it.

### Our external Typings

For now or for earlier versions of library you can use `@types/node-mailjet` dependency.

The `types` are published in `npm` and ready for use. \
[Here](https://www.npmjs.com/package/@types/node-mailjet) is the `npm` page.

Feel free to request changes if there is something missing or you just suggest an improvement.

The main repository is [here](https://github.com/DefinitelyTyped/DefinitelyTyped). \
And [here](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node-mailjet/index.d.ts) is the file with our types.

---

## Browser Demo

For this demo to work, you'll need to install and run `http-proxy` locally.

Install it with:

```sh
npm install -g http-proxy
```

Then run the following command from the `mailjet-apiv3-nodejs` directory:

```sh
http-server -p 4001 --proxy="https://api.mailjet.com"
```

Demo should be up and running at http://0.0.0.0:4001/examples/

---

## App examples

List of basic applications that was built in different environments:
1. [Browser](https://github.com/mailjet/mailjet-apiv3-nodejs/tree/master/examples/browser) - Basic app that using `RequireJS` and provide page where you can make some requests
2. [Node](https://github.com/mailjet/mailjet-apiv3-nodejs/tree/master/examples/node) - Basic app that contain simple scripts with some requests
3. [Sendmail](https://github.com/mailjet/mailjet-apiv3-nodejs/tree/master/examples/sendmail) - `ExpressJS` based app that allow to retrieve list of **contacts** and send email to some person
4. [ReactJS](https://github.com/mailjet/mailjet-apiv3-nodejs/tree/master/examples/react) - `ReactJS` based app that provide page where you can make some requests

> **NOTE:**
> For `browser` side examples at the moment a **proxy is required** to communicate with the Mailjet API due to **CORS** limitations.

---

## Request examples

### Basic API

#### `POST` Request

Use the `post` method of the Mailjet client:

```javascript
const request = mailjet
  .post($RESOURCE, $CONFIG)
  .id($ID)
  .request($DATA)
```

`.request` will contain the body of the `POST` request. \
You need to define `.id` if you want to perform an action on a specific object and need to identify it.

##### Simple `POST` request

Create a new **contact**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
	.post('contact')
	.request({
        Email: "passenger@mailjet.com",
        IsExcludedFromCampaigns: "true",
        Name: "New Contact"
	})

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

##### Using `actions`

Manage the **subscription status** of a **contact** to multiple **lists**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
    .post('contact')
	.id($contactID)
	.action('managecontactslists')
	.request({
          ContactsLists: [
            {
                ListID: $listID,
                Action: "addnoforce"
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

#### `GET` Request

Use the `get` method of the Mailjet client:

```javascript
const request = mailjet
 .get($RESOURCE, $CONFIG)
 .id($ID)
 .request($PARAMS)
```

`.request` will contain any query parameters applied to the request. \
You need to define `.id` if you want to retrieve a specific object.

##### Retrieve all objects

Retrieve all **contacts**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
	.get('contact')
	.request()

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

##### Use filtering

Retrieve all **contacts** that are not in the **campaign exclusion list**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
	.get('contact')
	.request({ IsExcludedFromCampaigns: false })

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

##### Retrieve a single object

Retrieve a specific **contact** by `ID`:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
	.get('contact')
	.id($contactID)
	.request()

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

#### `PUT` Request

Use the `put` method of the Mailjet client:

```javascript
const request = mailjet
    .put($RESOURCE, $CONFIG)
    .id($ID)
    .request($PARAMS)
```

You need to define `.id` to specify the object you need to edit. \
`.request` will contain the body of the `PUT` request.

A `PUT` request in the Mailjet API will work as a `PATCH` request - the update will affect only the specified properties. \
The other properties of an existing resource will neither be modified, nor deleted. \
It also means that all non-mandatory properties can be omitted from your payload.

Update the **contact properties** for a **contact**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
    .put('contactdata')
    .id($contactID)
    .request({
        Data: [
            {
                first_name: "John",
                last_name: "Smith"
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

#### `DELETE` Request

Use the `delete` method of the Mailjet client:

```javascript
const request = mailjet
 .delete($RESOURCE, $CONFIG)
 .id($ID)
 .request()
```

You need to define `.id` to specify the object you want to delete. \
`.request` should be empty.

Upon a successful `DELETE` request the response will not include a response body, but only a `204 No Content` response code.

Delete an email **template**:

```javascript
const Mailjet = require('node-mailjet')
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const request = mailjet
	.delete('template')
	.id($templateID)
	.request()

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

### SMS API

#### Token authentication

Authentication for the `SMS API` endpoints is done using a `Bearer token`.  
The `Bearer token` is generated in the [SMS section](https://app.mailjet.com/sms) of your Mailjet account.

```javascript
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.smsConnect(process.env.MJ_API_TOKEN);
```

#### Example request

Here's an example `SMS API` request:

```javascript
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.smsConnect(process.env.MJ_API_TOKEN, {
    config: {
        version: 'v4'
    }
});

const request = mailjet
    .post('sms-send')
    .request({
        Text: "Have a nice SMS flight with Mailjet !",
        To: "+33600000000",
        From: "MJPilot"
  })

request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})
```

---

# Development

Mailjet loves developers. You can be part of this project! \
This SDK is a great introduction to the open source world, check out the code!

Feel free to ask anything, and contribute:
- Fork the project.
- Create a new branch.
- Implement your feature or bug fix.
- Add documentation to it.
- Commit, push, open a pull request and voila.

If you have suggestions on how to improve the guides, please submit an issue in our [Official API Documentation repo](https://github.com/mailjet/api-documentation).

## Requirements

- Requires `Node.JS` >= 4.x

Init package with:

```sh
npm run init
```

Where the `init` script contain all essential init steps:
1. `npm install` - install all dependencies
2. `npm run ts:patch` - patch `TS` compiler for correct building `TypeScript` declaration files
3. `npm run pkg:prepare` - `husky` install for `git hooks`

## Build

Build for release purposes (include minimizing):
```sh
npm run build
```

Build for dev purposes (without minimizing):
```sh
npm run build:dev && npm run build:prepublish
```

Build for watching and hot-reload:
```sh
npm run build:watch
```

## Tests

Execute all tests:
```sh
npm run test
```

Watch tests with:
```sh
npm run test:watch
```

Receive coverage of tests with:
```sh
npm run cover
```

To test new functionality locally using ```npm link``` please use npm script ```npm run pkg:link```. \
This is needed for correct exporting d.ts files.

## Merging changes

Before **PR merge** check that commits info will be correctly added to the `CHANGELOG.md` file:
```sh
npm run release:dry
```

As well that allow to see that package version was correct increased for `SemVer` convention.

And then run:
```sh
npm run release
```

**IMPORTANT:** if package version was increased incorrect you should manually use this scripts:
- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`

> CI process isn't working currently, so please manually run ```npm run test```

## Release Process

Releases occur after `feature` branches have been tested and merged into `master`.

First, checkout `master` and `pull` the latest commits.

```sh
git checkout master
git pull
```

Next, run ```npm run release```.

After that, `cd ./dist` and then run ```npm login``` and ```npm publish``` to publish changes on npm.
