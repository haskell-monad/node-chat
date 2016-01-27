var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var channelSchema = new Schema({
	id			:	String,
	uid			:	String,
	createtime	:	{type : Date, default: Date.now},
	intro		:	String
})
var Channel = mongoose.model('Channel',channelSchema);

module.exports = Channel
