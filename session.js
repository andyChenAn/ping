function Session (sessionId) {
    this.sessionId = sessionId;
    this.map = {};
}
Session.prototype.set = function (name , value) {
    this.map[name] = value;
}
Session.prototype.get = function (name) {
    return this.map[name];
}
Session.prototype.remove = function (name) {
    delete this.map[name];
}
Session.prototype.removeAll = function () {
    delete this.map;
    this.map = {};
};
Session.prototype.updateTime = function () {
    this.updateTime = new Date().getTime();
}
let SESSION_KEY = exports.SESSION_KEY = 'session_id';

function SessionManager (timeout) {
    this.timeout = timeout;
    this.sessions = {};
}
SessionManager.prototype.get = function (sessionId) {
    return this.sessions[sessionId];
};
SessionManager.prototype.renew = function (response) {
    let self = this;
    let sessionId = [new Date().getTime() , Math.round(Math.random() * 1000)].join('');
    let session = new Session(sessionId);
    session.updateTime();
    this._sessions[sessionId] = session;
    let clientTimeout = 30 * 24 * 60 * 60 * 1000;
    let cookie = {key : SESSION_KEY , value : sessionId , path : '/' , expires : new Date().getTime() + clientTimeout};
    response.setCookie(cookie);
    return session;
};
SessionManager.prototype.remove = function (sessionId) {
    delete this.sessions[sessionId];
};
SessionManager.prototype.isTimeout = function (session) {
    return (session.updateTime + this.timeout) < new Date().getTime();
};
exports.Session = Session;
exports.SessionManager = SessionManager;