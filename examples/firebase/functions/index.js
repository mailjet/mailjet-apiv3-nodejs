const functions = require("firebase-functions");
const Mailjet = require("node-mailjet");

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.sendHelloWorld = functions.https.onRequest((request, response) => {
  const mailjet = Mailjet
      .apiConnect(
          "<YOUR_PUBLIC_KEY>",
          "<YOUR_SECRET_KEY>"
      );

  const fromEmail = "pilot@mailjet.com";
  const toEmail = "passenger@mailjet.com";
  const emailRequest = mailjet
      .post("send", {version: "v3.1"})
      .request({
        "Messages": [
          {
            "From": {
              "Email": fromEmail,
              "Name": "Your Mailjet Pilot",
            },
            "To": [
              {
                "Email": toEmail,
                "Name": "Passenger 1",
              },
            ],
            "Subject": "Your email flight plan with Firebase!",
            "HTMLPart": "<h3>Dear passenger, welcome to Mailjet!</h3>",
            "TextPart": "Dear passenger, welcome to Mailjet!",
          },
        ],
      });

  functions.logger.info("Start send email", {structuredData: true});
  emailRequest
      .then((result) => {
        functions.logger.info("Email sent!", {
          structuredData: true,
          body: result.body,
        });

        response.status(201).json(result.body);
      })
      .catch((err) => {
        functions.logger.error("Email not send", {structuredData: true, err});

        response.status(500).send(err);
      });
});

exports.sendEmail = functions.https.onRequest((request, response) => {
  const {from: fromEmail, to: toEmail, subject} = request.query;

  if (!fromEmail) {
    response.status(400).send("Query param 'from' is required ");
  }

  if (!toEmail) {
    response.status(400).send("Query param 'to' is required ");
  }

  if (!subject) {
    response.status(400).send("Query param 'subject' is required ");
  }

  functions.logger.debug("Query params", {fromEmail, toEmail, subject});

  const mailjet = Mailjet
      .apiConnect(
          "<YOUR_PUBLIC_KEY>",
          "<YOUR_SECRET_KEY>"
      );

  const emailRequest = mailjet
      .post("send", {version: "v3.1"})
      .request({
        "Messages": [
          {
            "From": {
              "Email": fromEmail,
              "Name": "Your Mailjet Pilot",
            },
            "To": [
              {
                "Email": toEmail,
                "Name": "Passenger 1",
              },
            ],
            "Subject": subject,
            "HTMLPart": "<h3>Dear passenger, welcome to Mailjet!</h3>",
            "TextPart": "Dear passenger, welcome to Mailjet!",
          },
        ],
      });

  functions.logger.info("Start send email", {structuredData: true});
  emailRequest
      .then((result) => {
        functions.logger.info("Email sent!", {
          structuredData: true,
          body: result.body,
        });

        response.status(201).json(result.body);
      })
      .catch((err) => {
        functions.logger.error("Email not send", {structuredData: true, err});

        response.status(500).send(err);
      });
});
