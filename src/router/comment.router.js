const Router = require('koa-router');
const { checkauth, checkpermission } = require('../middleware/auth.middleware');
const {
	create,
	reply,
	update,
	remove,
	list,
} = require('../controller/comment.controller');
const commentRouter = new Router({ prefix: '/comment' });

commentRouter.post('/', checkauth, create);
commentRouter.post('/:commentId/reply', checkauth, reply);
commentRouter.patch('/:commentId', checkauth, checkpermission, update);
commentRouter.delete('/:commentId', checkauth, checkpermission, remove);
commentRouter.get('/', list);
module.exports = commentRouter;
