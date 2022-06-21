/*external modules*/
import { expect } from 'chai';
/*types*/
import { IRequestConfig } from '../../lib/request/IRequest';
/*utils*/
/*lib*/
import Mailjet, { Request } from '../../lib/index';
/*other*/

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Mailjet.apiConnect();
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_KEY is required');
      }
    });

    it('no api secret provided', () => {
      try {
        const config: Partial<IRequestConfig> = { host: 'api.mailjet.com' };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Mailjet.apiConnect(API_PUBLIC_KEY, null, { config });
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_SECRET is required');
      }
    });

    it('no api api token provided', () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Mailjet.smsConnect(null);
      } catch (error) {
        expect(error.message).to.equal('Mailjet API_TOKEN is required');
      }
    });
  });

  describe('invalid token', () => {
    const v4Config: IRequestConfig = {
      host: 'api.mailjet.com',
      version: 'v4',
      output: 'json',
    };

    let v4Client: Mailjet;
    before(() => {
      v4Client = Mailjet.smsConnect(API_TOKEN, { config: v4Config });
    });

    describe('get', function () {
      this.timeout(3500);

      let smsGet: Request;
      before(() => {
        smsGet = v4Client.get('sms');
      });

      it('check error message', async () => {
        try {
          const response = await smsGet
            .request(
              {
                params: {
                  FromTS: +new Date(),
                  ToTS: +new Date(),
                },
              },
            );

          expect(response.body).to.be.a('object');
        } catch (err) {
          expect(err.ErrorMessage).to.equal(AUTH_ERROR_MESSAGE);
        }
      });

      it('check status code', async () => {
        try {
          const response = await smsGet
            .request<{ Data: unknown[] }>(
              {
                params: {
                  FromTS: +new Date(),
                  ToTS: +new Date(),
                },
              },
            );

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.statusCode).to.equal(AUTH_ERROR_CODE);
        }
      });

      it('check response body is not null on error', async () => {
        try {
          const response = await smsGet
            .request<{ Data: unknown[] }>(
              {
                params: {
                  FromTS: +new Date(),
                  ToTS: +new Date(),
                },
              },
            );

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.response).to.not.equal(null);
        }
      });

      it('check error identitfier is not empty string', async () => {
        try {
          const response = await smsGet
            .request<{ Data: unknown[] }>(
              {
                params: {
                  FromTS: +new Date(),
                  ToTS: +new Date(),
                },
              },
            );

          expect(response.body).to.be.a('object');
          expect(response.body.Data.length).to.equal(0);
        } catch (err) {
          expect(err.ErrorIdentifier).to.not.equal('');
        }
      });
    });

    describe('invalid public/private keys', () => {
      const v3Config: IRequestConfig = {
        host: 'api.mailjet.com',
        version: 'v3',
        output: 'json',
      };

      let v3Client: Mailjet;
      before(() => {
        v3Client = Mailjet.apiConnect(API_PUBLIC_KEY, API_PRIVATE_KEY, { config: v3Config });
      });

      describe('get', function () {
        this.timeout(3500);

        let contact: Request;
        before(() => {
          contact = v3Client.get('contact');
        });

        it('check v3 error message', async () => {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.status).to.equal(200);
          } catch (err) {
            expect(err.statusText).to.equal(AUTH_V3_ERROR_MESSAGE);
          }
        });

        it('check v3 error status code', async () => {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.status).to.equal(200);
          } catch (err) {
            expect(err.statusCode).to.equal(AUTH_ERROR_CODE);
          }
        });

        it('check v3 response body is not null on error', async () => {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.status).to.equal(200);
          } catch (err) {
            expect(err.response).to.not.equal(null);
          }
        });

        it('check v3 error identitfier is not empty string', async () => {
          try {
            const response = await contact.request();

            expect(response.body).to.be.a('object');
            expect(response.response.status).to.equal(200);
          } catch (err) {
            expect(err.ErrorIdentifier).to.not.equal('');
          }
        });
      });
    });
  });
});
