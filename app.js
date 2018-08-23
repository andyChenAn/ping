const http = require('http');
const config = require('./config.js');
const PORT = process.argv[2] || config.port;
const url = require('url');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const util = require('./util.js');
const mime = require('./mime.js');
const server = http.createServer((request , response) => {
    response.setHeader('Server' , 'Node/V8');
    response.setHeader('Accept-Ranges' , 'bytes');
    // 解析请求路径
    let pathname = url.parse(request.url).pathname;
    // 如果路径的最后一个字符是'/'，那么就将路径设置为当前路径下的'index.html'页面
    if (pathname.slice(-1) == '/') {
        pathname = pathname + config.welcome.file;
    }
    //获取真实的文件路径
    let realPath = path.join('assets' , pathname);
    function pathHandle (realPath) {
        fs.stat(realPath , (err , stats) => {
            if (err) {
                response.writeHead(404 , 'Not Found' , {'Content-Type' : 'text/plain;charset=utf-8'});
                response.end('这个请求路径: ' + pathname + ' 在服务器中不存在.');
            } else {
                // 如果请求的是一个目录，那么就会将该目录下的index.html文件作为返回的内容
                if (stats.isDirectory()) {
                    realPath = path.join(realPath , '/' , config.welcome.file);
                    pathHandle(realPath);
                } else {
                    let ext = path.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknow';
                    let contentType = mime.types[ext] || 'text/plain';
                    response.setHeader('Content-Type' , contentType);

                    let lastModified = stats.mtime.toUTCString();
                    let ifModifiedSince = 'If-Modified-Since'.toLowerCase();
                    response.setHeader('Last-Modified' , lastModified);
                    // 设置http缓存
                    if (ext.match(config.expires.fileMatch)) {
                        let expires = new Date();
                        expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
                        response.setHeader('Expires' , expires.toUTCString());
                        response.setHeader('Cache-Control' , 'max-age=' + config.expires.maxAge)
                    };
                    if (request.headers[ifModifiedSince] && request.headers[ifModifiedSince] == lastModified) {
                        response.writeHead(304 , 'Not Modified');
                        response.end();
                    } else {
                        // 压缩
                        let compressHandle = function (raw , statusCode , reasonPhrase , contentLength) {
                            let stream = raw;
                            let acceptEncoding = request.headers['accept-encoding'] || '';
                            let matched = ext.match(config.compress.match);
                            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                response.setHeader('Content-Encoding' , 'gzip');
                                stream = raw.pipe(zlib.createGzip());
                            } else if (matched && acceptEncoding.mathc(/\bdeflate\b/)) {
                                response.setHeader('Content-Encoding' , 'deflate');
                                stream = raw.pipe(zlib.createDeflate());
                            } else {
                                response.setHeader('Content-Length' , contentLength)
                            }
                            response.writeHead(statusCode , reasonPhrase);
                            stream.pipe(response);
                        };
                        // 分段传输
                        if (request.headers['range']) {
                            let range = util.parseRange(request.headers['range'] , stats.size);
                            if (range) {
                                response.setHeader('Content-Range' , 'bytes ' + range.start + '-' + range.end + '/' + stats.size);
                                let raw = fs.createReadStream(realPath , {
                                    start : range.start,
                                    end : range.end
                                });
                                compressHandle(raw , 206 , "Partial Content" , range.end - range.start + 1);
                            } else {
                                response.writeHead(416 , 'Request Range Not Satisfiable');
                                response.end();
                            }
                        } else {
                            let raw = fs.createReadStream(realPath);
                            compressHandle(raw , 200 , 'ok' , stats.size);
                        }
                    }
                }
            }
        });
    };
    pathHandle(realPath);
});
server.listen(config.port , () => {
    console.log(`listening port on ${config.port}`);
});