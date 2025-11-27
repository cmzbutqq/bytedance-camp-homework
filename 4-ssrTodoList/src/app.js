const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const serve = require('koa-static');
const path = require('path');
const todosRouter = require('./routes/todos');
const pagesRouter = require('./routes/pages');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 配置静态资源服务
app.use(serve(path.join(__dirname, '../public')));

// 配置视图模板引擎
app.use(views(path.join(__dirname, 'views'), {
  extension: 'ejs'
}));

// 使用 bodyParser 中间件解析 JSON 请求体
app.use(bodyParser());

// 使用页面路由（SSR）
app.use(pagesRouter.routes());
app.use(pagesRouter.allowedMethods());

// 使用 API 路由
app.use(todosRouter.routes());
app.use(todosRouter.allowedMethods());

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;

