// API 基础 URL
const API_BASE = '/api/todos';

// 获取所有任务
async function fetchTodos() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('获取任务失败');
        return await response.json();
    } catch (error) {
        console.error('Error fetching todos:', error);
        alert('获取任务失败，请刷新页面重试');
        return [];
    }
}

// 创建任务
async function createTodo(title) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title.trim(),
                completed: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '创建任务失败');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating todo:', error);
        alert(error.message || '创建任务失败');
        throw error;
    }
}

// 更新任务
async function updateTodo(id, data) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '更新任务失败');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
        alert(error.message || '更新任务失败');
        throw error;
    }
}

// 删除任务
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok && response.status !== 204) {
            const error = await response.json();
            throw new Error(error.error || '删除任务失败');
        }

        return true;
    } catch (error) {
        console.error('Error deleting todo:', error);
        alert(error.message || '删除任务失败');
        throw error;
    }
}

// 渲染任务列表
function renderTodos(todos) {
    const todosList = document.getElementById('todosList');
    const todoCount = document.getElementById('todoCount');
    
    todoCount.textContent = `${todos.length} 个任务`;

    if (todos.length === 0) {
        todosList.innerHTML = `
            <div class="empty-state">
                <p>🎉 还没有任务，添加一个开始吧！</p>
            </div>
        `;
        return;
    }

    todosList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                data-id="${todo.id}"
            >
            <span class="todo-title ${todo.completed ? 'completed' : ''}">
                ${escapeHtml(todo.title)}
            </span>
            <div class="todo-actions">
                <button class="btn btn-edit" data-id="${todo.id}">编辑</button>
                <button class="btn btn-delete" data-id="${todo.id}">删除</button>
            </div>
        </div>
    `).join('');

    // 绑定事件
    bindTodoEvents();
}

// 绑定任务相关事件
function bindTodoEvents() {
    // 复选框切换
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const completed = e.target.checked;
            
            try {
                await updateTodo(id, { completed });
                const todos = await fetchTodos();
                renderTodos(todos);
            } catch (error) {
                // 恢复复选框状态
                e.target.checked = !completed;
            }
        });
    });

    // 编辑按钮
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const todoItem = document.querySelector(`[data-id="${id}"]`);
            const title = todoItem.querySelector('.todo-title').textContent.trim();
            openEditModal(id, title);
        });
    });

    // 删除按钮
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm('确定要删除这个任务吗？')) {
                try {
                    await deleteTodo(id);
                    const todos = await fetchTodos();
                    renderTodos(todos);
                } catch (error) {
                    // 错误已在 deleteTodo 中处理
                }
            }
        });
    });
}

// 打开编辑模态框
function openEditModal(id, currentTitle) {
    const modal = document.getElementById('editModal');
    const input = document.getElementById('editTodoInput');
    const form = document.getElementById('editTodoForm');
    
    input.value = currentTitle;
    modal.classList.add('show');
    input.focus();

    // 保存编辑
    form.onsubmit = async (e) => {
        e.preventDefault();
        const newTitle = input.value.trim();
        
        if (!newTitle) {
            alert('任务标题不能为空');
            return;
        }

        try {
            await updateTodo(id, { title: newTitle });
            modal.classList.remove('show');
            const todos = await fetchTodos();
            renderTodos(todos);
        } catch (error) {
            // 错误已在 updateTodo 中处理
        }
    };
}

// 关闭编辑模态框
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    document.getElementById('editTodoInput').value = '';
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加任务表单
    const addForm = document.getElementById('addTodoForm');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('todoInput');
        const title = input.value.trim();

        if (!title) {
            alert('请输入任务标题');
            return;
        }

        try {
            await createTodo(title);
            input.value = '';
            const todos = await fetchTodos();
            renderTodos(todos);
        } catch (error) {
            // 错误已在 createTodo 中处理
        }
    });

    // 模态框关闭事件
    document.querySelector('.close').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeEditModal();
        }
    });

    // 初始加载任务列表（如果需要动态刷新）
    // 由于是 SSR，初始数据已经在页面中，这里可以用于后续的实时更新
});

