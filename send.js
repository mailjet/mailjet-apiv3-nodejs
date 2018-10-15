const Mailjet = require('./mailjet-client')

const client = new Mailjet(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

client.delete('contact').id('23539759').request()
  .then(e => console.log(e.body))
  .catch(e => console.log(e))
