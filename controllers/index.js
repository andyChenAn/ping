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
    var obj = {
        show : false,
        name : 'andy',
        age : 22,
        address : '广州1',
        list : [1,2,3,4]
    };
    this.renderView('index.html' , obj);
};