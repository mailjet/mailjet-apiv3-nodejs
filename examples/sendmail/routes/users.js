const express = require('express');
const router = express.Router();

const mailjetController = require('../controllers/mailjetController');

router.get('/', (req, res, next) => {
  return mailjetController
  	.contactList()
  	.then(response => {
  		console.log('response => ', response.body)
  		res.render('users', {
  			title: 'List of contacts',
  			contacts: response.body.Data
  		});
  	})
  	.catch(err => next(err))
});

module.exports = router;
