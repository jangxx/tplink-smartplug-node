const TPLink_SmartHome = require('./index.js');

var ip = process.argv[2];
var command = process.argv[3];

console.log("Sending command", command, "to ip:", ip);

var tp = new TPLink_SmartHome(ip, function(err) {
	if(err) return console.log(err);

	switch(command) {
		case "on":
			tp.turnOn((parsed, resp) => console.log("resp:", resp));
			break;
		case "off":
			tp.turnOff((parsed, resp) => console.log("resp:", resp));
			break;
		case "info":
			tp.getInfo((parsed, resp) => console.log("resp:", resp));
			break;
		default:
			console.log("Command", command, "is not known");
			break;
	}
});
