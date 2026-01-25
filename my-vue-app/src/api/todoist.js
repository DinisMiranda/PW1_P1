import { TodoistApi } from '@doist/todoist-api-typescript'

let cachedClient = null

function getTodoistClient() {
  const token = import.meta.env.VITE_TODOIST_API_TOKEN
  if (!token) {
    throw new Error('Defina VITE_TODOIST_API_TOKEN no seu ambiente para ligar ao Todoist.')
  }
  if (!cachedClient) {
    cachedClient = new TodoistApi(token)
  }
  return cachedClient
}

async function fetchTodoistTasks(options = {}) {
  const client = getTodoistClient()
  const params = {}

  if (options.projectIds?.length) params.projectId = options.projectIds
  if (options.labelIds?.length) params.labelId = options.labelIds

  const tasks = await client.getTasks(params)
  return tasks
}

async function createTodoistTask(task) {
  const client = getTodoistClient()
  return client.addTask(task)
}

async function closeTodoistTask(taskId) {
  const client = getTodoistClient()
  await client.closeTask(taskId)
}

export { getTodoistClient, fetchTodoistTasks, createTodoistTask, closeTodoistTask }
