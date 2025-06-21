import { Client } from "@langchain/langgraph-sdk";

export function createClient(apiUrl: string) {
  return new Client({
    // apiKey: process.env.LANGSMITH_API_KEY,
    apiUrl,
  });
}
