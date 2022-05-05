/*external modules*/
const chai = require('chai');
/*lib*/
const { MailjetClient: Mailjet } = require('../../mailjet-client');
/*other*/

const expect = chai.expect;

describe('Basic Error Handling', () => {
  const API_TOKEN = process.env.MJ_API_TOKEN || '#invalidToken';
  const API_PUBLIC_KEY = process.env.MJ_APIKEY_PUBLIC || '#invalidPublicKey';
  const API_PRIVATE_KEY = process.env.MJ_APIKEY_PRIVATE || '#invalidPrivateKey';

  const AUTH_ERROR_CODE = 401;
  const AUTH_V3_ERROR_MESSAGE = 'Unauthorized';
  const AUTH_ERROR_MESSAGE = 'API key authentication/authorization failure. You may be unauthorized to access the API or your API key may be expired. Visit API keys management section to check your keys.';

  describe('no auth data provided', () => {

    it('no api key provided', () => {
      try {
        Mailjet.connect();
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_KEY is required');
      }
    });

    it('no api secret provided', () => {
      try {
        Mailjet.connect(null, { url: 'api.mailjet.com' });
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_TOKEN is required');
      }
    });

    it('no api api token provided', () => {
      try {
        Mailjet.connect('1234');
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_SECRET is required');
      }
    });

  });

  describe('invalid token', () => {
    const v4Config = {
      'url': 'api.mailjet.com',
      'version': 'v4',
      'output': 'json',
      'perform_api_call': true
    };

    let v4Client;
    before(function () {
      v4Client = Mailjet.connect(API_TOKEN, v4Config);
    });

    describe('get', function () {
      this.timeout(3500);

      let smsGet;
      before(function () {
        smsGet = v4Client.get('sms');
      });

      it('check error message', async () => {
        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date });

          expect(response.body).to.be.a('object');
        } catch (err) {
          expect(err.ErrorMessage).to.equal(AUTH_ERROR_MESSAGE);
        }
      });

      it('check status code', async () => {
        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date });

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.statusCode).to.equal(AUTH_ERROR_CODE);
        }
      });

      it('check response body is not null on error', async () => {
        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date });

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.response).to.not.equal(null);
        }
      });

      it('check error identitfier is not empty string', async () => {
        try {
          const response = await smsGet
            .request({ FromTS: +new Date, ToTS: +new Date });

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.ErrorIdentifier).to.not.equal('');
        }
      });

    });

    describe('invalid public/private keys', () => {
      const v3Config = {
        url: 'api.mailjet.com',
        version: 'v3',
        output: 'json',
        perform_api_call: true
      };

      let v3Client;
      before(function () {
        v3Client = Mailjet.connect(API_PUBLIC_KEY, API_PRIVATE_KEY, v3Config);
      });

      describe('get', function () {
        this.timeout(3500);

        let contact;
        before(function () {
          contact = v3Client.get('contact');
        });

        it('check v3 error message', async () => {
          try {
            const response = await contact.request();

            expect(response.body).should.be.a('object');
            expect(response.response.statusCode).to.equal(200);
          } catch (err) {
            expect(err.ErrorMessage).to.equal(AUTH_V3_ERROR_MESSAGE);
          }
        });

        it('check v3 error status code', async () => {
          try {
            const response = await contact.request();

            expect(response.body).should.be.a('object');
            expect(response.response.statusCode).to.equal(200);
          } catch (err) {
            expect(err.statusCode).to.equal(AUTH_ERROR_CODE);
          }
        });

        it('check v3 response body is not null on error', async () => {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.statusCode).to.equal(200);
          } catch (err) {
            expect(err.response).to.not.equal(null);
          }
        });

        it('check v3 error identitfier is not empty string', async () =>  {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.statusCode).to.equal(200);
          } catch (err) {
            expect(err.ErrorIdentifier).to.not.equal('');
          }
        });

      });

    });

  });

});