const Layer = require('./layer');

function Route(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
}

Route.prototype._handle_method = function(method) {
    const name = method.toLowerCase();
    return Boolean(this.methods[name]);
}

Route.prototype.get = function(fn) {
    const layer = new Layer('/', fn);
    layer.method = 'get';
    this.methods['get'] = true;
    this.stack.push(layer);
    return this;
}

Route.prototype.dispatch = function(req, res) {
    const method = req.method.toLowerCase();
    for(let i = 0, len=this.stack.length; i<len; i++) {
        if (method === this.stack[i].method) {
            return this.stack[i].handle_request(req, res);
        }
    }
}
module.exports = Route;