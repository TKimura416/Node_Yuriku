/*
 * WebSocket
 */
var socket = io.connect();
var watchFlg = false;
function initSocket(onsuccess, onerror) {
	if(navigator.geolocation){

	        // "member-geoイベントを受信したら、その内容を表示する
	        socket.on('member-geo', function(data, fn) {
	                console.log("member-geo received");
	                //$('#disp').append(data.name);

			// 接続者リストを初期化
			data = initMemberList(data);

			// 地図上のマーカーを削除
			map.clearMarker();

			// 地図にマーカーを追加
      if(data.dispflg){
        map.addMarker(data.name, data.latlng);
      }
			for(key in data.data){
        (function(data){
				  if(data.dispflg){
					  map.addMarker(data.name, data.latlng);
				  }
			  })(data.data[key])
	    };
      });

	        // 自分の位置をサーバへ送信する
	       // $('#btn').on('click', function() {
		//	emit_login();
		//	watchFlg = true;
	        //});

		var options = {
			enableHighAccuracy: true,
			timeout: 1000,
			maximumAge: 1000
		};
		navigator.geolocation.watchPosition(
			function (pos) {
				if(watchFlg){
					map.watchMarker(pos);
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
	// データを送信
		data = {name: name, latlng: map.currentLatLng(), dispflg: publicFlg};
	socket.emit("login", data)
}

