// Hand-written ESM entrypoint, copied into dist/mailjet.mjs by scripts/PreparePackage.js
// (hence the "./mailjet.node.js" import path, valid once this file sits next to it).
//
// The Node/webpack CJS build (mailjet.node.js) is a UMD bundle, so its named exports
// (Client, Request, HttpMethods, and the runtime-bearing API namespaces like Message,
// BulkContactManagement, ...) are not statically analyzable by cjs-module-lexer - the
// mechanism native ESM uses to expose named exports from a CommonJS module. Without
// this file, `import { Client } from 'node-mailjet'` fails under native ESM/ts-node/esm
// with "SyntaxError: Named export 'Client' not found" (see issue #281), even though the
// default import and `require()` both work fine.
//
// This file is real ESM syntax, so its `export` statements are always statically visible
// to Node and to bundlers - no lexer heuristics involved.
// eslint-disable-next-line import/no-unresolved, import/extensions
import Mailjet from './mailjet.node.js';

const {
  Client, Request, HttpMethods,
  // Namespaces that carry runtime enums (see lib/index.ts for why these, and not the
  // purely type-only namespaces, need a runtime binding here) - keeps
  // `import { Message } from 'node-mailjet'; Message.MessageState` working (see issue #242).
  Common, DraftCampaign, SentCampaign, BulkContactManagement, ContactProperties,
  Sender, DNS, Message, SendEmailV3_1, Webhook, Segmentation, Statistic,
  APIKeyConfiguration, Template,
} = Mailjet;

export default Mailjet;
export {
  Client, Request, HttpMethods,
  Common, DraftCampaign, SentCampaign, BulkContactManagement, ContactProperties,
  Sender, DNS, Message, SendEmailV3_1, Webhook, Segmentation, Statistic,
  APIKeyConfiguration, Template,
};
