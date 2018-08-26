const path = require('path');
const fs = require('fs');
const footprint = require('footprint');
function Context (request , response , session , framework) {
    this.request = request;
    this.response = response;
    this.session = session;
    this.framework = framework;
};
/**
 * 请求成功，但是后端没有返回任何数据数据
 */
Context.prototype.none = function () {
    this.response.writeHead(204);
    this.response.end();
};
/**
 * 请求成功，后端返回的是json数据
 * @param {Object} json 
 */
Context.prototype.renderJSON = function (json) {
    this.response.setHeader('Content-Type' , 'application/json');
    this.response.writeHead(200);
    this.response.end(JSON.stringify(json));
};
/**
 * 重定向
 * @param {String} url 
 */
Context.prototype.redirect = function (url) {
    this.response.setHeader('Location' , url);
    this.response.writeHead(301);
    this.response.end();
};
/**
 * 内部渲染视图
 * @param {Object} viewEngine 
 * @param {String} template 
 * @param {Object} data 
 */
Context.prototype._renderView = function (viewEngine , template , data) {
    let framework = this.framework,
        request = this.request,
        response = this.response;
        try {
            response.writeHead(200 , 'ok' , {'Content-Type' : 'text/html;charset=utf-8'});
            response.write(template);
            response.end();
        } catch (e) {
            console.log(e.message);
            console.log(e.stack);
            framework.handler500(request , response , 'Parse template error.');
        }
};
/**
 * 渲染视图
 * @param {String} view 
 * @param {Object} data 
 */
Context.prototype.renderView = function (view , data) {
    let context = this,
        request = this.request,
        response = this.response,
        framework = this.framework;
    
    let viewEngine  = footprint;

    viewEngine._cache = viewEngine._cahce || {};
    let template = viewEngine._cache[view];
    if (template) {
        context._renderView(viewEngine , template , data);
    } else {
        let filePath = path.join(__dirname , 'views/' , view);
        fs.stat(filePath , function (err , stats) {
            if (err) {
                framework.handler500(request , response , 'this template file dose not exist.');
            } else {
                fs.readFile(filePath , 'utf8' , function (err , file) {
                    if (err) {
                        framework.handler500(request , response , err);
                    } else {
                        viewEngine._cache[view] = file;
                        context._renderView(viewEngine , file , data);
                    }
                });
            }
        })
    }
};
Context.prototype.renderPartial = Context.prototype.renderView;
exports.Context = Context;