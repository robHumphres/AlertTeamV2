var mongoose = require('mongoose'),
  alertDb;

var dbURI = 'mongodb://localhost/userAuthentication';

mongoose.connect(dbURI);

alertDb = mongoose.createConnection('mongodb://localhost/userAuthentication');
alertDb.on('error', function(err){
  if(err) throw err;
});

alertDb.once('open', function callback () {
  console.info('Mongo db connected successfully');
});

module.exports = alertDb;
require('./post');
require('./wAlert');
