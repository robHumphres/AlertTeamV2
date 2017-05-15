var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    agency: String,
    imageLink: String,
    title: String,
    briefDescription: String,
    description: String,
    clickMore: String,
    time: Date
});

mongoose.model('Post', postSchema);
