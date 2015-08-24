
var mailjet = require ('node-mailjet')
				.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailjet.get('eventcallbackurl').request(function (e, r, b) {
	console.log (e || b);
});
