/*
 * WebSocket
 */
function initSocket(callback) {
	if(navigator.geolocation){
	        var socket = io.connect();

	        // "member-geoイベントを受信したら、その内容を表示する
	        socket.on('member-geo', function(data, fn) {
	                console.log("member-geo received");
	                //$('#disp').append(data.name);

			// 地図上のマーカーを削除
			clearMarker();

			// 地図にマーカーを追加
			var data = JSON.parse(data);
			console.log(data);
			data.forEach(function(d){
				addMarker(d.name, d.latlng);
			});
	        });

	        // 自分の位置をサーバへ送信する
	        $('#btn').on('click', function() {
			var name = $('#cocoName').val() || '名無しのゴンベさん';
	                socket.emit("login", {name: name, latlng: currentLatLng})
	        });

	} else {
	        window.alert("対応外");
	}

	if (callback) {
		callback();
	}
}


