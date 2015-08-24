var mailjetController = require('../mailjetController');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	mailjetController.contactList(function (err, response, body) {
		if (err) {
			// dont do that
			process.exit(1);
		} else {
			res.render('index', {
				title: 'Hello Mailjet!',
				contacts: body.Data
			});
		}
	});
});

router.post('/send/', function (req, res) {
	mailjetController.sendMail(req.body, function (err, r, body) {
		res.redirect('/');
	});
});

module.exports = router;
