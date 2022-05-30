# Mailjet app with using NodeJS and ExpressJS

## 1. Description
This app provides basis `ExpressJS` application which give opportunity to _send emails_ and _receive contacts_.

## 2. Start using
To start using this app you need to install all dependencies by the following command `npm install`. \
After you need to create file `.env` which should be based on the sample file `.env.sample` but with real credentials.

And after this steps you can run following command `npm run start` and in the console you saw message about that `server Listening on port <port>`.

**Routes**: 
1. `/` - the root route which permit for you send email with subject and text part to someone
2. `/users` - the route which show your list of contacts

## 3. Advance

--- 
1. Receive `source-map` feature for the library

By default, all code that is located in folder `dist` is built for `production` environment. \
For this reason, you can't receive all `development` **mode features** which provided `Webpack`. 

But you can change it follow this steps:
1. open **root** folder ob library
2. run `npm run build:dev` and next `npm run build:prepublish`

After these steps `webpack` will built new bundles which contained all `dev` **mode** features such as:
- access to **`watch` mode** that permits you to do some changes in the library and have a very quick and automatically library rebuild
- support `inline-source-map` that is permit for you view source library code without anyone compression and obfuscation

---
2. Using `npm link` in `package.json`

You can open `package.json` and saw that `node-mailjet` dependency property have value `"file:../../dist"` it is because 
this application has local link to the **Mailjet library** and always will use **library source code** from the **local** `dist` folder. 
This feature allows you always use the _last changes of the library_, even if them _local_ and even if them _yours_. 
