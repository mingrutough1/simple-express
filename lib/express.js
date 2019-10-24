const Application = require('./application');
const Router = require('./router/index');
function createApplication() {
    const app = new Application();
    return app;
}


module.exports = createApplication;
createApplication.Router = Router;