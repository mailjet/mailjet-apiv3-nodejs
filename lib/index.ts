/*external modules*/
/*utils*/
/*types*/
import HttpMethods from './request/HttpMethods';
import * as TypesApi from './types/api';
/*lib*/
import Request from './request/index';
import Client from './client/index';
/*other*/

class Mailjet extends Client {
  static Request = Request;
  static HttpMethods = HttpMethods;
  static Client = Client;
}

// The node UMD bundle (see webpack/webpack.common.config.js) uses `library.export: 'default'`,
// so `require('node-mailjet')` resolves to this class directly and every other named export
// (Message, BulkContactManagement, SendEmailV3_1, ...) is otherwise unreachable at runtime -
// `import { Message } from 'node-mailjet'; Message.MessageState` would be undefined even though
// it type-checks fine off the .d.ts (see issue #242). Re-attaching the runtime-bearing exports
// (namespaces containing enums; type-only namespaces contribute no keys here) as statics keeps
// them reachable through the same door as Client/Request/HttpMethods above.
Object.assign(Mailjet, TypesApi);

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
