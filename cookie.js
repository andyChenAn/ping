/**
 * 将cookie解析为json对象
 * @param {String} cookies 
 */
exports.parse = function (cookies) {
    let res = {};
    let pairs = cookies.split(';');
    for (let i = 0 ; i < pairs.length ; i++) {
        let s = pairs[i].split('=');
        let key = s[0];
        let value = s[1];
        res[key] = value || '';
    };
    return res;
};
/**
 * 将单个cookie对象字符串序列化
 * @param {Object} cookie 
 */
exports.stringify = function (cookie) {
    let buffer = [cookie.key , '=' , cookie.value];
    if (cookie.expires) {
        buffer.push('; expires=' , (new Date(cookie.expires)).toUTCString());
    };
    if (cookie.path) {
        buffer.push(';path=' , cookie.path)
    };
    if (cookie.domain) {
        buffer.push(';domain=' , cookie.domain);
    }
    if (cookie.secure) {
        buffer.push('; secure');
    };
    if (cookie.httpOnly) {
        buffer.push('; httpOnly');
    }
    return buffer.join('');
};