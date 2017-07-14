const TPLink_SmartHome = require('./index.js');

var ip = process.argv[2];
var command = process.argv[3];

console.log("Sending command", command, "to ip:", ip);

var tp = new TPLink_SmartHome(ip, function() {
	switch(command) {
		case "on":
			tp.turnOn();
			break;
		case "off":
			tp.turnOff();
			break;
		case "info":
			tp.getInfo((parsed, resp) => console.log("resp:", resp));
		default:
			console.log("Command", command, "is not known");
			break;
	}
});
