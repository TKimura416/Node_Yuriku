/*
 * GoogleMap
 */
var map = (function(){
	// private variables	
		var map;
		var currentLatLng = new Object();
		var markerArray = [];

	// global functions
	return {
		currentLatLng: function(){ return currentLatLng },
		markerArray: function(){ return markerArray },
		initMap: function(clickEvent, callback) {
			var thisObject = this;
			// 現在地取得
			var positionOptions = {
	                	enableHighAccuracy: true
			}
			navigator.geolocation.getCurrentPosition(function(pos) {
				// 位置情報をcurrentLatLngへ読み込み
				thisObject.watchMarker(pos);
	        		// google map 読み込み
	        		var mapOptions = {
	                       		zoom: 13,
	                        	center: new google.maps.LatLng(currentLatLng.lat, currentLatLng.lng),
	                        	mapTypeId: google.maps.MapTypeId.ROADMAP
	        		}
	        		map = new google.maps.Map($('#map_canvas')[0], mapOptions);

				// イベント登録
				if (clickEvent) {
					google.maps.event.addListener(map, 'click', clickEvent);
				}
			});
	
			if (callback) {
				callback();
			}
		},

		addMarker: function (name, latlng) {
			if (!latlng || !latlng.lat || !latlng.lng) {
				return;
			}

			var infoWindow = new google.maps.InfoWindow({
				content: '<div>'+ name +'</div>'
			});
			var options = {
				position: new google.maps.LatLng(latlng.lat, latlng.lng),
				map: map,
				draggable: true
			};
			if (name) {
				options.title = name;
			}
			var marker = new google.maps.Marker(options);
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(map, marker);
			});
			markerArray.push(marker);
		},

		clearMarker: function () {
			markerArray.forEach(function(marker){
				marker.setMap(null);
			});
			markerArray = new Array();
		},

		watchMarker: function (pos) {
			// 現在位置をcurrentLatLngへ読みこみ
			currentLatLng.lat = pos.coords.latitude;
			currentLatLng.lng = pos.coords.longitude;
		}
	}
})();
