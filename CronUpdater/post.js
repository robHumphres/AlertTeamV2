var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('Post', postSchema);
