var mongoose = require('mongoose');

var wAlertSchema = mongoose.Schema({
    AlertID: String,
    AlertInfo: String
});

mongoose.model('wAlert', wAlertSchema, 'wAlerts');
