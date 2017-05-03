var mongoose = require('mongoose');
var ActivePost = mongoose.model('ActivePost');

module.exports.getAllPosts = function(req, res){

  var array = ActivePost.find({},function(err, result){
    res.send(result);
  });
}
