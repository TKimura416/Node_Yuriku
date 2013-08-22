/*
 * WebSocket
 */

var socket = io.connect();
function initSocket(onsuccess, onerror) {
	var watchFlg = false;
	if(navigator.geolocation){

	        // "member-geoイベントを受信したら、その内容を表示する
	        socket.on('member-geo', function(data, fn) {
	                console.log("member-geo received");
	                //$('#disp').append(data.name);

			// 受信したデータを読み込み
			var data = JSON.parse(data);
			console.log(data);

			// 接続者リストを初期化
			data = initMemberList(data);

			// 地図上のマーカーを削除
			clearMarker();

			// 地図にマーカーを追加
			data.forEach(function(d){
				if(d.dispflg){
					addMarker(d.name, d.latlng);
				}
			});
	        });

	        // 自分の位置をサーバへ送信する
	        $('#btn').on('click', function() {
			emit_login();
			watchFlg = true;
	        });

		var options = {
			enableHighAccuracy: true,
			timeout: 1000,
			maximumAge: 1000
		};
		navigator.geolocation.watchPosition(
			function (pos) {
				if(watchFlg){
					watchMarker(pos);
					emit_login();
				}
				if (onsuccess) {
					onsuccess(pos);
				}
			},
			function (e) {
				if (onerror) {
					onerror(e);
				} else if (console) {
					console.log(e.code + " " + e.message);
				}
			},
			options
		);
	} else {
	        window.alert("対応外");
	}
}

function emit_login(){
	var name = $('#cocoName').val() || '名無しのゴンベさん';
	var data;
	var publicFlg = false;
	
	//自分の公開設定を確認
	if($('div.menu li#myself.on')[0]){
		publicFlg = true;
	}

	// 公開設定になっていたらデータを送信
	// そうでなければundefinedを送信
	if (publicFlg){	
		data = {name: name, latlng: currentLatLng};
	} else {
		data = undefined;
	}
	socket.emit("login", data)
}
