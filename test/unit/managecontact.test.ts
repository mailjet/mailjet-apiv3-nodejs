import nock from 'nock';
import { expect } from 'chai';
import Mailjet, { Client, Request } from '../../lib/index';
import { ClientParams } from '../../lib/client/Client';

describe('Unit ManageContact action', () => {
  const API_MAILJET_URL = `${Request.protocol}${Client.config.host}`;
  const postUrl = `/${Client.config.version}/REST/contactslist/111/managecontact`;
  const params: ClientParams = {
    apiKey: 'key',
    apiSecret: 'secret',
    config: {
      version: 'v3',
    },
  };

  const expectedResponse = {
    Count: 1,
    Data: [
      {
        ContactID: 1,
        Email: 'test@test.com',
        Action: 'addnoforce',
        Name: 'Test name',
        Properties: {
          firstname: 'Test_first_name_upd',
          lastname: 'Test_last_name_upd',
        },
      },
    ],
    Total: 1,
  };

  let mailjet: Mailjet;
  let api: nock.Scope;

  beforeEach(() => {
    mailjet = new Mailjet(params);
    api = nock(API_MAILJET_URL);
  });

  afterEach(() => {
    api.done();
  });

  it('should work with simple object for request data', async () => {
    api.post(postUrl).reply(200, () => (expectedResponse));

    const mjNewContact = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(111)
      .action('managecontact')
      .request({
        Name: 'Test name',
        Properties: {
          FirstName: 'Test_first_name_upd',
          LastName: 'Test_last_name_upd',
        },
        Action: 'addnoforce',
        Email: 'test@test.com',
      });

    expect(mjNewContact.body).to.eql(expectedResponse);
  });

  it('should work with stringified object for request data', async () => {
    api.post(postUrl).reply(200, () => (expectedResponse));

    const mjNewContact = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(111)
      .action('managecontact')
      .request(JSON.stringify({
        Name: 'Test name',
        Properties: {
          FirstName: 'Test_first_name_upd',
          LastName: 'Test_last_name_upd',
        },
        Action: 'addnoforce',
        Email: 'test@test.com',
      }));

    expect(mjNewContact.body).to.eql(expectedResponse);
  });

  it('should throw an error if body is empty', async () => {
    let error = null;
    try {
      await mailjet
        .post('contactslist', { version: 'v3' })
        .id(111)
        .action('managecontact')
        .request({
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"managecontact" action expects request body to be not empty object');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });
  it('should throw an error if body is not valid json', async () => {
    let error = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const obj = { test: BigInt(12345678901234567890n) };

    try {
      await mailjet
        .post('contactslist', { version: 'v3' })
        .id(111)
        .action('managecontact')
        .request(obj);
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"managecontact" action expects request body to be valid JSON object');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });

  it('should throw an error if Properties are stringified', async () => {
    let error = null;
    try {
      await mailjet
        .post('contactslist', { version: 'v3' })
        .id(111)
        .action('managecontact')
        .request({
          Name: 'Test name',
          Properties: JSON.stringify({ // JSON.stringify at this level should lead to error
            FirstName: 'Test_first_name_upd',
            LastName: 'Test_last_name_upd',
          }),
          Action: 'addnoforce',
          Email: 'test@test.com',
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"managecontact" action expects Properties value to be an object');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });

  it('should throw an error if Properties object is not valid json', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const obj = { test: BigInt(12345678901234567890n) };

    let error = null;
    try {
      await mailjet
        .post('contactslist', { version: 'v3' })
        .id(111)
        .action('managecontact')
        .request({
          Name: 'Test name',
          Properties: obj,
          Action: 'addnoforce',
          Email: 'test@test.com',
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"managecontact" action expects request body to be valid JSON object');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });
});
