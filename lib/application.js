const http = require('http');
const Router = require('./router');
const app = {
        _router: new Router(),
        get: function(path, fn) {
            this._router.get(path, fn);
        },

        listen: function(port, cb) {
            const server = http.createServer((req, res) => {
                if (!res.send) {
                    res.send = function send(body) {
                        res.writeHead(200, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(body);
                    };
                }
                return this._router.handle(req, res);
            });
            return server.listen.apply(server, arguments);
        }
    }

module.exports = app;