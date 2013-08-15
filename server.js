var fs = require('fs');
var http = require('http');

// HTTPサーバを作成
var server = http.createServer();
var io = require('socket.io').listen(server);

server.on('request', function (req, res) {
	fs.readFile('index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading client.html');
		}
		res.writeHead(200,
			{'Content-Type': 'text/html; charaset=UTF-8'});
		res.end(data);
	});
});

server.listen(3010);

// リクエスト受信時の処理
io.sockets.on('connection', function (socket) {
	// 'login'イベントを受信する
	socket.on('login',function(data) {
		console.log('log: login received');

		// 'member-geo'イベントを発生させる
		io.sockets.emit('member-geo', {message: data.message, latlng: data.latlng}, function(data){
			console.log('log: member-geo execute');
		});
	});

});

