String.prototype.startWith=function(str){ 
	var reg=new RegExp("^"+str); 
	return reg.test(this); 
} 
String.prototype.endWith=function(str){ 
	var reg=new RegExp(str+"$"); 
	return reg.test(this); 
} 

function sendMyMsg(msg){
	var html = "<div class='rightd'><div class='rightimg'> </div><div class='speech right'>"+msg+"</div></div>";
	$("#msg_content").append(html);
	var div = document.getElementById("msg_content");
	div.scrollTop = div.scrollHeight;
}

function sendOtherMsg(msg){
	var html = "<div class='leftd'><div class='speech left'> "+msg+" </div></div>";
	$("#msg_content").append(html);
	var div = document.getElementById("msg_content");
	div.scrollTop = div.scrollHeight;			
}

(function($){
	$.chat = function(args){
		var socket = null;
		
		this.init = function(){
			socket = io.connect();
			socket.on('connect',function(){
				console.log("监听到connect事件.");
			});
			socket.on('existUserName',function(username){
				console.log("用户名 "+username+" 已经存在,请在换一个名称.");
				$("#username").val("");
			});
			socket.on('all messsage',function(username,array){
				var msg = "";
				username = username+":";
				for (var i =0;i<array.length;i++){
					msg = array[i];
					if (msg.startWith(username)){
						msg = msg.substring(username.length,msg.length);
						sendMyMsg(msg);
					}else{
						msg = msg.substring(msg.indexOf(":")+1,msg.length);
						sendOtherMsg(msg);
					}
				}
			})
			socket.on('message',function(msg){
				sendOtherMsg(msg);
			});
			socket.on('system message',function(msg){
				log(msg);
			});
			socket.on('online users',function(users){
				var html;
				$("ul.online-list").empty();
				for (var i in users){
					html = "<li class='list-group-item list-item' style='cursor:pointer'><span class='badge'></span>"+users[i]+"</li>";
					$("ul.online-list").append(html);
				}
				$("ul.online-list > li").on('click',function(){
					$("#meg_info").val($("#meg_info").val()+"@"+$(this).text());
				})
			});
		};
		this.sendMessage = function(msg){
			//规则：[face:xy2/xy2_3] <img src="face/xy2/xy2_3.gif"/>
			msg = msg.replace(/\[face:([a-z1-9]+)\/([a-z1-9]+_\d+)\]/g,"<img src='face/$1/$2.gif'/>");
			msg = msg.replace(/(http:\/\/[^\s]+\.(jpg|png|jpeg){1})/g,"<img src='$1'/>");
			socket.emit("message",msg);
			sendMyMsg(msg);
		};
	};
})(jQuery);