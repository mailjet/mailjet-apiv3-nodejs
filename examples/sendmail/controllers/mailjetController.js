const mailjet = require('node-mailjet')
	.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

exports.contactList = function() {
	return mailjet
		.get('contact')
		.request({ Limit: 20 });
}

exports.sendMail = function (mail) {
	return mailjet
		.post('send', { version: 'v3.1' })
		.request({
			Messages: [{
				From: {
					Name: process.env.NAME,
					Email: process.env.EMAIL
				},
				To: mail.Recipients,
				HTMLPart: mail.HTMLPart,
				Subject: mail.Subject
			}]
		});
}
