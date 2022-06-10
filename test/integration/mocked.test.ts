/*external modules*/
import nock from 'nock';
import { expect } from 'chai';
/*types*/
/*utils*/
import { isUndefined } from '@utils/index';
/*lib*/
import Mailjet, { Request } from '../../lib/index';
/*other*/

describe('Mocked API calls', () => {
  const API_KEY = process.env.MJ_APIKEY_PUBLIC;
  const API_SECRET = process.env.MJ_APIKEY_PRIVATE;

  const REQUEST_TIMEOUT = 10;

  let client: Mailjet;
  before(function () {
    if (isUndefined(API_KEY) || isUndefined(API_SECRET)) {
      this.skip();
    } else {
      /* Set a very short timeout */
      client = Mailjet.apiConnect(API_KEY, API_SECRET, {
        config: {
          version: 'v3',
        },
        options: {
          timeout: REQUEST_TIMEOUT,
        },
      });
    }
  });

  describe('method request', () => {
    describe('get', () => {
      let contact: Request;
      before(() => {
        contact = client.get('contact');
      });

      it('calls the contact resource instance and the request times out', async () => {
        /* Simulate a delayed response */
        nock('https://api.mailjet.com')
          .get('/v3/REST/contact')
          .delayConnection(1000)
          .reply(200, {});

        try {
          const result = await contact.request({});

          // We want it to raise an error if it gets here
          expect(result).to.equal(undefined);
        } catch (err) {
          expect(err.ErrorMessage).to.equal('Response timeout of 10ms exceeded');
          expect(err.code).to.equal('ECONNABORTED');
          expect(err.errno).to.equal('ETIMEDOUT');
          expect(err.timeout).to.equal(REQUEST_TIMEOUT);
          expect(err.statusCode).to.equal(null);
          expect(err.response).to.equal(null);
        } finally {
          nock.cleanAll();
        }
      });
    });
  });
});
