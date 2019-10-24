const express = require('../index');
const app = express();
const router = express.Router();
console.log(typeof express.Router());
app.use(function test1(req, res, next) {
    console.log('Time：', Date.now());
    next();
});

app.get('/', function test2(req, res, next) {
    res.send('first');
});


router.use(function test3(req, res, next) {
    console.log('Time2: ', Date.now());
    next();
});

router.use('/', function test4(req, res, next) {
    res.send('second');
});

app.use('/user', router);

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});