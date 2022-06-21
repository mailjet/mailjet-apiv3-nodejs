/*external modules*/
import { useMemo, useState } from 'react';
import Mailjet from 'node-mailjet'
/*components*/
import Credentials from '../../components/Credentials/Credentials'
import Example from '../../components/Example/Example';
/*styles*/
import './Home.css';

// // TODO: hack for the proxy
// const proxyUrl = 'http://localhost:3100'
// const originalBuildFullUrl = Mailjet.Request.prototype.buildFullUrl;
// Mailjet.Request.prototype.buildFullUrl = function () {
//   const url = originalBuildFullUrl.call(this);
//   return url.replace(
//       `${Mailjet.Request.protocol}${Mailjet.config.host}`,
//       proxyUrl
//   )
// }

const examples = [
  {
    title: '1. Get detailed information on all processed messages',
    link: {
      title: 'GET /message',
      href: 'https://dev.mailjet.com/email/reference/messages/index.html#v3_get_message'
    },
    description: 'Get a list of messages with specific information on the type of content, tracking, sending and delivery.',
    requestResource: 'message'
  },
  {
    title: '2. Get a list of all contacts',
    link: {
      title: 'GET /contact',
      href: 'https://dev.mailjet.com/email/reference/contacts/contact/#v3_get_contact'
    },
    description: 'Retrieve a list of all contacts. Includes information about contact status and creation / activity timestamps.',
    requestResource: 'contact'
  },
  {
    title: '3. Retrieve general details for all contact lists',
    link: {
      title: 'GET /contactslist',
      href: 'https://dev.mailjet.com/email/reference/contacts/contact-list/#v3_get_contactslist'
    },
    description: 'Retrieve details for all contact lists - name, subscriber count, creation timestamp, deletion status.',
    requestResource: 'contactslist'
  },
  {
    title: '4. Get all email templates',
    link: {
      title: 'GET /template',
      href: 'https://dev.mailjet.com/email/reference/templates/#v3_get_template'
    },
    description: 'Retrieve a list of all templates and their configuration settings.',
    requestResource: 'template'
  },
  {
    title: '5. Get a list of all click events',
    link: {
      title: 'GET /clickstatistics',
      href: 'https://dev.mailjet.com/email/reference/message-events/#v3_get_clickstatistics'
    },
    description: 'Retrieve a list of all click events and details about them - message and contact IDs, timestamp, URL and click delay.',
    requestResource: 'clickstatistics'
  },
  {
    title: '6. Get a list of all open events',
    link: {
      title: 'GET /openinformation',
      href: 'https://dev.mailjet.com/email/reference/message-events/#v3_get_openinformation'
    },
    description: 'Retrieve a list of all open events and details about them - message, campaign and contact IDs, timestamp etc.',
    requestResource: 'openinformation'
  }
]

function Home() {
  const [credentials, setCredentials] = useState({ key: null, secret: null });

  const mailjet = useMemo(
    () => {
      if(credentials.key && credentials.secret) {
        return Mailjet.apiConnect(credentials.key, credentials.secret)
      }

      return null;
    },
    [credentials.key, credentials.secret]
  )

  return (
    <section className='app'>
      <header className='head'>Basic API</header>
      <Credentials setCredentials={setCredentials} />
      <div className='examples'>
        <p className='examples-header'>Examples:</p>
        {
          mailjet
            ? examples.map(exampleData => {
                return (
                  <Example
                    {...exampleData}
                    key={exampleData.title}
                    request={(data) => mailjet.get(exampleData.requestResource).request(data)}
                  />
                )
              })
            : <span style={{ fontWeight: 'bold', color: 'red' }}>You need enter credentials before!</span>
        }
      </div>
    </section>
  );
}

export default Home;
