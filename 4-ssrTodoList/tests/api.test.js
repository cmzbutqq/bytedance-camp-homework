/**
 * Todo API 测试文件
 * 使用 curl 或 Postman 进行手动测试
 * 
 * 测试步骤：
 * 1. 启动服务器: npm start
 * 2. 按照以下顺序执行测试命令
 */

// 1. 创建任务
// curl -X POST http://localhost:3000/api/todos \
//   -H "Content-Type: application/json" \
//   -d '{"title": "测试任务1", "completed": false}'

// 2. 获取所有任务
// curl http://localhost:3000/api/todos

// 3. 更新任务（替换 {id} 为实际的任务 ID）
// curl -X PUT http://localhost:3000/api/todos/{id} \
//   -H "Content-Type: application/json" \
//   -d '{"title": "更新后的任务", "completed": true}'

// 4. 删除任务（替换 {id} 为实际的任务 ID）
// curl -X DELETE http://localhost:3000/api/todos/{id}

// 5. 测试错误情况
// - 创建任务时缺少 title 字段
// curl -X POST http://localhost:3000/api/todos \
//   -H "Content-Type: application/json" \
//   -d '{"completed": false}'

// - 更新不存在的任务
// curl -X PUT http://localhost:3000/api/todos/invalid-id \
//   -H "Content-Type: application/json" \
//   -d '{"title": "测试"}'

// - 删除不存在的任务
// curl -X DELETE http://localhost:3000/api/todos/invalid-id

console.log('请使用 curl 或 Postman 进行 API 测试');
console.log('参考 README.md 中的测试命令');

