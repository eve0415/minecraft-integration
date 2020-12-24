import { configure, getLogger, shutdown } from 'log4js';

configure({
    appenders: {
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{hh:mm:ss.SSS}]%] %[[%p]%] %m',
            },
        },
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        debug: { appenders: ['console'], level: 'debug' },
        error: { appenders: ['console'], level: 'error' },
        fatal: { appenders: ['console'], level: 'fatal' },
    },
});

type baseLogger = (message?: unknown, ...optionalParams: unknown[]) => void;

export class logger {
    public static debug: baseLogger = log => getLogger('debug').debug(log);
    public static info: baseLogger = log => getLogger('default').info(log);
    public static warn: baseLogger = log => getLogger('default').warn(log);
    public static error: baseLogger = log => getLogger('error').error(log);
    public static fatal: baseLogger = log => getLogger('fatal').fatal(log);
    public static shutdown: baseLogger = () => {
        getLogger('default').info('Shutting down logger');
        shutdown();
    };
}

