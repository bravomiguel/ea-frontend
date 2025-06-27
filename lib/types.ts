import { Message } from "@langchain/langgraph-sdk";

export type EmailInterruptValue = {
  question: string;
  recipient_email: string;
  message_body?: string;
  body?: string;
};

export type EmailInterruptResponse= {
  action: 'send' | 'edit_send' | 'reject';
  edits?: string;
  feedback?: string;
};

// Define your thread state type  
export type ThreadState = {  
  messages: Message[];  
  thread_title: string;  
  // Add other state properties as needed  
};  
