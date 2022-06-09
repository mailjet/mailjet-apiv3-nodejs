# Mailjet app with using ReactJS

## 1. Description
This app provides basic simple `ReactJS` application.

## 2. Start using 

---
### 1. Init application

Install node dependencies with:
```sh
npm install
```

---
### 2. Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

---
### 3. Application features

After startup application and when you already see this application in your browser you need do this action: 
- paste the **public key** and **secret key** in the `SET CREDENTIALS` section

After this action you saw examples on the page.
Each _example_ has got the button **"request"** - you can click this button and receive the response from the Mailjet.
As well, you can set some **pagination** filters such as: `Limit` and `Offset`.

## 4. Advance

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
