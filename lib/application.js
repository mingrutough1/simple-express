const http = require('http');
const Router = require('./router');
const methods = require('methods');
const request = require('./request');
const response = require('./response');
const middleware = require('./middleware/init');

function Application() {
}
Application.prototype.lazyrouter = function() {
    if(!this._router) {
        this._router = new Router();

        this._router.use(middleware.init());
    }
};
Application.prototype.handle = function(req, res) {

    const done = function finalhandler(err) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        if(err) {
            res.end('404: ' + err);    
        } else {
            var msg = 'Cannot ' + req.method + ' ' + req.url;
            res.end(msg);    
        }
    };
    // 这里无需调用lazyrouter，因为listen前一定调用了.use或者.METHODS方法。
    // 如果二者都没有调用，没有必要创建路由系统。this._router为undefined。
    var router = this._router;
    if(router) {
        router.handle(req, res, done);
    } else {
        done();
    }
}
Application.prototype.listen = function(port, cb) {
    const server = http.createServer((req, res) => {
        return this.handle(req, res);
    });
    return server.listen.apply(server, arguments);
}
Application.prototype.use = function(fn) { // 支持path 加fn。
    this.lazyrouter();
    let path = '/',
        router = this._router;
    if (typeof fn !== 'function') {
        path = fn;
        fn = arguments[1];
    }

    router.use(path, fn);
}
methods.forEach((method) => {
    Application.prototype[method] = function(path, fn) {
        this._router[method](path, fn);
        return this;
    }
});
module.exports = Application;