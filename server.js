//http://192.168.99.60:3000/
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({
		store: new SessionStore({path: __dirname+'/tmp/sessions'}), 
		secret: 'pass', 
		resave: true, 
		saveUninitialized: true
});

var bodyParser = require('body-parser');
var express = require("express");
var app = express();
app.use(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
var http = require('http');
var server = http.createServer(app);
server.listen(3000);
console.log("http server has start 3000 ...");

var onlineUsers = [];
var delUsers = [];

var url = require('url');
var fs = require('fs');

//加载页面
function loadHtml(fileName){
	var realpath = __dirname + '/views/' +  url.parse(fileName).pathname;
	var txt = fs.readFileSync(realpath);
	return txt;
}

app.get('/',function(req,res){
	if( req.session.username && req.session.username !== '' && typeof(username) != 'undefined'){
		res.redirect('/chat');
	}else{
		res.end(loadHtml('login.html'));
	}
});

app.get('/chat',function(req,res){
	if( req.session.username && req.session.username !== '' && typeof(username) != 'undefined'){
		res.render('index',{username:req.session.username});
	}else{
		res.redirect('/');
	}
});


app.post('/login',function(req,res){
	var username = req.body.username;
	console.log(username+" 发起登录post请求");
	if(username && username !== ''){
		if (onlineUsers.indexOf(username) > -1){
			res.end(username+" 已存在");
		}else{
			req.session.username = username;//设置session
			res.render('index',{username:username});
		}
	}else{
		res.end('username cannot null');
	}
});

var msgQueue = new Array();


var io = require('socket.io')(server);
io.use(function(socket,next){
	console.log("*********1********************");
	session(socket.handshake, {}, next);
})

Array.prototype.indexOf = function (obj) {  
	for (var i = 0; i < this.length; i++) {  
		if (this[i] == obj) {  
			return i;  
		}  
	}  
	return -1;  
} 

io.sockets.on('connection', function (socket){ 
	var username = socket.handshake.session.username;
	console.log("监听到服务器connection事件...: "+username +" 登录成功.");
	var refresh_online = function(){ 
		var lines = [];
		for (var i in onlineUsers){ 
			console.log("在线用户: "+i);
			lines.push(i); 
		} 
		io.sockets.emit('online users',lines); 
	} 

	var refresh_msg = function(){
		socket.emit('all messsage',username,msgQueue); 
	}

	onlineUsers[username] = socket;
	io.sockets.emit('system message',username+" 加入到聊天室");
	refresh_online();
	refresh_msg();
    socket.on('message',function(message){
		console.log("服务器接收到【"+username+"】的消息: "+message);
		msgQueue.push(username+":"+message);//所有的消息
        socket.broadcast.emit('message',message); 
    })

    //socket.on('private message',function(to, msg, fn){ 
        //var target = onlineUsers[to]; 
        //if (target) { 
            //target.emit('private message', username+'[sixin]', msg); 
        //}else { 
            //socket.emit('message error', to, msg); 
        //} 
    //}); 

	socket.on('disconnect', function(){
		console.log(username+" 离开聊天室");
		socket.broadcast.emit('system message',username+" 离开聊天室");
		refresh_online();
	});
	
});




//require("./model/mongo");
//var User = require('./model/User');
//var Message = require('./model/Message');
//var Channel = require('./model/Channel');
//var Friend = require('./model/Friend');
//var Log = require('./model/Log');

//io.on("connection",function(socket){

	//socket.on('message',function(data){
		//console.log("接收到客户端消息: "+data);
	//});

	//socket.on('login',function(username){
		//console.log("客户端用户 "+username+" 发起登陆请求.");
		
		//User.findOne({ username: username }).exec(function(err,result){
			//if (err){
				//console.error(err);
			//}else{
				//if (result == null){
					//var userEntity = new User({username:username,state:1});
					//userEntity.save(function (err,userEntity) {
						 //if (err) return console.error(err);
						 //console.log("添加新用户成功: "+userEntity.username);
					//});
				//}
				//socket.userName = username;
				//socket.emit("loginSuccess",username);
				//User.update({ username:username}, { $set: { state: 1 }}, function (err, result) {
					//if (err){
						//console.log("修改用户状态失败.");
					//}else{
						//console.log("修改用户状态成功.");
					//}
				//});
				//io.sockets.emit('system',username,'login');
				//console.log("服务器login事件: "+username+"登陆成功.");
			//}
		//});
	//});

	//socket.on('disconnect',function(){
		//socket.broadcast.emit('system',socket.userName,'logout');
		//User.findOne({ username:socket.userName }).exec(function(err,result){
			//if (err){
				//console.error(err);
			//}else{
				//if (result == null){
					 //console.log("下线用户不存在.");
				//}else{
					//User.update({ username:socket.userName}, { $set: { state: 0 }}, function (err, result) {
						//if (err){
							//console.log("修改下线用户状态失败.");
						//}else{
							//console.log("修改下线用户状态成功.");
						//}
					//});
				//}
			//}
		//});
	//});
//});