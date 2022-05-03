/*external modules*/
const chai = require('chai')
const nock = require('nock')
/*lib*/
const { MailjetClient: Mailjet } = require('../../mailjet-client')
/*other*/

const expect = chai.expect

describe('Mocked API calls', () => {
  const API_KEY = process.env.MJ_APIKEY_PUBLIC
  const API_SECRET = process.env.MJ_APIKEY_PRIVATE

  let client
  before(function () {
    if(typeof API_KEY === 'undefined' || typeof API_SECRET === 'undefined') {
      this.skip()
    } else {
      /* Set a very short timeout */
      client = Mailjet.connect(API_KEY, API_SECRET, { timeout: 10, version: 'v3' })
    }
  })

  describe('method request', () => {

    describe('get', () => {

      let contact
      before(function () {
        contact = client.get('contact')
      })

      it('calls the contact resource instance and the request times out', async () => {
        /* Simulate a delayed response */
        nock('https://api.mailjet.com')
          .get('/v3/REST/contact')
          .delayConnection(1000)
          .reply(200, {})

        try {
          const result = await contact.request({})

          // We want it to raise an error if it gets here
          expect(result).to.equal(undefined)
        } catch (err) {
          expect(err.ErrorMessage).to.equal('Timeout of 10ms exceeded')
          expect(err.statusCode).to.equal(null)
          expect(err.response).to.equal(null)
        } finally {
          nock.cleanAll()
        }
      })

    })

  })
})