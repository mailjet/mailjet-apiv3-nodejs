define(function () {
  return (element) => {
    return {
      buttonElement: element.querySelector('button'),
      textareaElement: element.querySelector('textarea'),
      inputElement: element.querySelector('input'),
      getInnerInputById(id) {
        const input = element.querySelector('#' + id);
        return input;
      },
      getInnerInputBySelector(selector) {
        const input = element.querySelector(selector);
        return input;
      },
      getFilters() {
        const value = this.inputElement.value;

        return value ? JSON.parse(value) : {};
      },
      setOnRequest(callback) {
        this.buttonElement.onclick = callback;
      },
      setText(text) {
        this.textareaElement.value = text;
      }
    }
  }
})
