import { NodeHttpHandler } from '@smithy/node-http-handler';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import { RetryStrategyV2 } from '@smithy/types';
import {
  EventBridgeClient,
  EventBridgeClientConfig,
  PutEventsCommand,
  PutEventsResultEntry,
} from '@aws-sdk/client-eventbridge';
import { logger } from '@ro-app/pino-logger';

const retryStrategy: RetryStrategyV2 = new ConfiguredRetryStrategy(
  4,
  (attempt: number) => 100 + attempt * 1000 // backoff function.
);

const requestHandler = new NodeHttpHandler({
  requestTimeout: 1000,
  connectionTimeout: 1000,
});

export const eventBridgeClient = new EventBridgeClient({
  requestHandler,
  retryStrategy,
  region: process.env.AWS_REGION || 'eu-west-1',
});

const defaultParams: EventBridgeClientConfig = {
  requestHandler,
  region: process.env.AWS_REGION || 'eu-west-1',
  retryStrategy,
  maxAttempts: 4,
  logger: logger,
};

export const createEventBridgeClient = (params?: EventBridgeClientConfig) => {
  const finalParams = { ...defaultParams, ...params };
  return new EventBridgeClient(finalParams);
};

export const putEvent = async (
  command: PutEventsCommand,
  params?: EventBridgeClientConfig
) => {
  try {
    const client = createEventBridgeClient(params);
    await client.send(command);
  } catch (error: unknown) {
    logger.error(`Error sending event to EventBridge: ${error}`);
    throw error;
  }
};

type BaseEventPayload<T> = {
  version: string;
  correlationId: string;
  workspace: string;
  service: string;
  domain: string;
  countryCode: string;
  fascia: string;
  detailType: string;
  source: string;
  eventBusName: string;
  data: T;
};

export const createBaseEvent = <T extends object>(
  baseEventPayload: BaseEventPayload<T>
) => {
  return {
    Source: baseEventPayload.source,
    EventBusName: baseEventPayload.eventBusName,
    DetailType: baseEventPayload.detailType,
    Detail: JSON.stringify({
      data: baseEventPayload.data,
      metadata: {
        version: baseEventPayload.version,
        correlationId: baseEventPayload.correlationId,
        countryCode: baseEventPayload.countryCode,
        domain: baseEventPayload.domain,
        fascia: baseEventPayload.fascia,
        service: baseEventPayload.service,
      },
    }),
  };
};
