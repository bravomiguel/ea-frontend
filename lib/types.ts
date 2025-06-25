export type EmailInterruptValue = {
  question: string;
  recipient_email: string;
  message_body: string;
};

export type EmailInterruptReview = {
  action: 'send' | 'edit_send' | 'reject';
  edits?: string;
  feedback?: string;
};
