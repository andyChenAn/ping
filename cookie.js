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
exports.stringify = function (cookie) {

};