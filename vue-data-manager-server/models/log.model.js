var mongoose = require('mongoose'); // 引入的是mongoose
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema; // 利用mongoose下的Schema(架构、模型)
var ObjectId = Schema.ObjectId;

var LogSchema = new Schema({
    name: String,
    desc: String,
    author: {},
    commentCount: Number,
    cateId: ObjectId,
    cate: {},
    date: { type: Date, default: Date.now }
});

LogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Log', LogSchema);