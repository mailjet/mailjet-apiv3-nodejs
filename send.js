
const Mailjet = require('./mailjet-client')

const email = {
  FromEmail: 'gbadi@mailjet.com',
  FromName: 'Guillaume',
  Subject: 'test',
  'Text-Part': 'Hello',
  'Html-Part': '<p>hello</p>',
  Recipients: [{ Email: 'gbadi@mailjet.com' }],
}

const client = (new Mailjet(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
))

client.post('send').request(email)
  .then(result => console.log(JSON.stringify(result.body, null, 2)))
  .catch(e => console.log('error', e))
