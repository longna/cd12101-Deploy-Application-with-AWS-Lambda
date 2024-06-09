import { getTodos } from "../../businessLogic/todos.mjs"
import {getUserId} from '../utils.mjs'


export async function handler(event) {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  
  console.log("userId: " + userId)

  const items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      items
    })
  }
}
