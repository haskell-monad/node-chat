var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username	:	{type : String, default: "匿名用户"},
	password	:	{type : String, default: "123456"},
	time		:	{type : Date, default : Date.now},
	state		:	{type : Number,default : 0} //0离线1在线
})
var User = mongoose.model('User',userSchema);


userSchema.statics.findbyId= function(id, callback) {
    return this.model('User').find({id: id}, callback);
}

userSchema.methods.findbyusername = function(username, callback) {
    return this.model('User').find({username: username}, callback);
}

module.exports = User
