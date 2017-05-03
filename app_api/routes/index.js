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
var ctrlAllPost = require('../controllers/allPostsCtrl');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//alerts
router.get('/traffic', ctrlTraffic.getTrafficPosts);
router.get('/weather', ctrlWeath.getWeatherPosts);
router.get('/allPosts', ctrlAllPost.getAllPosts);


module.exports = router;
