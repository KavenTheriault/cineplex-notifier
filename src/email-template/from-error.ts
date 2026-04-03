export const buildEmailFromError = (error: unknown) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  let emailBody = '';
  emailBody += '❌ CINEPLEX MONITOR ERROR\n\n';
  emailBody += `Timestamp: ${timestamp}\n\n`;
  emailBody += `Error Message:\n${error instanceof Error ? error.message : error}\n\n`;

  if (error instanceof Error && error.stack) {
    emailBody += `Stack Trace:\n${error.stack}\n\n`;
  }

  return emailBody;
}