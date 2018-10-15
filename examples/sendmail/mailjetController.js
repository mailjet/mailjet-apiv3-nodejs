
var mailjet = require ('./mailjet/mailjet-client')
	.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

var contactList = mailjet.get('contact');
var sendMail = mailjet.post('send');

exports.contactList = function (done) {
	contactList.request({Limit: 20}, done);
}

exports.sendMail = function (mail, done) {
	mail['FromEmail'] = process.env.EMAIL;
	mail['FromName'] = process.env.NAME;

	sendMail.request(mail, done);
}
