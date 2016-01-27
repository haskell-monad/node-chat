var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var friendSchema = new Schema({
	uid		:	String,
	fid		:	String,
	ctime	:	String
})
var Friend = mongoose.model('Friend',friendSchema);

module.exports = Friend
