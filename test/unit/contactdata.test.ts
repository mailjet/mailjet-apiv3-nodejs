import nock from 'nock';
import { expect } from 'chai';
import Mailjet, { Client, Request } from '../../lib/index';
import { ClientParams } from '../../lib/client/Client';

describe('Unit ContactData PUT request', () => {
  const API_MAILJET_URL = `${Request.protocol}${Client.config.host}`;
  const putUrl = `/${Client.config.version}/REST/contactdata/111`;
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
        ID: 1,
        ContactID: 111,
        Data: [
          { Name: 'first_name', Value: 'John' },
        ],
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

  it('should work with Name/Value pairs for request data', async () => {
    api.put(putUrl).reply(200, () => (expectedResponse));

    const result = await mailjet
      .put('contactdata', { version: 'v3' })
      .id(111)
      .request({
        Data: [
          { Name: 'first_name', Value: 'John' },
        ],
      });

    expect(result.body).to.eql(expectedResponse);
  });

  it('should work with stringified body', async () => {
    api.put(putUrl).reply(200, () => (expectedResponse));

    const result = await mailjet
      .put('contactdata', { version: 'v3' })
      .id(111)
      .request(JSON.stringify({
        Data: [
          { Name: 'first_name', Value: 'John' },
        ],
      }));

    expect(result.body).to.eql(expectedResponse);
  });

  it('should throw an error if body is empty', async () => {
    let error = null;
    try {
      await mailjet
        .put('contactdata', { version: 'v3' })
        .id(111)
        .request({});
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"contactdata" PUT request expects request body to be not empty object');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });

  it('should throw an error if "Data" property is missing', async () => {
    let error = null;
    try {
      await mailjet
        .put('contactdata', { version: 'v3' })
        .id(111)
        .request({
          firstName: 'John',
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"contactdata" PUT request expects request body to contain a "Data" property');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });

  it('should throw an error if "Data" is not an array', async () => {
    let error = null;
    try {
      await mailjet
        .put('contactdata', { version: 'v3' })
        .id(111)
        .request({
          Data: { firstName: 'John' },
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty('message', '"contactdata" PUT request expects "Data" property to be an array');
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });

  it('should throw an error if "Data" entries use raw property keys instead of Name/Value pairs', async () => {
    let error = null;
    try {
      await mailjet
        .put('contactdata', { version: 'v3' })
        .id(111)
        .request({
          // The most common mistake: sending property key/value pairs directly
          // instead of { Name, Value } objects, which the Mailjet API rejects
          // with a confusing "Invalid key name" error.
          Data: [
            { firstName: 'John', lastName: 'Smith' },
          ],
        });
    } catch (err) {
      error = err;
      expect(error).to.have.ownProperty(
        'message',
        '"contactdata" PUT request expects "Data" to be an array of objects with "Name" and "Value" keys, '
        + 'e.g. { Data: [{ Name: "first_name", Value: "John" }] }. '
        + 'See https://dev.mailjet.com/email/reference/contacts/contact-properties/',
      );
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).to.be.not.null;
    }
  });
});
