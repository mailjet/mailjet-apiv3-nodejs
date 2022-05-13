/*external modules*/
import chai from 'chai';
/*lib*/
import Mailjet from '../../lib/index.js';
/*utils*/
import { isUndefined } from '../../lib/utils/index.js';
/*other*/

const expect = chai.expect;

describe('API Basic Usage', () => {
  const API_KEY = process.env.MJ_APIKEY_PUBLIC;
  const API_SECRET = process.env.MJ_APIKEY_PRIVATE;

  let client;
  before(function () {
    if(isUndefined(API_KEY) || isUndefined(API_SECRET)) {
      this.skip();
    } else {
      const emailConfig = {
        version: 'v3'
      };
      client = Mailjet.apiConnect(API_KEY, API_SECRET, { config: emailConfig });
    }
  });

  describe('Connection', () => {

    it('creates an instance of the client', () => {
      [
        new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET }),
        Mailjet.apiConnect(API_KEY, API_SECRET)
      ].forEach(connectionType => {
        expect(`${connectionType.apiKey}${connectionType.apiSecret}`).to.equal(`${API_KEY}${API_SECRET}`);
      });
    });

    it('creates an instance of the client with options', () => {
      const options = {
        proxyUrl: 'http://localhost:3128',
        timeout: 10000
      };

      [
        new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET, options }),
        Mailjet.apiConnect(API_KEY, API_SECRET, { options })
      ].forEach(connection => {
        expect(connection).to.have.property('apiKey', API_KEY);
        expect(connection).to.have.property('apiSecret', API_SECRET);
        expect(connection.options).to.have.property('proxyUrl', options.proxyUrl);
        expect(connection.options).to.have.property('timeout', 10000);
      });
    });

  });

  describe('Method request', () => {

    describe('get', function () {
      this.timeout(3500);

      let contact;
      before(() => {
        contact = client.get('contact');
      });

      it('calls the contact resource instance with no parameters', async () => {
        try {
          const result = await contact.request();

          expect(result.body).to.be.a('object');
          expect(result.response.statusCode).to.equal(200);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });

      it('calls the contact resource instance with parameters', async () => {
        try {
          const result = await contact.request({ Name: 'Guillaume Badi' });

          expect(result.body).to.be.a('object');
          expect(result.response.statusCode).to.be.within(200, 201);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });

      it('calls the contact resource instance with empty parameters', async () => {
        try {
          const result = await contact.request({});

          expect(result.body).to.be.a('object');
          expect(result.response.statusCode).to.be.within(200, 201);
        } catch (err) {
          // We want it to raise an error if it gets here
          expect(err).to.equal(undefined);
        }
      });

    });

    describe('post', function () {
      this.timeout(3500);

      const INACTIVE_ERROR_MESSAGE = 'There is an already existing inactive sender with the same email. ' +
        'You can use "validate" action in order to activate it.';

      let sender;
      before(function () {
        sender = client.post('sender');
      });

      it('calls the sender resource instance with valid parameters', async () => {
        try {
          const result = await sender.request({ email: 'gbadi@mailjet.com' });

          expect(result.response.statusCode).to.equal(201);
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
          await sender.request({ Name: 'Guillaume Badi' });
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
    const VAR = {'Key1': 'Value1', 'Key2': 'Value2'};
    const SIMPLE_RECIPIENTS = [{email: EMAIL}, {email: EMAIL2}];
    const UNIQUE_RECIPIENT = [{email: EMAIL}];
    const RECIPIENTS_NAME = [{email: EMAIL, name: NAME}, {email: EMAIL2, name: NAME}];
    const RECIPIENTS_VARS = [{email: EMAIL, vars: VAR}];

    const EXAMPLES_SET = [];
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
      'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com","vars":{"Key1":"Value1","Key2":"Value2"}}]}'
    ];

    function Example (fn, payload) {
      const self = this;

      this.fn = fn;
      this.payload = payload;
      this.format = function (obj) {
        return JSON.stringify(obj).match(/\S+/g).join('');
      };
      this.call = async function () {
        const result = await this.fn.request(this.payload);
        return result.url.replace(/\\/g, '/') + ' ' + self.format(result.body);
      };
    }

    let client;
    before(function () {
      const emailConfig = {
        version: 'v3',
        performAPICall: false
      };
      client = new Mailjet({ apiKey: API_KEY, apiSecret: API_SECRET, config: emailConfig });

      EXAMPLES_SET.push(
        ...[
          new Example(client.get('contact')),
          new Example(client.get('contact').id(2)),
          new Example(client.get('contact/2')),
          new Example(client.get('contact').id(3).action('getcontactslist')),
          new Example(client.get('contact'), { countOnly: 1 }),
          new Example(client.get('contact'), { limit: 2 }),
          new Example(client.get('contact'), { offset: 233 }),
          new Example(client.get('contact'), { contatctList: 34 }),
          new Example(client.post('contactslist').id(34).action('managecontact'), { email: EMAIL }),
          new Example(client.post('contactslist').id(34).action('csvdata'), FILE),
          new Example(client.get('newsletter'), { filters: { CountOnly: 1 } }),
          new Example(client.get('batchjob').action('csverror')),
          new Example(client.post('contact'), { email: EMAIL }),
          new Example(client.post('send'), {
            'FromName': NAME,
            'FromEmail': EMAIL,
            'Subject': SUBJECT,
            'Text-Part': TEXT_PART,
            'Recipients': UNIQUE_RECIPIENT
          }),
          new Example(client.post('send'), {
            'FromName': NAME,
            'FromEmail': EMAIL,
            'Subject': SUBJECT,
            'Text-Part': TEXT_PART,
            'Recipients': SIMPLE_RECIPIENTS
          }),
          new Example(client.post('send'), {
            'FromName': NAME,
            'FromEmail': EMAIL,
            'Subject': SUBJECT,
            'Text-Part': TEXT_PART,
            'Recipients': RECIPIENTS_NAME
          }),
          new Example(client.post('send'), {
            'FromName': NAME,
            'FromEmail': EMAIL,
            'Subject': SUBJECT,
            'Text-Part': TEXT_PART,
            'Recipients': RECIPIENTS_VARS
          })
        ]
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