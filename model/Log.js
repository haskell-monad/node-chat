var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var logSchema = new Schema({
	content		:	{type : String},
	ctime		:	{type : Date, default: Date.now},
})
var Log = mongoose.model('Log',logSchema);


module.exports = Log
