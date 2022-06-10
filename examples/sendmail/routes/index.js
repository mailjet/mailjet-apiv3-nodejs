const express = require('express');
const router = express.Router();

const mailjetController = require('../controllers/mailjetController');

router.get('/', (req, res) => {
	return res.render('index', { title: 'Send email' });
});

router.post('/send', (req, res, next) => {
	if(Object.keys(req.body).length > 0) {
		return mailjetController
			.sendMail(req.body)
			.then(response => {
				console.log('response => ', response.body)
				res.redirect('/');
			})
			.catch(err => next(err))
	}

	return res.redirect('/')
});

module.exports = router;
