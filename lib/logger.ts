import fs from 'fs';
import path from 'path';

export function logEnrichmentData(data: any, label: string = 'enrichment') {
  if (process.env.NODE_ENV !== 'development') return; // Only log in dev
  
  const timestamp = new Date().toISOString();
  const logDir = path.join(process.cwd(), 'logs');
  
  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `enrichment-${new Date().toISOString().split('T')[0]}.json`);
  const logEntry = {
    timestamp,
    label,
    data: JSON.stringify(data, null, 2)
  };
  
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}