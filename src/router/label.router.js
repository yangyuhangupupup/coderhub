const Router = require('koa-router');
const { checkauth } = require('../middleware/auth.middleware');
const { create, list } = require('../controller/label.controller.js');
const labelRouter = new Router({ prefix: '/label' });

labelRouter.post('/', checkauth, create);
labelRouter.get('/', list);

module.exports = labelRouter;
