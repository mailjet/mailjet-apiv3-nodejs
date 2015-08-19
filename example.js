
// to run this example add your API key and Secret to your env

var env = process.env;
var Mailjet = require ('./mailjet-client')
	.connect(env.MAILJET_API_KEY, env.MAILJET_API_SECRET);

var getContact = Mailjet.get('contact');
var postContact = Mailjet.post('contact');
var getContact2 = Mailjet.get('contact/2');
var myProfile = Mailjet.get('myprofile');
var sendMessage = Mailjet.post('send');
var sender = Mailjet.post('sender');

sender.request({Email: 'gbadi@student.42.fr'})
	.on('sucess', function (response, body) {
		console.log (body);
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
});

postContact.request({Name: 'Mister Mailjet', Email: 'misters@mailjet.com'}, function (err, response, body) {
	console.log (Mailjet.formatJSON(err || body));
});

getContact2.request(function (err, response, body) {
	console.log (err || body);
});

myProfile.request(function (err, response, body) {
	console.log (err || body);
});

getContact.id(3).request()
		.on('success', function (response, body) {
			console.log (Mailjet.formatJSON(body));
		});

