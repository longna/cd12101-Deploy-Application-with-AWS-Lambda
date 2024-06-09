import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()
const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION

export async function getTodos(userId) {
    return todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
    const id = uuid.v4()
    const createdAt = new Date().toISOString()


    return todosAccess.createTodo({
        todoId: id,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false
    });
}

export async function updateTodo(userId, todoId, updateTodo) {
    return todosAccess.updateTodo(userId, todoId, updateTodo);
}

export async function updateTodoImageUrl (userId, todoId, imageId) {

    const imageUrl  = `https://${s3_bucket}.s3.${AWS_REGION}.amazonaws.com/${imageId}`

    return todosAccess.updateTodoImageUrl(userId, todoId, imageUrl)
}

export async function deleteTodo(userId, todoId) {
    return todosAccess.deleteTodo(userId, todoId)
}
