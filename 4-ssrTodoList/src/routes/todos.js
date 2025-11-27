const Router = require('koa-router');
const { readTodos, writeTodos, generateId } = require('../utils/storage');

const router = new Router({
  prefix: '/api/todos'
});

/**
 * GET /api/todos
 * 获取所有的 Todo 任务
 */
router.get('/', async (ctx) => {
  try {
    const todos = await readTodos();
    ctx.body = todos;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '读取数据失败' };
  }
});

/**
 * POST /api/todos
 * 创建一个新的 Todo 任务
 */
router.post('/', async (ctx) => {
  try {
    const { title, completed = false } = ctx.request.body;

    // 验证必填字段
    if (!title || typeof title !== 'string') {
      ctx.status = 400;
      ctx.body = { error: 'title 字段是必填的，且必须是字符串类型' };
      return;
    }

    // 验证 completed 字段类型
    if (typeof completed !== 'boolean') {
      ctx.status = 400;
      ctx.body = { error: 'completed 字段必须是布尔值' };
      return;
    }

    const todos = await readTodos();
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      completed,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await writeTodos(todos);

    ctx.status = 201;
    ctx.body = newTodo;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '创建任务失败' };
  }
});

/**
 * PUT /api/todos/:id
 * 根据 ID 更新一个已存在的 Todo 任务
 */
router.put('/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const { title, completed } = ctx.request.body;

    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      ctx.status = 404;
      ctx.body = { error: '任务未找到' };
      return;
    }

    // 更新字段
    if (title !== undefined) {
      if (typeof title !== 'string') {
        ctx.status = 400;
        ctx.body = { error: 'title 字段必须是字符串类型' };
        return;
      }
      todos[todoIndex].title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        ctx.status = 400;
        ctx.body = { error: 'completed 字段必须是布尔值' };
        return;
      }
      todos[todoIndex].completed = completed;
    }

    await writeTodos(todos);

    ctx.body = todos[todoIndex];
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '更新任务失败' };
  }
});

/**
 * DELETE /api/todos/:id
 * 根据 ID 删除一个 Todo 任务
 */
router.delete('/:id', async (ctx) => {
  try {
    const { id } = ctx.params;

    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      ctx.status = 404;
      ctx.body = { error: '任务未找到' };
      return;
    }

    todos.splice(todoIndex, 1);
    await writeTodos(todos);

    ctx.status = 204;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '删除任务失败' };
  }
});

module.exports = router;

