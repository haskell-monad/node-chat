var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	id			:	String,
	content		:	String,
	type		:	String,
	sid			:	String,
	rid			:	String,
	ischannel	:	Number
})
var Message = mongoose.model('Message',messageSchema);


module.exports = Message
