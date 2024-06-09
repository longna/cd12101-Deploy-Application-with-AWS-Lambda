
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const AWSXRay = require('aws-xray-sdk-core')
const todosIndex = process.env.TODOS_CREATED_AT_INDEX



export class TodosAccess {
  constructor(
    dynamoDb = new DynamoDB(),
    dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)

  }

  async getTodosForUser(userId) {
    const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })

    return result.Items
  }

  async getTodoById(userId, todoId) {
    const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })

    return result.Items[0]
  }

  async createTodo(newTodo) {
    await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: newTodo
      })

    return newTodo
  }

  async updateTodo(userId, todoId, updateTodo) {

    const todoItem = await this.getTodoById(userId, todoId)
    if (!todoItem) {
      throw new Error(`Todo item with id ${todoId} not exist`)
    }

    const updateTodoCommand = {
      TableName: this.todosTable,
      Key: {
          userId: userId,
          todoId: todoId
      },
      UpdateExpression: 'SET dueDate = :dueDate, #itemname = :itemname, done = :done',
      ExpressionAttributeNames: {
          '#itemname': 'name'
      },
      ExpressionAttributeValues: {
          ':dueDate': updateTodo.dueDate,
          ':itemname': updateTodo.name,
          ':done': updateTodo.done
      }
  }

    await this.dynamoDbClient.update(updateTodoCommand)
  }

  async updateTodoImageUrl(userId, todoId, imageUrl) {
    const todoItem = await this.getTodoById(userId, todoId)

    if (!todoItem) {
        throw new Error(`Todo item with id ${todoId} not exist`)
    }

    await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': imageUrl
        }
      })
  }

  async deleteTodo(userId, todoId) {

    await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
  }
}