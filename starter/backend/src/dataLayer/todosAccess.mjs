
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
    todosTable = process.env.TODOS_TABLE,
    todosIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)

  }

  async getTodosForUser(userId) {
    console.log(userId)

    const scanCommand = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const result = await this.dynamoDbClient.query(scanCommand)

    return result.Items
  }

  async getTodoById(userId, todoId) {
    const getTodoCommand = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    }
    const result = await this.dynamoDbClient.query(getTodoCommand)

    return result.Items[0]
  }

  async createTodo(newTodo) {

    const putItemCommand = {
      TableName: this.todosTable,
      Item: newTodo
    }

    const result = await this.dynamoDbClient.put(putItemCommand)

    return newTodo
  }

  async updateTodo(userId, todoId, updateTodo) {

    const todoItem = await this.getTodoById(userId, todoId)
    if (!todoItem) {
      throw new Error(`Todo item ${todoId} not found`)
    }

    const putItemCommand = {
      TableName: this.todosTable,
      Key: {
          userId: userId,
          todoId: todoId
      },
      UpdateExpression: 'SET #itemname = :itemname, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
          '#itemname': 'name'
      },
      ExpressionAttributeValues: {
          ':itemname': updateTodo.name,
          ':dueDate': updateTodo.dueDate,
          ':done': updateTodo.done
      }
  }

    await this.dynamoDbClient.update(putItemCommand)
  }

  async updateTodoImageUrl(userId, todoId, imageUrl) {
    const todoItem = await this.getTodoById(userId, todoId)

    if (!todoItem) {
      throw new Error(`Todo item ${todoId} not found`)
    }

    const updateImageCommnad = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': imageUrl
      }
    }

    await this.dynamoDbClient.update(updateImageCommnad)
  }

  async deleteTodo(userId, todoId) {

    const deleteItemCommand = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }

    await this.dynamoDbClient.delete(deleteItemCommand)
  }
}