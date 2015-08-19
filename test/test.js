
var Mailjet = require ('../mailjet-client');
var chai = require ('chai');
var expect = chai.expect;
var should = chai.should();
var EventEmitter = require ('events').EventEmitter;

var api_key = process.env.MAILJET_API_KEY;
var api_secret = process.env.MAILJET_API_SECRET;
var client = Mailjet.connect(api_key, api_secret);

describe ('Basic Usage', function () {
	
	describe ('connection', function () {
		it ('creates an instance of the client', function () {
			var connectionType1 = new Mailjet(api_key, api_secret);
			var connectionType2 = new Mailjet().connect(api_key, api_secret);
			var connectionType3 = Mailjet.connect(api_key, api_secret);

			expect(connectionType1.apiKey + connectionType1.apiSecret).to.equal(api_key + api_secret);
			expect(connectionType2.apiKey + connectionType2.apiSecret).to.equal(api_key + api_secret);
			expect(connectionType3.apiKey + connectionType3.apiSecret).to.equal(api_key + api_secret);
		});
	})

	describe ('method request', function () {
		
		describe ('get', function () {
	
			var contact = client.get('contact');

			// TODO: more precision on the get tests
	
			it ('calls the ressource instance whith no parameters', function (done) {
				contact.request()
					.on('success', function (response, body) {
						body.should.be.a('object');
						expect(response.statusCode).to.be.within(200, 201);
						done();
					})
					.on('error', function (e) {
						// We want it to raise an error if it gets here
						expect(e).to.equal(undefined);
						done();
					});
			});

			it ('calls the ressource instance whith parameters', function (done) {
				var ee = contact.request({Name: 'Guillaume Badi'})
					.on('success', function (response, body) {
						body.should.be.a('object');
						expect(response.statusCode).to.be.within(200, 201);
						done();
					})
					.on('error', function (e) {
						// We want it to raise an error if it gets here
						expect(e).to.equal(undefined);
						done();
					});
				expect(EventEmitter.prototype.isPrototypeOf(ee)).to.equal(true);
			});

			it ('calls the ressource instance with empty parameters', function (done) {
				var ee = contact.request({})
					.on('success', function (response, body) {
						body.should.be.a('object');
						expect(response.statusCode).to.be.within(200, 201);
						done();
					})
					.on('error', function (e) {
						// We want it to raise an error if it gets here
						expect(e).to.equal(undefined);
						done();
					});
			});
		});

		describe ('post', function () {
	
			var sender = client.post('sender');
	
			it ('calls the ressource instance whith no parameters', function (done) {
				var ee = sender.request()
					.on('success', function (response, body) {
						response.statusCode.should.equal(400);
						done();
					})
					.on('error', function (e, response) {
						// it should be a response error not a request error
						response.statusCode.should.equal(400);
						done();
					});
			});

			it ('calls the ressource instance whith invalid parameters', function (done) {
				var ee = sender.request({Name: 'Guillaume Badi'})
					.on('success', function (response, body) {
						// We want it to raise an error if it gets here
						expect(response.statusCode).to.equal(400);
						done();
					})
					.on('error', function (e, response) {
						expect(response.statusCode).to.equal(400);
						done();
					});
			});

			it ('calls the ressource instance whith valid parameters', function (done) {
				var ee = sender.request({Name: 'Guillaume Badi'})
					.on('success', function (response, body) {
						// We want it to raise an error if it gets here
						expect(response.statusCode).to.be.within(200, 201);
						done();
					})
					.on('error', function (e, response) {
						expect(response.statusCode).to.equal(400);
						done();
					});
			});

			it ('calls the function instance with empty parameters', function (done) {
				var ee = sender.request({})
					.on('success', function (response, body) {
						body.length.should.not.equal(0);
						expect(response.statusCode).to.be.within(200, 201);
						done();
					})
					.on('error', function (e, response) {
						// We want it to raise an error if it gets here
						expect(response.statusCode).to.equal(400);
						done();
					});
			});
		});
	});
});
