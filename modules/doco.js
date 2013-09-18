/*----------------------------------------------------
 * 接続者オブジェクト
 *
 * 新規接続
 *   var j = new Jointer(socket, [name]);
 */
exports.Jointer = function (socket, name) {
	this.socket = socket;
	this.lat = 0;
	this.lng = 0;
	this.symbol = 0;
	this.name = name || "名無しのゴンベ";
};
exports.Jointer.prototype.getId = function () {
	if (socket) {
		return this.socket.id;
	} else {
		return null;
	}
}
exports.Jointer.prototype.data = function () {
	return {lat: this.lat, lng: this.lng, symbol: this.symbol, name: this.name}
}

/** equals method */
exports.Jointer.prototype.equals = function (jointer) {
	return (jointer.getId == this.socket.id);
}

exports.jointers = [];
//exports.jointers.prototype.remove = function (jointer) {
//	  return jointers.removeTarget(jointer, 'socket.id');
//}

/*
 * ソケットの利用可否 (true:OK false:NG)
 */
exports.Jointer.prototype.isValidSocket = function () {
	if (this.socket) {
		return true;
	} else {
		return false;
	}
}

/*----------------------------------------------------
 * 部屋オブジェクト
 *
 * 入室
 *				 room.add(jointer);
 */
exports.Room = function (jointer) {
	this.url = "";
	this.roomId = "";
	this.host = jointer;
	this.guests = [];
	this.chat = new Chat();
}

/* accessor for url */
exports.Room.prototype.url = function (url) {
	if (url) {
		this.url = url;
	} else {
		url = this.url;
	}
	return url;
}
/* getter for roomId */
exports.Room.prototype.roomId = function () {
	return this.roomId;
}

exports.Room.prototype.hasGuest = function (jointer) {
	var guests_ = this.guests.filter(function (guest) {
		if (jointer.equals(guest)) {
			return guest;
		}
	});
	return (guests_.length > 0);
}

/*
 * 入室
 */
exports.Room.prototype.add = function (jointer) {
	this.guests[this.guests.length] = jointer;
	return this.guests;
}

/*----------------------------------------------------
 * 部屋管理
 *
 * 部屋を作成
 *   var room = RoomManager.create(jointer);
 *
 * 部屋を取得
 *   var room = RoomManager.get(roomId);
 *
 * 部屋を削除
 *   RoomManager.remove(room);
 */
exports.RoomManager = function () {
	/* 部屋リスト */
	var rooms = [];

	return {
		/*
		 * 部屋IDから部屋を取得
		 */
		get: function (roomId) {
			return rooms.filter(function (room) {
				if (room.roomId == roomId)
					return room;
			});
		}

		/*
		 * 部屋を追加
		 */
		,add: function (room) {
			rooms[rooms.length] = room;
			return rooms;
		}

		/*
		 * 部屋を生成してリストに追加
		 */
		,create: function (host) {
			var room = new Room(host);
			RoomManager.add(room);
			return room;
		}

		/*
		 * 部屋を削除
		 */
		,remove: function (room) {
			return rooms.removeTarget(room, 'roomId');
		}

		,rooms: rooms
	}
}();


/*----------------------------------------------------
 * チャットオブジェクト
 *
 * チャット作成
 *   var chat = new Chat();
 *
 * メッセージ追加
 *   chat.add(message);
 *
 * メッセージ削除（古いメッセージを削除）
 *   chat.remove();
 *
 * メッセージ全削除
 *   chat.clear();
 */
exports.Chat = function () {
	var MESSAGE_MAX_COUNT = 3;
	var messages = [];
}
/*
 * メッセージ追加
 * 先頭にメッセージを追加して、MESSAGE_MAX_COUNTを超えた分を削除する
 */
exports.Chat.prototype.add = function (message) {
	this.messages.unshift(message);
	if (this.messages.length > this.MESSAGE_MAX_COUNT) {
		this.remove();
	}
	return this.messages;
};

/*
 * 一番古いメッセージを削除
 */
exports.Chat.prototype.remove = function () {
	return this.messages.pop();
};

/*
 * メッセージをクリア
 */
exports.Chat.prototype.clear = function () {
	var messages_ = this.messages;
	this.messages = [];
	return messages_;
};

/*----------------------------------------------------
 * イベントメソッド
 */
exports.events = function () {
	/* connect */
	this.connection = function (socket) {
		var jointer = new exports.Jointer(socket);
		exports.jointers.push(jointer);

		socket.on('disconnect', function() {
		  return this.disconnect(jointer);
		});
	}
}
/* disconnect. destroy jointer and room. */
exports.events.prototype.disconnect = function (jointer) {
	exports.jointers.removeTarget(jointer, 'socket.id');
}

/* enter public map */
exports.events.prototype.enterPublic = function (jointer, data) {
	console.log(jointer);
}

/* enter private map, and create room by host jointer */
exports.events.prototype.enterPrivate = function (jointer, data) {
}

/* send message on chat */
exports.events.prototype.sendMessage = function (jointer, data) {
}

/*----------------------------------------------------
 * utility methods
 */

/*
 * crypt module utility.
 * function of encryption and decription.
 */
exports.crypto = function () {
	var crypto = require('crypto');
	var DEFAULT_ALGORITHM = 'aes256';
	var DEFAULT_PASSWORD = 'dOcOcOkOdOkO';
	var DEFAULT_ENCODING = 'utf8';
	var DEFAULT_OUTPUT_ENCODING = 'hex';
	var cipher = crypto.createCipher(DEFAULT_ALGORITHM, DEFAULT_PASSWORD);
	var decipher = crypto.createDecipher(DEFAULT_ALGORITHM, DEFAULT_PASSWORD);
	return {
	/* init cipher and decipher */
	init: function (algorithm, password) {
		cipher = crypto.createCipher(algorithm || DEFAULT_ALGORITHM,
		password || DEFAULT_PASSWORD);
		decipher = crypto.createDecipher(algorithm || DEFAULT_ALGORITHM,
		password || DEFAULT_PASSWORD);
	}

	,encryption: function(str) {
		return cipher.update(str, DEFAULT_ENCODING, DEFAULT_OUTPUT_ENCODING)
			+ cipher.final(DEFAULT_OUTPUT_ENCODING);
	}

	,decryption: function(str) {
		return decipher.update(str, DEFAULT_OUTPUT_ENCODING, DEFAULT_ENCODING)
			+ decipher.final(DEFAULT_ENCODING);
	}
	}
} ();

/*
 * remove array item.
 * (exsample)
 * var a = [{obj:{name:'aaa'}}, {obj:{name:'bbb'}}, {obj:{name:'ccc'}}];
 * var bbb = {obj: {name: 'bbb'}};
 * a.removeTarget(bbb, 'obj.name');
 *
 * @param target remove target. (required)
 * @param property condition strings
 */
Array.prototype.removeTarget = function (target, property) {
	for (i = 0; i < this.length; i++) {
		var value1 = this[i];
		var value2 = target;

		if (property) {
			var properties = property.split('.');
			for (j = 0; j < properties.length; j++ ){
				value1 = value1[properties[j]];
				value2 = value2[properties[j]];
			}
		}
		if (value1 == value2) {
			return this.splice(i, 1);
		}
	}
}

