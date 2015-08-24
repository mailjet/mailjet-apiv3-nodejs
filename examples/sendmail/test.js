
var env = process.env;
var Mailjet = require ('node-mailjet')
	.connect(env.MAILJET_API_KEY, env.MAILJET_API_SECRET);

Mailjet.get('contactslist').request(function (err, r, b) {
	console.log (err || b);
});
