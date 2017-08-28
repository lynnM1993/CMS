var mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    Schema = mongoose.Schema;

var CateSchema = new Schema({
    type: String,
    title: { type: String },
    content:Object,
    count:Number

});
CateSchema.plugin(materializedPlugin);
module.exports = mongoose.model('news', CateSchema); // Category