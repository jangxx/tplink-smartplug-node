const TPLinkSmartPlug = require('./index.js');

const ip = process.argv[2];
const command = process.argv[3];

console.log("Sending command", command, "to ip:", ip);

let tp = new TPLinkSmartPlug(ip);

switch(command) {
	case "on":
		tp.turnOn().then(console.log).catch(console.log);
		break;
	case "off":
		tp.turnOff().then(console.log).catch(console.log);
		break;
	case "info":
		tp.query().then(console.log).catch(console.log);
		break;
	default:
		console.log("Command", command, "is not known");
		break;
}
