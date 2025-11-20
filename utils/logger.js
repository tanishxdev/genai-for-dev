// -------------------------------------------------------------
// Basic logger with timestamps and consistent formatting
// -------------------------------------------------------------

export function logInfo(message, data = null) {
  console.log(`[INFO ${new Date().toISOString()}] ${message}`);
  if (data !== null) console.dir(data, { depth: 5 });
}

export function logError(message, error) {
  console.error(`[ERROR ${new Date().toISOString()}] ${message}`);
  console.error(error);
}

export function logStart(operation) {
  console.log(`\n=== START: ${operation} ===`);
}

export function logEnd(operation) {
  console.log(`=== END: ${operation} ===\n`);
}
