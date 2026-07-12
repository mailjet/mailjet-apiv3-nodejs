import { expect } from 'chai';
import Mailjet, { Client, Request, HttpMethods } from '../../lib/index';

describe('Unit Mailjet entrypoint', () => {
  it('should be have static properties Client, Request and HttpMethods', () => {
    expect(Mailjet).to.have.ownProperty('Client', Client);
    expect(Mailjet).to.have.ownProperty('Request', Request);
    expect(Mailjet).to.have.ownProperty('HttpMethods', HttpMethods);
  });

  it('should self-reference "default" so `import Mailjet from "node-mailjet"` works without CJS/ESM interop', () => {
    // The release build bundles this module with webpack UMD `library.export: 'default'`,
    // so `require('node-mailjet')` resolves to this class directly, not to
    // `{ default: Mailjet, ... }`. Consumers compiling `import Mailjet from 'node-mailjet'`
    // without esModuleInterop emit `require('node-mailjet').default`, which needs this
    // self-reference to resolve to the class instead of `undefined`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((Mailjet as any).default).to.equal(Mailjet);
  });

  it('should be callable via the self-referenced "default" the same way as the class itself', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DefaultMailjet = (Mailjet as any).default;

    expect(DefaultMailjet).itself.to.respondsTo('apiConnect');
    expect(DefaultMailjet.apiConnect('key', 'secret')).to.be.an.instanceOf(Client);
  });
});
