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

// The release build (see webpack/webpack.common.config.js) bundles this module with
// UMD `library.export: 'default'`, so `require('node-mailjet')` resolves to this class
// directly rather than to `{ default: Mailjet, ... }`. Consumers whose TS/bundler config
// has no CJS/ESM default-export interop (e.g. esModuleInterop: false) compile
// `import Mailjet from 'node-mailjet'` to `require('node-mailjet').default`, which would
// otherwise be undefined. Self-referencing `.default` keeps that path working too,
// mirroring how axios (`axios.default = axios`) solves the same problem.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Mailjet as any).default = Mailjet;

export * from './types/api';
export { Client, Request, HttpMethods };
export default Mailjet;
