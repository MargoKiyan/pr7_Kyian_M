const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
const addTodoButton = document.getElementById('add-todo-button')

const STORAGE_KEY = 'todos-practice-7'

let todos = loadTodos()

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY)

  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)

    if (!parsedTodos.length) {
      return []
    }

    return parsedTodos
      .filter(todo => todo && todo.text)
      .map((todo, index) => ({
        id: todo.id || new Date().getTime() + index,
        text: todo.text,
        completed: Boolean(todo.completed),
      }))
  } catch (error) {
    return []
  }
}

function newTodo() {
  const text = prompt('Введіть текст нової справи:')

  if (text === null) {
    return
  }

  const trimmedText = text.trim()

  if (trimmedText === '') {
    alert('Не можна додати порожню справу.')
    return
  }

  const todo = {
    id: createTodoId(),
    text: trimmedText,
    completed: false,
  }

  todos.push(todo)
  saveTodos()
  render(todos)
  updateCounter()
}

function createTodoId() {
  let id = new Date().getTime()

  while (todos.find(todo => todo.id == id)) {
    id++
  }

  return id
}

function renderTodo(todo) {
  const checked = todo.completed ? 'checked' : ''
  const completedClass = todo.completed ? ' completed' : ''

  return `
    <li class="todo-item${completedClass}" data-id="${todo.id}">
      <label class="todo-label" for="todo-${todo.id}">
        <input
          id="todo-${todo.id}"
          class="todo-checkbox"
          data-action="check"
          data-id="${todo.id}"
          type="checkbox"
          ${checked}
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </label>
      <button class="delete-button" data-action="delete" data-id="${todo.id}" type="button">Видалити</button>
    </li>
  `
}

function render(todosToRender) {
  if (todosToRender.length === 0) {
    list.innerHTML = '<li class="empty-list">Список справ порожній</li>'
    return
  }

  list.innerHTML = todosToRender.map(todo => renderTodo(todo)).join('')
}

function updateCounter() {
  const total = todos.length
  const uncompleted = todos.filter(todo => !todo.completed).length

  itemCountSpan.textContent = total
  uncheckedCountSpan.textContent = uncompleted
}

function deleteTodo(id) {
  todos = todos.filter(todo => String(todo.id) !== String(id))
  saveTodos()
  render(todos)
  updateCounter()
}

function checkTodo(id) {
  const todo = todos.find(item => String(item.id) === String(id))

  if (!todo) {
    return
  }

  todo.completed = !todo.completed
  saveTodos()
  render(todos)
  updateCounter()
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

addTodoButton.addEventListener('click', newTodo)

list.addEventListener('change', event => {
  if (event.target.getAttribute('data-action') !== 'check') {
    return
  }

  checkTodo(event.target.getAttribute('data-id'))
})

list.addEventListener('click', event => {
  if (event.target.getAttribute('data-action') !== 'delete') {
    return
  }

  deleteTodo(event.target.getAttribute('data-id'))
})

render(todos)
updateCounter()
