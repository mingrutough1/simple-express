const Layer = require('./layer');
const methods = require('methods');

function Route(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
}

Route.prototype._handle_method = function(method) {
    const name = method.toLowerCase();
    console.log(method);
    return Boolean(this.methods[name]);
}

methods.forEach((method) => {
    Route.prototype[method] = function(fn) {
        const layer = new Layer('/', fn);
        layer.method = method;
        this.methods[method] = true;
        this.stack.push(layer);
        return this;
    }
});

Route.prototype.dispatch = function(req, res, done) {
    const self = this;
    const method = req.method.toLowerCase();
    let idx = 0, stack = this.stack;
    function next(err) {
        //跳过route
        if(err && err === 'route') {
            return done();
        }

        //跳过整个路由系统
        if(err && err === 'router') {
            return done(err);
        }

        //越界
        if(idx >= stack.length) {
            return done(err);
        }

        //不等枚举下一个
        var layer = stack[idx++];
        if(method !== layer.method) {
            return next(err);
        }

        if(err) {
            //主动报错
            layer.handle_error(err, req, res, next);
        } else {
            layer.handle_request(req, res, next);
        }
    }

    next();
}
module.exports = Route;