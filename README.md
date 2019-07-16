# TP-Link Smartplug Control for Node
Functionality ported from https://github.com/softScheck/tplink-smartplug to Node.js.

This library allows you to control HS100 and HS110 devices from TP-Link from Node.

# Installation

    npm i tplink-smartplug-node

# Usage

Simple example:

```javascript
const TPLinkSmartPlug = require('tplink-smartplug-node');

let tp = new TPLinkSmartPlug("192.168.1.100");

tp.turnOn().then(resp => {
    // resp should be { system: { set_relay_state: { err_code: 0 } } }
});
```

An example of all methods can be found in _test.js_.

# Methods

## TPLinkSmartPlug

**constructor**(ip)  
Creates a new instance of the API. This does not connect to the plug yet.

**turnOn()**  
Turns the plug on. Returns a promise resolving to the reply from the plug.

**turnOff()**  
Turns the plug off. Returns a promise resolving to the reply from the plug.

**query()**  
Queries the state of the plug. Returns a promise resolving to the reply from the plug.