var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlWeath = require('../controllers/weatherCtrl');
var ctrlTraffic = require('../controllers/trafficCtrl');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/weather', ctrlWeath.create);
// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/traffic', ctrlTraffic.addAlertToDb);

module.exports = router;
