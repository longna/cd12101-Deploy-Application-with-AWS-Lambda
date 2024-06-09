
import { createTodo } from "../../businessLogic/todos.mjs"
import {getUserId} from '../utils.mjs'

export async function handler(event) {
  const newTodo = JSON.parse(event.body)

  const userId = getUserId(event)
    const parsedBody = JSON.parse(event.body)

    const item = await createTodo(userId, parsedBody)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item
      })
    }
}

