const subjectInput = document.getElementById('subject-input');
const recipientsInput = document.getElementById('recipients-input');
const editor = document.getElementById('editor');
const sendButton = document.getElementById('send-input');

function getSubject() {
  return subjectInput.value;
}

function getContent() {
  return editor.innerHTML;
}

function getRecipients() {
	const recipients = recipientsInput.value.replace(' ', '')
    .split(',')
    .map(e => ({ Email: e }));

  console.log('recipients: ', recipients);
  return recipients;
}

window.onload = function () {
  sendButton.addEventListener('click', function () {
		const subject = getSubject();
		const recipients = getRecipients();
		const content = getContent();

    $.ajax({
      type: 'POST',
      url: '/send/',
      data: {
        Subject: subject,
        HTMLPart: content,
        Recipients: recipients,
      },
      success: function (err, data) {
        console.log('data => ', data);
        console.log('err => ', err);
      }
    });
  });
};
