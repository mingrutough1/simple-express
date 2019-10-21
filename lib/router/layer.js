function Layer(path, fn) {
    this.handle = fn;
    this.name = fn.name || '<anonymous>';
    this.path = path;
}

Layer.prototype.handle_request = function(req, res){
    const fn = this.handle;
    if (fn) {
        fn(req, res);
    }
}

Layer.prototype.match = function(path) {
    if (path === this.path || path === "*"){
        return true;
    }
    return false;
}
module.exports = Layer;