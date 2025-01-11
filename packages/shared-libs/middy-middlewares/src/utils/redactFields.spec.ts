import { redactSensitiveData } from './redactFields';

describe('redactSensitiveData', () => {
  const MASK = '*****';

  describe('handling null/undefined', () => {
    it('should return null for null input', () => {
      expect(redactSensitiveData(null)).toBeNull();
    });

    it('should return undefined for undefined input', () => {
      expect(redactSensitiveData(undefined)).toBeUndefined();
    });
  });

  describe('string redaction', () => {
    it('should redact sensitive words in strings', () => {
      const input = 'The password is secret123';
      const expected = `The ${MASK} is ${MASK}123`;
      expect(redactSensitiveData(input)).toBe(expected);
    });

    it('should be case insensitive when redacting strings', () => {
      const input = 'PASSWORD: 123, Token: abc';
      const expected = `${MASK}: 123, ${MASK}: abc`;
      expect(redactSensitiveData(input)).toBe(expected);
    });

    it('should handle multiple occurrences of sensitive words', () => {
      const input = 'password1 password2 password3';
      const expected = `${MASK}1 ${MASK}2 ${MASK}3`;
      expect(redactSensitiveData(input)).toBe(expected);
    });
  });

  describe('object redaction', () => {
    it('should redact sensitive keys in plain objects', () => {
      const input = {
        username: 'john',
        password: 'secret123',
        data: 'normal',
      };
      const expected = {
        username: 'john',
        password: MASK,
        data: 'normal',
      };
      expect(redactSensitiveData(input)).toEqual(expected);
    });

    it('should redact nested sensitive keys', () => {
      const input = {
        user: {
          password: 'secret',
          token: 'abc123',
        },
      };
      const expected = {
        user: {
          password: MASK,
          token: MASK,
        },
      };
      expect(redactSensitiveData(input)).toEqual(expected);
    });

    it('should handle arrays within objects', () => {
      const input = {
        items: [{ password: 'secret1' }, { token: 'abc' }, { normal: 'value' }],
      };
      const expected = {
        items: [{ password: MASK }, { token: MASK }, { normal: 'value' }],
      };
      expect(redactSensitiveData(input)).toEqual(expected);
    });
  });

  describe('array redaction', () => {
    it('should redact sensitive data in arrays', () => {
      const input = [{ password: 'secret' }, { normal: 'value' }];
      const expected = [{ password: MASK }, { normal: 'value' }];
      expect(redactSensitiveData(input)).toEqual(expected);
    });

    it('should handle nested arrays', () => {
      const input = [[{ password: 'secret' }], [{ normal: 'value' }]];
      const expected = [[{ password: MASK }], [{ normal: 'value' }]];
      expect(redactSensitiveData(input)).toEqual(expected);
    });
  });

  describe('custom sensitive keys', () => {
    it('should redact custom sensitive keys', () => {
      const input = {
        apiKey: 'xyz789',
        customSecret: '123',
      };
      const expected = {
        apiKey: MASK,
        customSecret: MASK,
      };
      expect(redactSensitiveData(input, ['apiKey', 'customSecret'])).toEqual(
        expected
      );
    });

    it('should combine default and custom sensitive keys', () => {
      const input = {
        password: 'secret',
        apiKey: 'xyz789',
      };
      const expected = {
        password: MASK,
        apiKey: MASK,
      };
      expect(redactSensitiveData(input, ['apiKey'])).toEqual(expected);
    });
  });

  describe('special cases', () => {
    it('should handle empty objects', () => {
      expect(redactSensitiveData({})).toEqual({});
    });

    it('should handle empty arrays', () => {
      expect(redactSensitiveData([])).toEqual([]);
    });

    it('should handle empty strings', () => {
      expect(redactSensitiveData('')).toBe('');
    });

    it('should preserve non-sensitive data', () => {
      const input = {
        normal: 'value',
        nested: {
          safe: 'data',
        },
      };
      expect(redactSensitiveData(input)).toEqual(input);
    });

    it('should handle special object types', () => {
      const date = new Date();
      const input = {
        date,
        password: 'secret',
      };
      const expected = {
        date,
        password: MASK,
      };
      expect(redactSensitiveData(input)).toEqual(expected);
    });
  });
});
