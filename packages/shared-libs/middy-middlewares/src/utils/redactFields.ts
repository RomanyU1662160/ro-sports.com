import { logger } from '@ro-app/pino-logger';
import { escapeRegExp, cloneDeepWith } from 'lodash';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'onStockPassword',
  'Auth-User',
  'Auth-Password',
  'Auth-Token',
];

const REDACTION_MASK = '*****';
type Data = string | object | any[] | null | undefined;
/**
 * Redacts sensitive information from data
 * @param data - Input data (string, object, or array)
 * @param customKeys - Additional sensitive keys to redact
 * @returns Redacted data with sensitive information masked
 */
export const redactSensitiveData = <T extends Data>(
  data: T,
  customKeys: string[] = []
): T => {
  if (data === null || data === undefined) {
    return data;
  }
  const allKeys = [...SENSITIVE_KEYS, ...customKeys];
  // Handle strings
  if (typeof data === 'string') {
    const pattern = new RegExp(
      allKeys.map((key) => escapeRegExp(key)).join('|'),
      'gi'
    );
    return data.replace(pattern, REDACTION_MASK) as T;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item, customKeys)) as T;
  }
  // Handle objects
  if (typeof data === 'object') {
    return cloneDeepWith(data, (value, key) => {
      // If no key, just return undefined to let cloneDeepWith handle the value
      if (!key) return undefined;

      if (typeof key === 'string') {
        const isSensitive = allKeys.some((sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey.toLowerCase())
        );

        if (isSensitive) {
          logger.warn(`Sensitive Data Found, Redacting: ${key}`);
          return REDACTION_MASK;
        }
      }

      // For non-sensitive keys with object values, return undefined
      // to let cloneDeepWith continue its normal cloning process
      return undefined;
    }) as T;
  }

  return data;
};
