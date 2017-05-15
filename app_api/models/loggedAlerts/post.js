var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    agency: String,
    imageLink: String,
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('Post', postSchema);
