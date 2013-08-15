/*
 * GoogleMap
 */
var map;
var currentLatLng;
var markerArray = [];
function initMap(callback) {

	// 現在地取得
	var positionOptions = {
	                enableHighAccuracy: true
	}
	navigator.geolocation.getCurrentPosition(function(pos) {
	        var latlng = new google.maps.LatLng(
	                pos.coords.latitude, pos.coords.longitude);

	        // google map 読み込み
	        var mapOptions = {
	                        zoom: 13,
	                        center: latlng,
	                        mapTypeId: google.maps.MapTypeId.ROADMAP
	        }
	        map = new google.maps.Map($('#map_canvas')[0], mapOptions);

		currentLatLng = latlng;
/*
	        var marker = new google.maps.Marker({
	                        position: latlng,
	                        map: map,
				title: '自分',
	                        draggable: true
	        });
	        markerArray.push(marker);
*/
		//addMarker(latlng);
	});

	if (callback) {
		callback();
	}
}

function addMarker(name, latlng) {
	var infoWindow = new google.maps.InfoWindow({
		content: '<div>'+ name +'</div>'
	});
	var options = {
		position: new google.maps.LatLng(latlng.mb, latlng.nb),
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
}

function clearMarker() {
	markerArray.forEach(function(marker){
		marker.setMap(null);
	});
	markerArray = new Array();

}
