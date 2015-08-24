
var bodyParser = require ('body-parser');
var mailjet = require ('node-mailjet')
				.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

function Button (app, listid) {
	this.listID = listid;
	var self = this;
	
	app
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({extended: true}))
		.post('/mailjet/subscribe/', function (req, res) {
			addContact = mailjet.post('contactslist');
			var data = req.body;
			console.log (data);
			addContact.id(self.listID).action('managecontact')
				.request({
					Name: 'hey',
					Email: 'ho@gmail.com'
				})
				.on('success', function (r, b) {
					console.log (b);
				})
				.on('error', function (e) { console.log (e) });
		});
}

module.exports = Button;
