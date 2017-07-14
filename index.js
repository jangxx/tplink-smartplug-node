const net = require('net');

function TPLink_SmartHome(ip, connected_cb) {
	if (ip  == undefined) throw new Error("Not ip address specified");

	var connected = false;
	var answer_cb = null;
	var socket = net.connect(9999, ip, function() {
		connected = true;
		if (connected_cb != false) return connected_cb();
	});
	socket.on('end', function() {
		connected = false;
	});
	socket.on('data', function(data) {
		if (answer_cb == null) return;

		var resp = decrypt(data);
		var parsed = false;
		try {
			resp = JSON.parse(resp);
			parsed = true;
		} catch(e) {}
		return answer_cb(parsed, resp);
	});

	function send(json, cb) {
		if (!connected || answer_cb != null) return false;

		var raw = encrypt(JSON.stringify(json));

		socket.write(raw, '');
		answer_cb = cb;
		return true;
	}

	function encrypt(str) {
		var key = 171;
		var buf = Buffer.alloc(4 + str.length);
		for(var i = 0; i < str.length; i++) {
			var a = key ^ str.charCodeAt(i);
			key = a;
			buf.writeUInt8(a, 4 + i);
		}
		return buf;
	}

	function decrypt(buf) {
		var key = 171
		var result = ""
		for(var i = 4; i < buf.length; i++) {
			var a = key ^ buf.readUInt8(i);
			key = buf.readUInt8(i);
			result += String.fromCharCode(a);
		}
		return result;
	}

	this.turnOn = function(cb) {
		return send({
			"system": {
				"set_relay_state": {
					"state": 1
				}
			}
		}, cb);
	}

	this.turnOff = function(cb) {
		return send({
			"system": {
				"set_relay_state": {
					"state": 0
				}
			}
		}, cb);
	}

	this.getInfo = function(cb) {
		return send({
			"system": {
				"get_sysinfo": {}
			}
		}, cb)
	}

	this.sendRaw = function(json, cb) {
		return send(json, cb);
	}
}

module.exports = TPLink_SmartHome;
