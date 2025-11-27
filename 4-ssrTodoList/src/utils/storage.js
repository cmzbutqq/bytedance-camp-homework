const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../todos.json');

/**
 * 读取所有 Todo 数据
 * @returns {Promise<Array>} Todo 数组
 */
async function readTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回空数组
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 保存 Todo 数据到文件
 * @param {Array} todos - Todo 数组
 * @returns {Promise<void>}
 */
async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

/**
 * 生成唯一 ID
 * @returns {string} 唯一 ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  readTodos,
  writeTodos,
  generateId
};

