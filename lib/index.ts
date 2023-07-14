/*external modules*/
/*utils*/
/*types*/
import HttpMethods from './request/HttpMethods';
/*lib*/
import Request from './request/index';
import Client from './client/index';
/*other*/

class Mailjet extends Client {
  static Request = Request;
  static HttpMethods = HttpMethods;
  static Client = Client;
}

export * from './types/api';
export {
  Mailjet, Client, Request, HttpMethods,
};
