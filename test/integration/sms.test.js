/*external modules*/
const chai = require('chai')
/*lib*/
const { MailjetClient: Mailjet } = require('../../mailjet-client')
/*other*/

const expect = chai.expect

describe('Basic Usage', () => {
  const API_TOKEN = process.env.MJ_API_TOKEN || '8964208cb2f14fea8dafd6e02dc51d4c'

  let client;
  before(function () {
    if(typeof API_TOKEN === 'undefined') {
      this.skip()
    } else {
      client = Mailjet.connect(API_TOKEN)
    }
  })

  describe('connection', () => {

    it('creates instance of the client', () => {
      const connectionType1 = new Mailjet(API_TOKEN)
      const connectionType2 = new Mailjet().connect(API_TOKEN)
      const connectionType3 = Mailjet.connect(API_TOKEN)

      expect(connectionType1.apiToken).to.equal(API_TOKEN)
      expect(connectionType2.apiToken).to.equal(API_TOKEN)
      expect(connectionType3.apiToken).to.equal(API_TOKEN)
    })

    it('creates an instance of the client wiht options', () => {
      const smsOptions = {
        version: 'v4'
      }

      const connectionType1 = new Mailjet(API_TOKEN, smsOptions)
      const connectionType2 = new Mailjet().connect(API_TOKEN, smsOptions)
      const connectionType3 = Mailjet.connect(API_TOKEN, smsOptions)

      const connections = [connectionType1, connectionType2, connectionType3]

      connections.forEach(function(connection) {
        expect(connection).to.have.property('apiToken', API_TOKEN)
        expect(connection.options).to.have.property(
          'version',
          smsOptions.version
        )
      })
    })

  })

  describe('method call', () => {

    describe('get', () => {

      let smsGet;
      before(() => {
        smsGet = client.get('sms')
      })

      it('calls retrieve sms action count with parameters', async () => {
        const countRequest = smsGet.action('count')

        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date })

          expect(response.body).should.be.a('object')
          expect(response.body.count).to.equal(0)
        } catch (err) {
          expect(err.ErrorMessage).to.equal(undefined)
        }
      })

      it('retirieve list of messages', async () => {
        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date })

          expect(response.body).to.be.a('object')
          expect(response.body.Data.length).to.equal(0)
        } catch (err) {
          expect(err).to.equal(undefined)
        }
      })

    })

    describe('post', () => {

      it('export sms statisitcs action with timestamp bigger than one year', async () => {
        try {
          const response = await client
            .post('sms')
            .action('export')
            .request({
              FromTS: 1033552800,
              ToTS: 1033574400
            })

          expect(response.body).to.be.a('object')
        } catch (err) {
          expect(err.statusCode).to.equal(400)
          expect(err.ErrorMessage).to.equal('FromTS must not be older than one year.')
          expect(err.message).to.include('Unsuccessful')
        }
      })

    })

  })

})