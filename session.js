/**
 * Session类
 * 用于创建session
 */
class Session {
    constructor (sessionId) {
        this.sessionId = sessionId;
        this._updateTime = new Date();
        this.session_map = {};
    }
    get (name) {
        return this.session_map[name];
    }
    set (name , value) {
        this.session_map[name] = value;
    }
    remove (name) {
        delete this.session_map[name];
    }
    removeAll () {
        this.session_map = {};
    }
    updateTime () {
        this._updateTime = new Date().getTime();
    }
};

const SESSION_KEY = exports.SESSION_KEY = 'session_id';

/**
 * 管理session类
 * 主要用于管理session
 */
class SessionManager {
    constructor (timeout) {
        this.timeout = timeout;
        this.sessions = {};
    }
    get (sessionId) {
        return this.sessions[sessionId];
    }
    renew (response) {
        let sessionId = new Date().getTime() + Math.round(Math.random() * 1000);
        let session = new Session(sessionId);
        session.updateTime();
        let expires = 10 * 60 * 1000;
        let cookie = {key : SESSION_KEY , value : sessionId , expires : expires , domain : '/' , path : '/'};
        response.setCookie(cookie);
        return session;
    }
    remove (sessionId) {
        delete this.sessions[sessionId];
    }
    isTimeout (session) {
        return (session.updateTime + this.timeout) < new Date().getTime();
    }
};
exports.Session = Session;
exports.SessionManager = SessionManager;