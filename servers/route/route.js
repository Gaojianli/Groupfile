const route = require('koa-route');
const compose = require('koa-compose');
const index = require('../controllers/index');
const hello = require('../controllers/hello')


module.exports = compose([
    route.get('/', index),
    route.get('/hello', hello)
]);