var mongoose = require('mongoose');
var ActiveWeatherPost = mongoose.model('ActiveWeatherPost');

module.exports.getWeatherPosts = function(req, res){

  var array = ActiveWeatherPost.find({},function(err, result){
    res.send(result);
  });
}
