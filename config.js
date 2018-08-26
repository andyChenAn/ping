exports.welcome = {
    file : 'index.html'
};
exports.port = 3000;
exports.expires = {
    fileMatch : /^(gif|png|jpg|jpeg|css|js)$/gi,
    maxAge : 60 * 60 * 24 * 365
};
exports.compress = {
    match : /css|html/gi
};
exports.timeout = 1 * 60 * 1000;