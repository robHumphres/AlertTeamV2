var mongoose = require('mongoose');

var wAlertSchema = mongoose.Schema({
    alertID: String,
    alertInfo: String
});

mongoose.model('wAlert', wAlertSchema);
