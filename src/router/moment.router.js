const Router = require('koa-router');

const momentRouter = new Router({ prefix: '/moment' });
const {
	create,
	detail,
	list,
	update,
	remove,
	addLabels,
	fileInfo,
} = require('../controller/moment.controller');
const { checkauth, checkpermission } = require('../middleware/auth.middleware');
const { checkLabelExists } = require('../middleware/label.middleware');
momentRouter.post('/', checkauth, create);
momentRouter.get('/:momentId', detail);
momentRouter.get('/', list);
//1.必须登录 ，2.看是否具有权限
momentRouter.patch('/:momentId', checkauth, checkpermission, update);
momentRouter.delete('/:momentId', checkauth, checkpermission, remove);
//给动态添加标签
momentRouter.post(
	'/:momentId/labels',
	checkauth,
	checkpermission,
	checkLabelExists,
	addLabels
);
momentRouter.get('/images/:filename', fileInfo);
module.exports = momentRouter;
