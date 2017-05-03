var mongoose = require('mongoose');

var activeWeatherPostSchema = mongoose.Schema({
    title: String,
    postInfo: String,
    time: Date
});

mongoose.model('ActiveWeatherPost', activeWeatherPostSchema);
