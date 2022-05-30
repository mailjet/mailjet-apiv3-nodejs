define(['bindToExample'], bindToExample => {
  return (mainElement) => {
    const example = bindToExample(mainElement);

    example.setOnRequest(() => {
      if(!window.mailjet) {
        const errorMessage = 'You need set credentials before request!'

        alert(errorMessage);
        throw new Error(errorMessage);
      }

      const filters = example.getFilters();
      window.mailjet
        .get('template')
        .request({ filters })
        .then(response => {
          console.log('response => ', response);
          example.setText(
            JSON.stringify(response.body, null, 2)
          )
        })
        .catch(err => {
          console.log('response error => ', err);
          example.setText(err)
        })
    })
  }
})
