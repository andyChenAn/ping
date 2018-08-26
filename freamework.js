const http = require('http');
const url = require('url');
const cookie = require('./cookie.js');
const session = require('./session.js');
const config = require('./config.js');
const path = require('path');
const Context = require('./context.js').Context;

function Framework () {
    this.sessionManager = new session.sessionManager(config.timeout);
}
Framework.prototype.dispatch = function (request , response) {
    if (request.url == '/favicon.ico') {
        response.writeHead(404 , 'Not Found');
        response.end();
        return;
    };
    let routeInfo = this.route(request.url);
    let controller;
    try {
        controller = require('./controllers/' + routeInfo.controller);
        let method = request.method.toLowerCase() || 'get';
        let action = controller[method] ? controller[method][routeInfo.action] : null;
        if (action) {
            this.enableGet(request , response);
        }
    } catch (err) {

    }
};
/**
 * 格式化路由对象
 * 通过解析请求路径，返回一个格式化的路由对象
 * @param {String} requestUrl 
 */
Framework.prototype.route = function (requestUrl) {
    let pathname = url.parse(requestUrl).pathname;
    let path = pathname.split('/');
    path.shift();
    return {
        controller : path[0] || 'index',
        action : path[1] || 'index',
        args : path.slice(2) || []
    }
};
Framework.prototype.enableGet = function (request , response) {
    http.IncomingMessage.prototype.get = function (key) {
        if (!this._urlMap) {
            this._urlMap = url.parse(this.url , true);
        }
        return this._urlMap.query[key];
    }
};