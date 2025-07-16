/**
 * Censor email address by showing only first 2 characters, rest censored with *
 * Example: "user@example.com" becomes "us**@example.com"
 * Example: "john.doe@gmail.com" becomes "jo******@gmail.com"
 */
export function censorEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`;
  }
  
  const firstTwo = localPart.substring(0, 2);
  const remainingLength = localPart.length - 2;
  const censored = `${firstTwo}${'*'.repeat(remainingLength)}@${domain}`;
  
  return censored;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}