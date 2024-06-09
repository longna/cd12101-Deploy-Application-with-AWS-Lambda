import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()
const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION

export async function getTodos(userId) {
    return todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
    const todoId = uuid.v4()

    return todosAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        createdAt: new Date().toISOString(),
        done: false
    });
}

export async function updateTodo(userId, todoId, updateTodo) {
    return todosAccess.updateTodo(userId, todoId, updateTodo);
}

export async function updateTodoImageUrl (userId, todoId, imageId) {
    return todosAccess.updateTodoImageUrl(
        userId, 
        todoId, 
        `https://${s3_bucket}.s3.${AWS_REGION}.amazonaws.com/${imageId}`)
}

export async function deleteTodo(userId, todoId) {
    return todosAccess.deleteTodo(userId, todoId)
}
