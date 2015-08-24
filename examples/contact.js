
var mailjet = require ('node-mailjet')
				.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailjet
	.get('contact')
	.request(function (err, res, body) {
		console.log (err || body);
	});
