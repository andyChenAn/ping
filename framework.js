const http = require('http');
const url = require('url');
const Cookie = require('./cookie.js').Cookie;
const session = require('./session.js');
const config = require('./config.js');
const Context = require('./context.js').Context;
const cookie = new Cookie();
function Framework () {
    this.sessionManager = new session.SessionManager(config.timeout);
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
            this.enableCookie(request , response);
            let curSession = this.enableSession(request , response);
            let context = new Context(request , response , curSession , this);
            action.apply(context , routeInfo.args);
        } else {
            this.handler500(request, response, 'Error: Controller "' + routeInfo.controller + '" without action "' + routeInfo.action + '" for "' + request.method + '" request.');
        }
    } catch (err) {
        console.log(err.message);
        console.log(err.stack);
        this.handler500(request, response, 'Error: Controller "' + routeInfo.controller + '" dosen\'t exsit.');
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
Framework.prototype.enableCookie = function (request , response) {
    http.IncomingMessage.prototype.cookie = function () {
        this.cookie = function (key) {
            if (!this._cookieMap) {
                this._cookieMap = cookie.parse(this.headers.cookie || '');
            }
            return this._cookieMap[key];
        }
    };
    http.ServerResponse.prototype.setCookie = function (cookieObj) {
        if (!this._setCookieMap) {
            this._setCookieMap  = {};
        };
        this._setCookieMap[cookieObj.key] = cookie.stringify(cookieObj);
        let res = [];
        for (let key in this._setCookieMap) {
            res.push(this._setCookieMap[key]);
        };
        this.setHeader('Set-Cookie' , res.join(', '));
    }
};
Framework.prototype.enableSession = function (request , response) {
    let sessionManager = this.sessionManager;
    let sessionId = request.cookie(session.SESSION_KEY);
    let curSession;
    if (sessionId && (curSession = sessionManager.get(sessionId))) {
        if (sessionManager.isTimeout(curSession)) {
            sessionManager.remove(sessionId);
            curSession = sessionManager.renew(response);
        } else {
            curSession.updateTime();
        }
    } else {
        curSession = sessionManager.renew(response);
    }
    return curSession;
};
Framework.prototype.handler500 = function (request , response , err) {
    response.writeHead(500 , {'Content-Type' : 'text/plain'});
    response.end(err);
};
Framework.prototype.recept = function (request) {
    if (request.method == 'POST') {
        let _postData = '';
        request.on('data' , function (chunk) {
            _postData += chunk;
        });
        request.on('end' , function () {
            request.postData = _postData;
        })
    }
};
exports.Framework = Framework;