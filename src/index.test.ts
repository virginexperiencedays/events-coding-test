import { handler } from './index';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';

// Mock the EventBridge client
jest.mock('aws-sdk', () => {
  const mEventBridge = {
    putEvents: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { EventBridge: jest.fn(() => mEventBridge) };
});

const eventBridge = new EventBridge();

describe('Product Ingestion Handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process a valid SQS message but do nothing as it is not implemented', async () => {
    const mockRecord: SQSRecord = {
      messageId: '1',
      receiptHandle: 'handle1',
      body: JSON.stringify({
        productName: 'Test Product',
        price: 100,
        categoryName: 'Test Category',
      }),
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1',
        SenderId: '1',
        ApproximateFirstReceiveTimestamp: '1',
      },
      messageAttributes: {},
      md5OfBody: 'md5',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:000000000000:test-queue',
      awsRegion: 'us-east-1',
    };

    const mockEvent: SQSEvent = {
      Records: [mockRecord],
    };

    await handler(mockEvent, {} as any, () => {});

    expect(eventBridge.putEvents).not.toHaveBeenCalled();
  });

});
