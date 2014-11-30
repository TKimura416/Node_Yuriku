
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sanitize = require('express-validator');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
require('./data.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan("dev"));
app.use(bodyParser());
app.use(methodOverride());
app.use(sanitize());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);

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
		if(data){
			var name = data.name;
			console.log('name=[' + name + ' latlng=[' + data.latlng + ']');

      //socket内にデータがあったら、位置情報を更新してsetする
      //なかったら新しくデータを作ってsetする
      var _data;
      _data = socket.data;
      if(_data){
        _data.latlng = data.latlng;
        _data.dispflg = data.dispflg;
      } else {
        _data = new DATACLASS(socket.id, name, data.latlng, data.dispflg);
      }

      socket.data = _data;

      socket.emit('member-geo', _data, function(_data){
        console.log('log: member-geo execute');
      });
      //他の人のsocketにも自分の値をsetしてemit
      var room = io.sockets.adapter.rooms[socket.rooms]
      if (room) {
          for (var id in room) {
            socket = io.sockets.adapter.nsp.connected[id];
            data = socket.data
            if(data){
              if(data.id != _data.id){
                data.setData(_data);
                socket.emit('member-geo', data, function(data){
                  console.log('log: member-geo execute');
                });
              }
            }
          }
      }

		} else {
			socket.data = data;
		}
	});
});

