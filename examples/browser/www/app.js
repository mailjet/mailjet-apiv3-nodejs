requirejs.config({
  baseUrl: 'lib',
  paths: {
    app: '../app',
    mailjet: '../../../../dist/mailjet.web'
  }
});

requirejs(["app/main"]);
