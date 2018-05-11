let route = require('koa-route');
const compose = require('koa-compose');

module.exports = compose([
    route.get('/', require('../controllers/index')),
    route.get('/hello', require('../controllers/hello')),
    route.post('/api/log',require('../controllers/log')),
    // route.get('/api/login')
]);