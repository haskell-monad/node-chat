var mongoose = require("mongoose");

var options = {
  db: {
		native_parser: true
  },
  server: {
		auto_reconnect: true,
		poolSize: 5
  }
};

var url = "mongodb://localhost/chat";

mongoose.connect(url, options, function(err, res) {
	  if (err) {
			console.log('[mongoose log] Error connecting to: ' +url + '. ' + err);
			return process.exit(1);
	  } else {
			return console.log('[mongoose log] Successfully connected to: '+ url);
	  }
});

var db = mongoose.connection;
db.on("error",console.error);
db.once('open',function(){
	console.log("数据库连接成功.");
});

module.exports = db;
