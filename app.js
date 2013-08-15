
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

// リクエスト受信時の処理
io.sockets.on('connection', function (socket) {
	// 'login'イベントを受信する
	socket.on('login',function(data) {
		console.log('log: login received');
		console.log('name=[' + data.name + ' latlng=[' + data.latlng + ']');

		// userlistに位置情報を追加
		socket.set('data', {name: data.name, latlng: data.latlng});

		var userlist = new Array();
		var i = 0
		io.sockets.clients().forEach(function(socket){
			socket.get('data', function(err, data) {
				if(data){
					userlist[i] = data;
					i++;
				}
			})
		});
		var dataArray = JSON.stringify(userlist);
		
		// 'member-geo'イベントを発生させる
		io.sockets.emit('member-geo', dataArray, function(data){
			console.log('log: member-geo execute');
		});
	});
});

