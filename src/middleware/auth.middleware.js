const jwt = require('jsonwebtoken');
const { PUBLIC_KEY } = require('../app/config');
const { checkResource } = require('../service/auth.service');
const {
	USER_DOES_NOT_EXISTS,
	PASSWORD_IS_INCORRENT,
	UNPERMISSION,
	UNAUTHORIZATION,
} = require('../constance/error-types');
const { md5pasword } = require('../utils/password-handle');
const checklogin = async (ctx, next) => {
	const { name, password } = ctx.request.body;
	//判断user和password是否为空
	if (!name || !password || name === '' || password === '') {
		const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);
		return ctx.app.emit('error', error, ctx);
	}
	//判断user是否存在
	const { getUserByName } = require('../service/user.service');
	const result = await getUserByName(name);
	const user = result[0];
	if (!user) {
		const error = new Error(USER_DOES_NOT_EXISTS);
		return ctx.app.emit('error', error, ctx);
	}
	//判断密码是否是否错误
	if (md5pasword(password) !== user.password) {
		const error = new Error(PASSWORD_IS_INCORRENT);
		return ctx.app.emit('error', error, ctx);
	}
	ctx.user = user;
	await next();
};

const checkauth = async (ctx, next) => {
	console.log('验证是否登录成功的middleware');
	//1.获取token
	const authorization = ctx.headers.authorization;

	if (!authorization) {
		const error = new Error(UNAUTHORIZATION);
		return ctx.app.emit('error', error, ctx);
	}
	const token = authorization.replace('Bearer ', '');

	//2.验证token
	try {
		const result = jwt.verify(token, PUBLIC_KEY, {
			algorithms: ['RS256'],
		});

		ctx.user = result;
		await next();
	} catch (err) {
		console.log(err);
		const error = new Error(UNAUTHORIZATION);
		ctx.app.emit('error', error, ctx);
	}
};

const checkpermission = async (ctx, next) => {
	console.log('验证权限的middleware');
	//1.获取参数
	const [resourceKey] = Object.keys(ctx.params);
	const tableName = resourceKey.replace('Id', '');
	const resouceId = ctx.params[resourceKey];
	const { id } = ctx.user;
	//2.查询是否具备权限
	try {
		const isPermission = await checkResource(tableName, resouceId, id);
		if (!isPermission) throw new Error();
		await next();
	} catch (err) {
		const error = new Error(UNPERMISSION);
		return ctx.app.emit('error', error, ctx);
	}
};
module.exports = {
	checklogin,
	checkauth,
	checkpermission,
};
