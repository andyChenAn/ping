const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('./mime.js');
const config = require('./config.js');
const util = require('./util');
const zlib = require('zlib');

function Asset () {

};
/**
 * 资源分发功能，当我们请求一个网址时，服务器会返回一个页面的数据
 * 一个页面中的数据主要包括：html文件，css文件，js文件，图片等
 * 我们通过请求路径来判断客户端需要请求的数据是什么，然后再判断该资源是否需要http缓存，最后将数据返回给客户端
 * @param {object} request 
 * @param {object} response 
 */
Asset.prototype.dispatch = function (request , response) {
    response.setHeader('Server' , 'Node/V5');
    response.setHeader('Accept-Ranges' , 'bytes');
    let pathname = url.parse(request.url).pathname;
    // 判断请求路径的末尾是否是"/"，如果是"/"，那么就将请求路径的末尾添加"index.html"
    if (pathname.slice(-1) == '/') {
        pathname = pathname + config.welcome.file;
    };
    // 设置访问资源的真实路径
    let realPath = path.join('assets' , pathname);
    var realPathHandle = function (realPath) {
        // 检查路径是否存在
        fs.stat(realPath , function (err , stats) {
            if (err) {
                response.setHeader('Content-Type' , 'text/plain');
                response.writeHead(404 , 'Not Found')
                response.end(`this request url : ${realPath} is not exists!`);
            } else {
                // 如果该路径是一个目录，那么就将该目录下的index.html文件的内容返回给客户端
                if (stats.isDirectory()) {
                    realPath = path.join(realPath , '/' , config.welcome.file);
                    realPathHandle(realPath);
                } else {
                    // 获取文件的后缀名
                    let ext = path.extname(realPath).slice(1);
                    ext = ext ? ext : 'unknow';
                    let contentType = mime.types[ext] ? mime.types[ext] : 'text/plain';
                    response.setHeader('Content-Type' , contentType);
                    let lastModified = stats.mtime.toUTCString();
                    let IfModifiedSince = 'If-Modified-Since'.toLowerCase();
                    // 设置缓存
                    if (ext.match(config.expires.fileMatch)) {
                        let expires = new Date();
                        expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
                        response.setHeader('expires' , expires.toUTCString());
                        response.setHeader('Cache-Control' , 'max-age=' + config.expires.maxAge);
                    };
                    // 判断文件修改的时间是否和上一次修改的时间一样，如果一样就直接返回数据
                    // 协商缓存
                    if (request.headers['ifModifiedSince'] && request.headers['ifModifiedSince'] == lastModified) {
                        response.writeHead(304 , 'Not Modified');
                        response.end();
                    } else {
                        let raw = fs.createReadStream(realPath);
                        response.setHeader('Content-Length' , stats.size);
                        response.writeHead(200 , 'ok');
                        raw.pipe(response);
                    }
                }
            }
        });
    };
    realPathHandle(realPath)
};
exports.Asset = Asset;
