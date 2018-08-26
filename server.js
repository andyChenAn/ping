const http = require('http');
const ping = require('./ping.js');
const Framework = require('./framework.js').Framework;
const Asset = require('./asset.js').Asset;

let framework = new Framework();
ping.createServer(framework).listen(3000);
console.log('Dynamic server is running at 3000 port.');