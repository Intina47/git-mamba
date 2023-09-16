import fs from 'fs';

export const LogUserActivity = (logFilePath: string, logEntry: string): void => {
 fs.appendFile(logFilePath, logEntry, (err) => {
  if (err) {
   console.error('Error writing to log file:', err);
  }
 });
};