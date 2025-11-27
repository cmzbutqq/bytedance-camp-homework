const Router = require('koa-router');
const { readTodos } = require('../utils/storage');

const router = new Router();

/**
 * GET /
 * 首页 - SSR 渲染 Todo List 页面
 */
router.get('/', async (ctx) => {
  try {
    const todos = await readTodos();
    await ctx.render('index', {
      todos,
      title: 'Todo List - 任务管理'
    });
  } catch (error) {
    ctx.status = 500;
    await ctx.render('error', {
      error: '加载数据失败，请稍后重试'
    });
  }
});

module.exports = router;

