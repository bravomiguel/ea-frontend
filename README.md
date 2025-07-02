# Email Assistant Frontend

A Next.js application that provides a user interface for an AI-powered email assistant. This frontend connects to a LangGraph server backend to help users draft, review, and send emails.

## Project Overview

This application allows users to:
- Draft emails with AI assistance
- Review AI-generated email content
- Edit email drafts before sending
- Reject drafts and provide feedback for improvements

The frontend is built with Next.js, React, and uses the LangGraph SDK to communicate with the backend server.

## Backend Connection

This frontend connects to a [LangGraph](https://github.com/langchain-ai/langgraph) server backend located at: [https://github.com/bravomiguel/email-assistant](https://github.com/bravomiguel/email-assistant)

The connection is established through the LangGraph SDK, which handles:
- Real-time streaming of AI responses
- Thread management
- State synchronization between frontend and backend
- Handling interrupts for user review of emails

## Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun package manager
- Access to the LangGraph backend server (running locally or deployed)

## Environment Setup

Create a `.env` file in the root directory with the following variables:
```bash
# LangGraph Configuration
NEXT_PUBLIC_LANGGRAPH_API_URL='http://127.0.0.1:2024' # Local development

NEXT_PUBLIC_LANGGRAPH_API_URL='http://127.0.0.1:2024' # Production
NEXT_PUBLIC_LANGGRAPH_GRAPH_ID='agent'

# NextAuth.js Configuration
NEXTAUTH_URL='http://localhost:3000' NEXTAUTH_SECRET='your-nextauth-secret'

# Google OAuth (for authentication)
AUTH_GOOGLE_ID='your-google-client-id' AUTH_GOOGLE_SECRET='your-google-client-secret'
```

## Installation
```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Running Locally
1. Start the LangGraph backend server first (follow instructions in the email-assistant repository)

2. Start the frontend development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open <http://localhost:3000> in your browser

## Deployment
The application can be deployed on Vercel or any other platform that supports Next.js applications.