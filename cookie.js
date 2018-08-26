class Cookie {
    constructor () {

    }
    parse (cookies) {
        let res = {};
        let cookieArr = cookies.split(';');
        for (let i = 0 ; i < cookieArr.length ; i++) {
            let s = cookieArr[i].split('=');
            let key = s[0];
            let value = s[1];
            res[key] = value;
        };
        return res;
    }
    stringify (cookieObj) {
        let res = cookieObj.key + '=' + cookieObj.value;
        if (cookieObj.expires) {
            let expires = ';expires=' + cookieObj.expires;
            res += expires;
        };
        if (cookieObj.domain) {
            let domain = ';domain=' + cookieObj.domain;
            res += domain;
        };
        if (cookieObj.path) {
            let path = ';path=' + cookieObj.path;
            res += path;
        };
        if (cookieObj.httpOnly) {
            res += ';httpOnly';
        };
        if (cookieObj.secure) {
            res += ';secure';
        }
        return res;
    }
};
exports.Cookie = Cookie;