

![alt text](http://cdn.appstorm.net/web.appstorm.net/files/2012/02/mailjet_logo_200x200.png "Mailjet")

# Mailjet NodeJs Wrapper
for more information about Mailjet, visit http://www.mailjet.com/

This is the NodeJs wrapper form Mailjet, it's MIT licenced.

## Getting Started !

``` javascript

// test.js
// to run this example add your API key and Secret to your env
// and run 'node test.js'

var env = process.env
	, Mailjet = require ('./mailjet-client')
		.connect(env.MAILJET_API_KEY, env.MAILJET_API_SECRET);

// you can store ressources
var contact = Mailjet.get('contact');
var sender = Mailjet.post('sender');
var user = Mailjet.get('user');
var sendMessage = Mailjet.post('send');

// and call them easily
contact.request({Limit: 2}, function (error, response, body) {
	console.log (error || body)
});

// you can specify an id
contact.id(3).request(function (error, response, body) {
	console.log (error || body);
});

// you can add an action to it
contact.id(3)
	.request(function (error, response, body) {
		console.log (error || body);
	});

// if you don't like callbacks
contact.id(2).request()
	.on('success', function (response, body) {
		console.log (body);
	})
	.on('error', function (error, response) {
		console.log ("you shiouldn't get here anyway");
	});

user.request().on('success', function (response, body) {
	console.log (response.statusCode);
});

// Send an Email
sendMessage.request({
	'FromEmail': 'stan@smith.com',
	'FromName': 'Stan Smith',
	'Subject': 'Test nodejs mailjet wrapper',
	'Text-part': 'Hello NodeJs!',
	'Recipients': [{'Email': 'roger@smith.com'}],
}).on('success', function (response, body) {
	console.log (body);
})
.on('error', function (e) {
	console.log (e);
});

postContact.action('managemanycontacts').request({
	ContactLists: [
		{ListID: 1, action: 'addnoforce'}
	],
	Contacts: [
		{Email: 'mr@test.com', Name: 'Hello World'},
		{Email: 'mr@test2.com', Name: 'Hello World2'},
	]
}, function (err, response, body) {
	console.log (err || body);
});

```

## TODO 
 - Add the documentation in test.js
 - Implement a couple more examples
 - Add tests relative to the action chaining
 - Implement a small external project featuring the Wrapper

