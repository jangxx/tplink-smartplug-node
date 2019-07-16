const net = require('net');

class TPLinkSmartPlug {
	/**
	 * Create a new control instance. This does not connect to the plug yet.
	 * @param {string} ip 
	 */
	constructor(ip) {
		if (ip  == undefined) throw new Error("No IP address specified");

		this._address = ip;
	}

	_connect() {
		return new Promise((resolve, reject) => {
			let errorListener = err => {
				reject(err);
			};

			let socket = net.connect(9999, this._address, () => {
				socket.off("error", errorListener); // remove error listener

				return resolve(socket);
			});

			socket.on("error", errorListener);
		});
	}

	_encrypt(str) {
		let key = 171;
		let buf = Buffer.alloc(4 + str.length);
		buf.writeUInt32BE(str.length); // write length in network byte order

		for(let i = 0; i < str.length; i++) {
			let a = key ^ str.charCodeAt(i);
			key = a;
			buf.writeUInt8(a, 4 + i);
		}

		return buf;
	}

	_decrypt(buf) {
		let key = 171;
		let result = "";
		
		for(let i = 4; i < buf.length; i++) {
			let a = key ^ buf.readUInt8(i);
			key = buf.readUInt8(i);
			result += String.fromCharCode(a);
		}

		return result;
	}

	_send(socket, obj) {
		return new Promise((resolve, reject) => {
			let data = this._encrypt(JSON.stringify(obj));
	
			socket.on("data", data => {
				socket.end();

				let response = this._decrypt(data);

				try {
					response = JSON.parse(response);
				} catch(err) {
					return reject(err);
				}

				return resolve(response);
			});

			socket.on("error", err => {
				return reject(err);
			});

			socket.write(data, 'binary');
		});
	}

	/**
	 * Turn this plug on
	 * @return {Promise<Object>} A promise reolving to the reply
	 */
	turnOn() {
		return this._connect().then(socket => this._send(socket, {
			system: {
				set_relay_state: {
					state: 1
				}
			}
		}));
	}

	/**
	 * Turn this plug off
	 * @return {Promise<Object>} A promise reolving to the reply
	 */
	turnOff() {
		return this._connect().then(socket => this._send(socket, {
			system: {
				set_relay_state: {
					state: 0
				}
			}
		}));
	}

	/**
	 * Queries the plug for it's state
	 * @return {Promise<Object>} A promise reolving to the reply
	 */
	query() {
		return this._connect().then(socket => this._send(socket, {
			system: {
				get_sysinfo: {}
			}
		}));
	}
}

module.exports = TPLinkSmartPlug;