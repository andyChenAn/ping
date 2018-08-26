let get = exports.get = {};
get.index = function () {
    let response = this.response;
    response.setHeader('Content-Type' , 'text/html');
    response.writeHead(200 , 'ok');
    response.end('<h1>hello Nodejs.</h1>')
};
get.none = function () {
    this.none();
};
get.json = function () {
    let obj = {'hello' : 'world'};
    return this.renderJSON(obj);
};
get.redirect = function () {
    this.redirect('https://github.com/');
};
get.render = function () {
    let obj = {title : 'nodejs'};
    this.renderView('index.html' , obj);
};