export enum MailType {
  RESET_PASSWORD = 'reset-password',
  VERIFY_EMAIL = 'welcome',
}

export const MailSubjects = {
  [MailType.RESET_PASSWORD]: 'Reset Your Password - Bid Market',
  [MailType.VERIFY_EMAIL]: 'Welcome to Bid Market!',
} as const;

export const MailTitles = {
  [MailType.RESET_PASSWORD]: 'Reset Your Password',
  [MailType.VERIFY_EMAIL]: 'Welcome',
} as const;

export const MailTemplates = {
  [MailType.RESET_PASSWORD]: 'reset-password',
  [MailType.VERIFY_EMAIL]: 'verify-email',
} as const;

export const EXPIRES_IN_MINUTES = 10;
