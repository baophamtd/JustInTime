'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');

var app = module.exports = loopback();
const EmailController = require('./services/email/EmailController');



app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  
};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//SendEmails
app.post('/email', EmailController.sendEmails);

app.get('/hello', function(req, res) {
  res.send("Hello world")
})

app.get('/sparkpost', function(req, res) {
  sparkPostClient.transmissions.send({
    options: {
      sandbox: false,
      start_time: '2017-05-06T17:00:00-07:00'
    },
    content: {
      from: 'mail@mail.intimeio.online',
      subject: 'Check the time! 5pm?',
      html:'<html><body><p>Hope this emails come in at 5pm</p></body></html>'
    },
    recipients: [
      {address: process.env.GOVIND_EMAIL}
    ]
  })
  .then(data => {
    console.log('Woohoo! You just sent your first mailing!');
    console.log(data);
  })
  .catch(err => {
    console.log('Whoops! Something went wrong');
    console.log(err);
  });
});
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});