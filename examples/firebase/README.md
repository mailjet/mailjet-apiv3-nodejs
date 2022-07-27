# Mailjet app with using Firebase

## 1. Mailjet with Firebase Functions

### 1. Description
This app provides an example of using **mailjet library** with **Firebase Functions**.  

This example-app provides 3 **Firebase Function**: 
- `helloWorld` - a simple function that return response with text `Hello from Firebase!`
- `sendHelloWorld` - function that use **mailjet library** for send an email based on data that saved in your function and return response with _result of sending_
- `sendEmail` - function that use **mailjet library** for send an email and return response with _result of sending_ 
  - This function based on _query string data - `sendEmail?from=$FROM_EMAIL&to=$TO_EMAIL&subject=$SUBJECT`_: 
    - `from=$FROM_EMAIL` - sender email _(`$FROM_EMAIL` should be replaced with your email)_
    - `to=$TO_EMAIL` - recipient email _(`$TO_EMAIL` should be replaced with your email)_
    - `subject=$SUBJECT` - subject of email _(`$SUBJECT` should be replaced with your email subject)_

### 2. Start using

Detailed documentation: 
- [Get started: write, test, and deploy your first functions](https://firebase.google.com/docs/functions/get-started)

---
First of all you need to set up **Firebase CLI**: 
```bash
npm install -g firebase-tools
```

> Read more - [Set up Node.js and the Firebase CLI](https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli)

---
Then you need login to **Firebase**: 
```bash
firebase login
```

This command allow to log in via the browser and authenticate the firebase tool.

---
In file `.firebaserc` **you need set** your real project ID.

---
In file `functions/index.js` **you need replace** `<YOUR_PUBLIC_KEY>` and `<YOUR_SECRET_KEY>` with your real credentials.

As well for the function `sendHelloWorld` you need use real `from` and `to` emails in `fromEmail` and `toEmail` variables.

### 3. Testing

The [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) allows you to build and test apps on your local machine instead of deploying to a Firebase project.  
Local testing during development is strongly recommended, in part because it lowers the risk from coding errors that could potentially incur cost in a production environment (for example, an infinite loop).

For testing functions that exist in `functions/index.js` (`helloWorld`, `sendHelloWorld`, `sendEmail`)
you need to write the following command into your console in the `functions` directory:
```bash
firebase serve
```

And when serving would start you will see this output in your console: 
```
✔  functions[us-central1-helloWorld]: http function initialized (http://localhost:5000/$PROJECT/us-central1/helloWorld).
✔  functions[us-central1-sendHelloWorld]: http function initialized (http://localhost:5000/$PROJECT/us-central1/sendHelloWorld).
✔  functions[us-central1-sendEmail]: http function initialized (http://localhost:5000/$PROJECT/us-central1/sendEmail).
```

As a result, you can follow these links in and see the result of execution for each function.

> `$PROJECT` will be replaced with your project ID.

> For more detailed information visit [Run functions locally](https://firebase.google.com/docs/functions/local-emulator#web-version-9).

### 4. Deploying 

Once your functions are working as desired in the emulator, you can proceed to deploying, testing, and running them in the production environment. \
Keep in mind that to deploy to the recommended **Node.js 14** runtime environment, your project must be on the **Blaze pricing plan**.

Run this command to deploy your functions:
```bash
firebase deploy
```

After you run this command, the **Firebase CLI** outputs the URL for any HTTP function endpoints. \
In your terminal, you should see a line like the following:
```
i  functions: creating Node.js 14 function sendHelloWorld(us-central1)...
i  functions: creating Node.js 14 function sendEmail(us-central1)...
i  functions: updating Node.js 14 function helloWorld(us-central1)...
✔  functions[helloWorld(us-central1)] Successful update operation.
✔  functions[sendHelloWorld(us-central1)] Successful create operation.
✔  functions[sendEmail(us-central1)] Successful create operation.
Function URL (helloWorld(us-central1)): https://us-central1-$PROJECT.cloudfunctions.net/helloWorld
Function URL (sendHelloWorld(us-central1)): https://us-central1-$PROJECT.cloudfunctions.net/sendHelloWorld
Function URL (sendEmail(us-central1)): https://us-central1-$PROJECT.cloudfunctions.net/sendEmail
i  functions: cleaning up build files...

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/$PROJECT/overview
```

> `$PROJECT` will be replaced with your project ID.