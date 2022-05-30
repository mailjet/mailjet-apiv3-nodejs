define(function () {
  return (MailjetClient) => {
    const form = document.querySelector('form');

    form.onsubmit = (event) => {
      event.preventDefault();

      const elements = event.target.elements;
      const apiKey = elements['api-key'];
      const apiSecret = elements['api-secret'];

      if (!apiKey.value) {
        const errorMessage = 'API key is required'

        alert(errorMessage)
        throw new Error(errorMessage)
      }

      if (!apiSecret.value) {
        const errorMessage = 'API secret is required'

        alert(errorMessage)
        throw new Error(errorMessage)
      }

      console.log(`init MailjetClient with KEY: "${apiKey.value}" and SECRET: "${apiSecret.value}"`)
      window.mailjet = MailjetClient.apiConnect(
        apiKey.value,
        apiSecret.value
      )

      apiKey.value = ''
      apiSecret.value = ''
    }
  }
})
