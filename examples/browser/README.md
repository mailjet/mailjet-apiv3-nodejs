# Mailjet app with using RequireJS

## 1. Description
This app provides an example of using mailjet library in the browser.  
For work in the browser was built the application example which is using the library `RequireJS`.

## 2. Start using
To start using this app you need open file `index.html` which is located in the folder `www`. \
After this action, you saw the main application page in your browser. \
You need to paste the **public key** and **secret key** in the `SET CREDENTIALS` section.

Each _example_ has got the button **"request"** - after all these required actions you can click this button and receive the response from the Mailjet.

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
