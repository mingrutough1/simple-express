
const Layer = require('./layer');
const Route = require('./route');

function Router() {
    this.stack=[new Layer('*',(req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('404');
        })];
}
Router.prototype.route = function(path) {
    const route = new Route(path);
    const layer = new Layer(path, (req, res) => {
        route.dispatch(req, res);
    });
    layer.route = route;
    this.stack.push(layer);
    return route;
}
Router.prototype.get = function(path, fn) {
    const route = this.route(path);
    route.get(fn);

    return this;
}

Router.prototype.handle = function(req, res) {
    const method = req.method;
    for (let i = 1, len = this.stack.length; i<len;i++) {
        if (this.stack[i].match(req.url) && this.stack[i].route&&this.stack[i].route._handle_method(method)) {
            return this.stack[i].handle_request(req, res);
        }
    }
    return this.stack[0].handle_request(req, res);
}
module.exports = Router;