const dotenv = require('dotenv');
const Mailjet = require('node-mailjet');

dotenv.config();

const client = Mailjet
	.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)

client
	.get('eventcallbackurl')
	.request()
	.then(response => {
		console.log('response => ', response.body)
	})
	.catch(err => {
		console.log('error => ', err)
	})
