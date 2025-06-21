import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { ThreadProvider } from '@/providers/thread-provider';
import { getThreadsAction } from '@/lib/actions';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Chatbot',
  description:
    'Modern AI Chatbot interface built with Next.js, Shadcn UI and Tailwind CSS',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const threads = await getThreadsAction();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Toaster />
          <ThreadProvider threads={threads}>{children}</ThreadProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
