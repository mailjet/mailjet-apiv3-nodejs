
var mailjet = require ('node-mailjet')
				.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailjet
	.post('sender')
	.request({Email: 'mailjet@moon.com'})
	.on('success', function (res, body) { console.log (body) })
	.on('error', function (err) { console.log (err) });
