import pino from 'pino';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

// const isProduction = process.env.NODE_ENV === 'production';
// const transport = pino.transport({
//   level: (process.env.LOG_LEVEL as LogLevel) || 'info',
//   target: !isProduction ? 'pino-pretty' : '',
//   options: { destination: 1, colorize: true }, // use 2 for stderr
// });

const pinoConfig = {
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
};

export const logger = pino(pinoConfig);
