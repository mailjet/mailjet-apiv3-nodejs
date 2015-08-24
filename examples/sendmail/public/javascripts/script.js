
var subjectInput = document.getElementById('subject-input');
var recipientsInput = document.getElementById('recipients-input');
var editor = document.getElementById('editor');
var sendButton = document.getElementById('send-input');

function getSubject() {
	return subjectInput.value;
}

function getRecipients () {
	var r = recipientsInput.value.replace(' ', '').split(',').map(function (e) {
		return {Email: e};
	});
	console.log ('r', r);
	return r;
}

function getContent () {
	return editor.innerHTML;
}

window.onload = function () {
	sendButton.addEventListener('click', function () {
		var subject = getSubject();
		var recipients = getRecipients();
		var content = getContent();

		$.ajax({
			type: 'POST',
			url: '/send/',
			data: {
				'Subject': subject,
				'Text-part': content,
				'Recipients': recipients,
			},
			success: function (err, data) {
				console.log (err || data);
			}
		});
	});
}
