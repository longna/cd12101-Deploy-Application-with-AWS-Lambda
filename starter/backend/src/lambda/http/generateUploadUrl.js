import { updateTodoImageUrl } from "../../businessLogic/todos.mjs"
import {createPresignedUrl} from '../../fileStorage/attachmentUtils.mjs'
import {getUserId} from '../utils.mjs'
import * as uuid from 'uuid'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const attachmentId = uuid.v4()

  const uploadImageUrl = await createPresignedUrl(attachmentId)
  
  console.log("uploadImageUrl: " + uploadImageUrl)

  await updateTodoImageUrl(userId, todoId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      'uploadUrl': uploadImageUrl
    })
  }
}

