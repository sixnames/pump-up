import winston from 'winston';

export const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'output/info.log',
      level: 'info',
      format: winston.format.prettyPrint(),
    }),
  ],
});

export const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'output/error.log',
      level: 'error',
      format: winston.format.prettyPrint(),
    }),
  ],
});

if (process.env.RUN_ENVIRONMENT === 'development') {
  errorLogger.add(
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(
        winston.format.prettyPrint({
          colorize: true,
          depth: 3,
        }),
      ),
    }),
  );
}
