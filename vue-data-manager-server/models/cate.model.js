var mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    Schema = mongoose.Schema;

var CateSchema = new Schema({
    type: String,
    title: { type: String },
    author:String,
    content:String,
    time:String,
    sub_title:String,
   	cate:String,
   	comment:Object,
    count:Number
});

CateSchema.plugin(materializedPlugin);
module.exports = mongoose.model('Cate', CateSchema); // Category