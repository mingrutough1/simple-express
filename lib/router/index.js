
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods');

const proto = {};
proto.use = function(fn) {
    let path = '/';
    if (typeof fn !== 'function') {
        path = fn;
        fn = arguments[1];
    }
    const layer = new Layer(path, fn);
    layer.route = undefined;
    this.stack.push(layer);

    return this;
};
proto.route = function(path) {
    const route = new Route(path);
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
}
methods.forEach((method) => {
    proto[method] = function(path, fn) {
        const route = this.route(path);
        route[method].call(route, fn);
    
        return this;
    }
});

proto.handle = function(req, res, done) {
    var self = this,
        method = req.method,
        idx = 0, stack = self.stack;
    function next(err) {
        var layerError = (err === 'route' ? null : err);

        //跳过路由系统
        if(layerError === 'router') {
            return done(null);
        }

        if(idx >= stack.length || layerError) {
            return done(layerError);
        }

        var layer = stack[idx++];
        //匹配，执行
        if (layer.match(req.url)) {
            if (!layer.route){ // 处理中间件
                layer.handle_request(req, res, next);
            } else if(layer.route._handle_method(method)) { //确保请求的method有注册过
                //处理路由
                layer.handle_request(req, res, next);
            } 
        } else {
            layer.handle_error(layerError, req, res, next);
        }
    }

    next();
}
module.exports = function() {
    function router(req, res, next) {
        router.handle(req, res, next);
    }
    Object.setPrototypeOf(router, proto);
    router.stack = [];
    return router;
};