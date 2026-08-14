import { expect } from 'chai';
import Mailjet, {
  Client, Request, HttpMethods,
  Message, BulkContactManagement, SendEmailV3_1,
} from '../../lib/index';

describe('Unit Mailjet entrypoint', () => {
  it('should be have static properties Client, Request and HttpMethods', () => {
    expect(Mailjet).to.have.ownProperty('Client', Client);
    expect(Mailjet).to.have.ownProperty('Request', Request);
    expect(Mailjet).to.have.ownProperty('HttpMethods', HttpMethods);
  });

  it('should statically expose runtime-bearing API namespaces (enums) on Mailjet', () => {
    // The release build bundles this module with webpack UMD `library.export: 'default'`,
    // so `require('node-mailjet')` resolves to the Mailjet class directly, and any named
    // export not attached to it (e.g. the `Message` namespace) is unreachable at runtime -
    // `import { Message } from 'node-mailjet'; Message.MessageState` would be `undefined`
    // even though it type-checks fine off the .d.ts (see issue #242). Namespaces that only
    // contain types/interfaces are erased by TS and never reach this object, so this only
    // covers namespaces that declare at least one enum.
    expect(Mailjet).to.have.ownProperty('Message', Message);
    expect(Mailjet).to.have.ownProperty('BulkContactManagement', BulkContactManagement);
    expect(Mailjet).to.have.ownProperty('SendEmailV3_1', SendEmailV3_1);

    expect(Message.MessageState.UserUnknown).to.equal(1);
    expect(BulkContactManagement.ManageContactsAction.AddForce).to.equal('addforce');
    expect(SendEmailV3_1.ResponseStatus.Success).to.equal('success');
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
