const session = require('./session.js');
const config = require('./config.js');
const url = require('url');
const http = require('http');
const cookie = require('./cookie.js');
class Framework {
    constructor () {
        this.sessionManager = new session.SessionManager(config.timeout);
    }
    dispatch (request , response) {
        if (request.url == '/favicon.ico') {
            response.writeHead(404 , 'Not Found' , {'Content-Type' : 'text/plain'});
            response.end();
            return;
        }
        let routeInfo = this.route(request.url);
        let controller = require('./controllers/' + routeInfo.controller + '.js');
        let method = request.method.toLowerCase() || 'get';
        let action = controller[method] ? controller[method][routeInfo.action] : null;
        if (action) {
            this.enableCookie(request , response);
        } else {
            this.handler500(request , response , err);
        }
    }
    route (requestUrl) {
        let pathname = url.parse(requestUrl).pathname;
        let path = pathname.split('/');
        // 删除掉第一个'/'
        path.shift();
        return {
            controller : path[0] || 'index',
            action : path[1] || 'index',
            args : path.slice(2)
        }
    }
    handler500 (request , response , err) {
        response.writeHead(500 , {'Content-Type' : 'text/plain'});
        response.end(err);
    }
    enableCookie (request , response) {
        http.IncomingMessage.prototype.getCookie = function (key) {
            if (!this._cookieMap) {
                this._cookieMap = cookie.parse(request.headers.cookie || '');
            }
            return this._cookieMap[key];
        };
        http.IncomingMessage.prototype.setCookie = function (cookieObj) {
            if (!this._setCookieMap) {
                this._setCookieMap = {};
            }
            this._setCookieMap[cookieObj.key] = cookie.stringify(cookieObj);
            let res = [];
            for (let key in this._setCookieMap) {
                res.push(this._setCookieMap[key]);
            }
            response.setHeader('Set-Cookie' , res.join(','))
        }
    }
};
exports.Framework = Framework;