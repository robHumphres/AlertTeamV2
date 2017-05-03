var mongoose = require('mongoose');
var ActiveTrafficPost = mongoose.model('ActiveTrafficPost');

module.exports.getTrafficPosts = function(req, res){

  var array = ActiveTrafficPost.find({},function(err, result){
    res.send(result);
  });
}
