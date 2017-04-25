var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: String,
    postInfo: String,
    time: Date
});

module.exports.addPost = function(dataTitle, dataInfo, dataTime){

  var post = new Post({title: dataTitle,
  postInfo: dataInfo,
  time: dataTime});

  post.save();
}

mongoose.model('Post', postSchema);
