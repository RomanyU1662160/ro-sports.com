import { has, set, cloneDeep } from 'lodash';
import { Request } from '@middy/core';

const basicKeys = [
  'password',
  'token',
  'secret',
  'authorization',
  'onStockPassword',
  'Auth-User',
  'Auth-Password',
  'Auth-Token',
];

export const redactSensitiveFieldsMiddleware = <
  TEvent = unknown,
  TResult = unknown
>() => {
  const middlewareBefore = async (request: Request<TEvent, TResult>) => {
    const redactedData = cloneDeep(request.event);

    basicKeys.forEach((field) => {
      if (has(redactedData, field)) {
        set(redactedData, field, '********');
      }
    });

    request.event = redactedData;
  };

  return {
    before: middlewareBefore,
  };
};
