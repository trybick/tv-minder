type LogLevel = 'error' | 'success';

const colors = {
  error: '\x1b[31m',
  success: '\x1b[32m',
  reset: '\x1b[0m',
  timestamp: '\x1b[90m',
} as const;

const formatPrefix = (level: LogLevel) => {
  const timestamp = new Date().toISOString();
  const capitalizedLevel = level.toUpperCase().padEnd(7);

  const timestampColor = colors.timestamp;
  const resetColor = colors.reset;
  const levelColor = colors[level];

  return `${timestampColor}[${timestamp}]${resetColor} ${levelColor}${capitalizedLevel}${resetColor}`;
};

const createLogFunction = (level: LogLevel) => {
  return (...messages: any[]) => {
    const prefix = formatPrefix(level);
    console.log(prefix, ...messages);
  };
};

const logger = {
  error: createLogFunction('error'),
  success: createLogFunction('success'),
};

export default logger;
