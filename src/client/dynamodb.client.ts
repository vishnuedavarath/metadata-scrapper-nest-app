import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to null.
  convertEmptyValues: true, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };
let client: DynamoDBClient;

if (process.env.IS_OFFLINE === 'true') {
  client = new DynamoDBClient({
    endpoint: 'http://localhost:8000/',
  });
} else {
  client = new DynamoDBClient({});
}

const ddbClient = DynamoDBDocument.from(client, translateConfig);

export { ddbClient };
