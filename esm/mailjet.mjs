// Hand-written ESM entrypoint, copied into dist/mailjet.mjs by scripts/PreparePackage.js
// (hence the "./mailjet.node.js" import path, valid once this file sits next to it).
//
// The Node/webpack CJS build (mailjet.node.js) is a UMD bundle, so its named exports
// (Client, Request, HttpMethods) are not statically analyzable by cjs-module-lexer -
// the mechanism native ESM uses to expose named exports from a CommonJS module. Without
// this file, `import { Client } from 'node-mailjet'` fails under native ESM/ts-node/esm
// with "SyntaxError: Named export 'Client' not found" (see issue #281), even though the
// default import and `require()` both work fine.
//
// This file is real ESM syntax, so its `export` statements are always statically visible
// to Node and to bundlers - no lexer heuristics involved.
// eslint-disable-next-line import/no-unresolved, import/extensions
import Mailjet from './mailjet.node.js';

const { Client, Request, HttpMethods } = Mailjet;

export default Mailjet;
export { Client, Request, HttpMethods };
