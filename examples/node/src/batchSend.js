const dotenv = require('dotenv');
const Mailjet = require('node-mailjet');

dotenv.config();

const client = Mailjet
	.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)

// Batch sending: the Send API v3.1 accepts multiple `Messages` in a single
// request, but it does NOT treat the batch as an all-or-nothing operation.
// Each message in `Messages` is processed independently, so some messages
// can succeed while others fail (e.g. invalid recipient, blocked domain)
// in the very same response. Always inspect `body.Messages[i].Status`
// instead of assuming the whole request succeeded or failed as a unit.
const data = {
	Messages: [
		{
			From: { Email: 'pilot@test.com', Name: 'Mailjet Pilot' },
			To: [{ Email: 'passenger1@test.com' }],
			Subject: 'Your flight plan (1)',
			TextPart: 'This message is expected to succeed.',
			// CustomID lets you match each response entry back to the request
			// that produced it, which is essential for safe retries below.
			CustomID: 'order-1001',
		},
		{
			From: { Email: 'pilot@test.com', Name: 'Mailjet Pilot' },
			// Missing/invalid "To" is used here purely to illustrate a message
			// that Mailjet will report as failed while the rest of the batch
			// keeps processing.
			To: [{ Email: 'not-a-valid-address' }],
			Subject: 'Your flight plan (2)',
			TextPart: 'This message is expected to fail.',
			CustomID: 'order-1002',
		},
	],
	// AdvanceErrorHandling: true gives one Errors entry per validation
	// problem, with machine-readable ErrorCode/ErrorIdentifier fields,
	// making it much easier to decide programmatically what is safe to retry.
	AdvanceErrorHandling: true,
};

client
	.post('send', { version: 'v3.1' })
	.request(data)
	.then(response => {
		const { Messages } = response.body;

		const succeeded = Messages.filter((message) => message.Status === 'success');
		const failed = Messages.filter((message) => message.Status !== 'success');

		console.log(`${succeeded.length}/${Messages.length} messages sent successfully`);

		succeeded.forEach((message) => {
			console.log(`  [sent] CustomID=${message.CustomID} -> ${message.To.map((to) => to.MessageID).join(', ')}`);
		});

		failed.forEach((message) => {
			console.log(`  [failed] CustomID=${message.CustomID}`);
			message.Errors.forEach((error) => {
				console.log(`      ${error.ErrorCode}: ${error.ErrorMessage}`);
			});
		});

		// Retry guidance: only resubmit the messages that actually failed, and
		// only when the error is retryable (e.g. a transient server error, not
		// an invalid recipient that will fail again). Reuse the same CustomID
		// so failures can be reconciled by your own system/logs, and never
		// resend a message whose Status was already "success" - doing so will
		// duplicate the email.
		const retryableFailures = failed.filter((message) => (
			message.Errors.some((error) => error.StatusCode >= 500)
		));

		if (retryableFailures.length > 0) {
			console.log(`${retryableFailures.length} message(s) failed with a potentially transient error and could be retried by CustomID.`);
		}
	})
	.catch(err => {
		// This branch only fires for request-level failures (network error,
		// auth failure, malformed request, etc.) - it does NOT fire when
		// individual messages inside a successfully-submitted batch fail.
		console.log('error => ', err)
	})
