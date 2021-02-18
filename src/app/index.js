const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const userRouter = require('../router/index');
// const userRouter = require('../router/users.router');
// const AuthRouter = require('../router/auth.router');
const { errorhandle } = require('./err-handle');
app.use(bodyParser());
userRouter(app);
// app.use(userRouter.routes());
// app.use(userRouter.allowedMethods());
// app.use(AuthRouter.routes());
// app.use(AuthRouter.allowedMethods());

app.on('error', errorhandle);
module.exports = app;
