/*external modules*/
import qs from 'qs';
import { expect } from 'chai';
/*utils*/
import { isUndefined } from '../../lib/utils';
/*types*/
import { TObject } from '../../lib/types';
import {
  RequestConfig,
  RequestOptions,
  RequestData,
  RequestParams,
} from '../../lib/request/Request';
/*lib*/
import { Mailjet, Request, LibraryLocalResponse } from '../../lib';

describe('API Basic Usage', () => {
  const API_KEY = process.env.MJ_APIKEY_PUBLIC;
  const API_SECRET = process.env.MJ_APIKEY_PRIVATE;

  let client: Mailjet;
  before(function () {
    if (isUndefined(API_KEY) || isUndefined(API_SECRET)) {
      this.skip();
    } else {
      const emailConfig: Partial<RequestConfig> = {
        version: 'v3',
      };
      client = Mailjet.apiConnect(API_KEY, API_SECRET, { config: emailConfig });
    }
  });

  describe('Connection', () => {
    it('creates an instance of the client', () => {
      [
        new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET }),
        Mailjet.apiConnect(API_KEY as string, API_SECRET as string),
      ].forEach((connectionType) => {
        expect(`${connectionType.getAPIKey()}${connectionType.getAPISecret()}`).to.equal(`${API_KEY}${API_SECRET}`);
      });
    });

    it('creates an instance of the client with options', () => {
      const options: RequestOptions = {
        proxy: {
          protocol: 'http',
          host: 'localhost',
          port: 3128,
        },
        timeout: 10000,
      };

      [
        new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET, options }),
        Mailjet.apiConnect(API_KEY as string, API_SECRET as string, { options }),
      ].forEach((connection) => {
        expect(connection).to.have.property('apiKey', API_KEY);
        expect(connection).to.have.property('apiSecret', API_SECRET);
        expect(connection.getOptions()).to.have.property('timeout', 10000);
        expect(connection.getOptions())
          .to.have.property('proxy')
          .that.eql(options.proxy)
          .but.is.not.equal(options.proxy);
      });
    });
  });

  describe('Method request', () => {
    describe('get', function () {
      this.timeout(3500);

      let contact: Request;
      before(() => {
        contact = client.get('contact');
      });

      it('calls the contact resource instance with no parameters', async () => {
        try {
          const result = await contact.request();

          expect(result.body).to.be.a('object');
          expect(result.response.status).to.equal(200);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });

      it('calls the contact resource instance with parameters', async () => {
        try {
          const result = await contact.request(
            {
              Name: 'Guillaume Badi',
            },
          );

          expect(result.body).to.be.a('object');
          expect(result.response.status).to.be.within(200, 201);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });

      it('calls the contact resource instance with empty parameters', async () => {
        try {
          const result = await contact.request({});

          expect(result.body).to.be.a('object');
          expect(result.response.status).to.be.within(200, 201);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });
    });

    describe('post', function () {
      this.timeout(3500);

      const INACTIVE_ERROR_MESSAGE = 'There is an already existing inactive sender with the same email. '
        + 'You can use "validate" action in order to activate it.';

      let sender: Request;
      before(() => {
        sender = client.post('sender');
      });

      it('calls the sender resource instance with valid parameters', async () => {
        try {
          const result = await sender.request(
            {
              email: 'gbadi@mailjet.com',
            },
          );

          expect(result.response.status).to.equal(201);
        } catch (err) {
          // if it fails because the sender already exist. should be 400
          expect(err.ErrorMessage).to.equal(INACTIVE_ERROR_MESSAGE);
          expect(err.statusCode).to.equal(400);
        }
      });

      it('calls the sender resource instance with no parameters', async () => {
        try {
          await sender.request();
        } catch (err) {
          expect(err.statusCode).to.equal(400);
        }
      });

      it('calls the sender resource instance with invalid parameters', async () => {
        try {
          await sender.request(
            {
              Name: 'Guillaume Badi',
            },
          );
        } catch (err) {
          expect(err.statusCode).to.equal(400);
        }
      });

      it('calls the sender resource with empty parameters', async () => {
        try {
          await sender.request({});
        } catch (err) {
          expect(err.statusCode).to.equal(400);
        }
      });
    });
  });

  describe('Advanced API Calls', () => {
    const FILE = 'FILE';
    const EMAIL = 'test@mailjet.com';
    const EMAIL2 = 'test2@mailjet.com';
    const NAME = 'name';
    const SUBJECT = 'subject';
    const TEXT_PART = 'text';
    const VAR = { Key1: 'Value1', Key2: 'Value2' };
    const SIMPLE_RECIPIENTS = [{ email: EMAIL }, { email: EMAIL2 }];
    const UNIQUE_RECIPIENT = [{ email: EMAIL }];
    const RECIPIENTS_NAME = [{ email: EMAIL, name: NAME }, { email: EMAIL2, name: NAME }];
    const RECIPIENTS_VARS = [{ email: EMAIL, vars: VAR }];

    type TResult = LibraryLocalResponse<string | TObject.UnknownRec, TObject.UnknownRec>;
    class Example {
      private fn: Request;
      private payload?: { data?: RequestData; params?: RequestParams; };

      constructor(fn: Request, payload?: { data?: RequestData; params?: RequestParams; }) {
        this.fn = fn;
        this.payload = payload;
      }

      private buildUrl(result: TResult) {
        const url = result.url.replace(/\\/g, '/');
        const params = result.params && Object.keys(result.params).length > 0 ? `?${qs.stringify(result.params)}` : '';
        const body = JSON.stringify(result.body).match(/\S+/g)?.join('');

        return `${url}${params} ${body}`;
      }

      public async call() {
        const result = await this
          .fn
          .request(this.payload?.data, this.payload?.params, false);

        return this.buildUrl(result);
      }
    }

    const EXAMPLES_SET: Array<Example> = [];
    const EXPECTED_SET = [
      'https://api.mailjet.com/v3/REST/contact {}',
      'https://api.mailjet.com/v3/REST/contact/2 {}',
      'https://api.mailjet.com/v3/REST/contact/2 {}',
      'https://api.mailjet.com/v3/REST/contact/3/getcontactslist {}',
      'https://api.mailjet.com/v3/REST/contact?countOnly=1 {}',
      'https://api.mailjet.com/v3/REST/contact?limit=2 {}',
      'https://api.mailjet.com/v3/REST/contact?offset=233 {}',
      'https://api.mailjet.com/v3/REST/contact?contatctList=34 {}',
      'https://api.mailjet.com/v3/REST/contactslist/34/managecontact {"email":"test@mailjet.com"}',
      'https://api.mailjet.com/v3/DATA/contactslist/34/csvdata/text:plain "FILE"',
      'https://api.mailjet.com/v3/REST/newsletter?CountOnly=1 {}',
      'https://api.mailjet.com/v3/DATA/batchjob/csverror/text:csv {}',
      'https://api.mailjet.com/v3/REST/contact {"email":"test@mailjet.com"}',
      'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com"}]}',
      'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com"},{"email":"test2@mailjet.com"}]}',
      'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com","name":"name"},{"email":"test2@mailjet.com","name":"name"}]}',
      'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com","vars":{"Key1":"Value1","Key2":"Value2"}}]}',
    ];

    let apiClient: Mailjet;
    before(() => {
      const emailConfig: Partial<RequestConfig> = {
        version: 'v3',
      };
      apiClient = new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET, config: emailConfig });

      EXAMPLES_SET.push(
        ...[
          new Example(apiClient.get('contact')),
          new Example(apiClient.get('contact').id(2)),
          new Example(apiClient.get('contact/2')),
          new Example(apiClient.get('contact').id(3).action('getcontactslist')),
          new Example(apiClient.get('contact'), { params: { countOnly: 1 } }),
          new Example(apiClient.get('contact'), { params: { limit: 2 } }),
          new Example(apiClient.get('contact'), { params: { offset: 233 } }),
          new Example(apiClient.get('contact'), { params: { contatctList: 34 } }),
          new Example(apiClient.post('contactslist').id(34).action('managecontact'), { data: { email: EMAIL } }),
          new Example(apiClient.post('contactslist').id(34).action('csvdata'), { data: FILE }),
          new Example(apiClient.get('newsletter'), { params: { CountOnly: 1 } }),
          new Example(apiClient.get('batchjob').action('csverror')),
          new Example(apiClient.post('contact'), { data: { email: EMAIL } }),
          new Example(apiClient.post('send'), {
            data: {
              FromName: NAME,
              FromEmail: EMAIL,
              Subject: SUBJECT,
              'Text-Part': TEXT_PART,
              Recipients: UNIQUE_RECIPIENT,
            },
          }),
          new Example(apiClient.post('send'), {
            data: {
              FromName: NAME,
              FromEmail: EMAIL,
              Subject: SUBJECT,
              'Text-Part': TEXT_PART,
              Recipients: SIMPLE_RECIPIENTS,
            },
          }),
          new Example(apiClient.post('send'), {
            data: {
              FromName: NAME,
              FromEmail: EMAIL,
              Subject: SUBJECT,
              'Text-Part': TEXT_PART,
              Recipients: RECIPIENTS_NAME,
            },
          }),
          new Example(apiClient.post('send'), {
            data: {
              FromName: NAME,
              FromEmail: EMAIL,
              Subject: SUBJECT,
              'Text-Part': TEXT_PART,
              Recipients: RECIPIENTS_VARS,
            },
          }),
        ],
      );
    });

    EXPECTED_SET.forEach((test, index) => {
      it(`should output: "${test}"`, async () => {
        const result = await EXAMPLES_SET[index].call();

        expect(result).to.equal(test);
      });
    });
  });
});
