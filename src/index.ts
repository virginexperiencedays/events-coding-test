import { SQSHandler } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';

const eventBridge = new EventBridge();

// TODO: This is a skeleton. Implement the handler logic.
export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      console.log('Received message:', messageBody);

      // Task 1: Add input validation

      // Task 2: Implement core domain logic
      // - Find or create category
      // - Create product

      // Task 3: Publish domain event
      // Example of publishing an event:


    } catch (error) {
      console.error('Error processing message:', error);
      // This will cause the message to be returned to the queue for reprocessing.
      // After enough failures, it will go to the DLQ (if configured).
      throw error;
    }
  }
};
