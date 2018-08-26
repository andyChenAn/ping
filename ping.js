const http = require('http');
const https = require('https');
const config = require('./config.js');
exports.createServer = function (framework , options) {
    options = options || config.secure;
    let server = options ? https.createServer(options) : http.createServer();
    server.on('request' , function (request , response) {
        framework.dispatch(request , response);
    });
    return server;
}