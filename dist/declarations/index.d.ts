import HttpMethods from './request/HttpMethods';
import Request from './request/index';
import Client from './client/index';
declare class Mailjet extends Client {
    static Request: typeof Request;
    static HttpMethods: typeof HttpMethods;
}
export { Client, Request, HttpMethods };
export default Mailjet;
