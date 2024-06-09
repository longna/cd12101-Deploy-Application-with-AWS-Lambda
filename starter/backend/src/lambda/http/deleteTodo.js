
import { deleteTodo } from "../../businessLogic/todos.mjs"
import {getUserId} from '../utils.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const item = await deleteTodo(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: ''
  }
}

