
var mailjet = require ('node-mailjet')
				.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailjet.get('user').request(function (err, res, body) {
	console.log (res.statusCode, err || body);
});
