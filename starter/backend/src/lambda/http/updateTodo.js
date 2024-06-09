import { updateTodo } from "../../businessLogic/todos.mjs"
import {getUserId} from '../utils.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const userId = getUserId(event)
  const parsedBody = JSON.parse(event.body)

  const item = await updateTodo(userId, todoId, parsedBody)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: ''
  }
}
