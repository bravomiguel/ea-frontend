import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';

import { Toaster } from '@/components/ui/sonner';
import { checkConnectionAction, getThreadsAction } from '@/lib/actions';
import { ThreadProvider } from '@/providers/thread-provider';
import { QueryProvider } from '@/providers/query-provider';
import { StreamProvider } from '@/providers/stream-provider';
import { InputHeightProvider } from '@/providers/input-height-provider';
import { auth } from '@/auth';
import { ComposioProvider } from '@/providers/composio-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Email Assistant',
  description:
    'Modern AI Email Assistant interface built with Next.js, Shadcn UI and Tailwind CSS',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //fetch threads
  const threads = await getThreadsAction();
  const { hasConnection } = await checkConnectionAction('gmail');

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NuqsAdapter>
            <Toaster position="top-center" />
            <QueryProvider>
              <ThreadProvider threads={threads}>
                <InputHeightProvider>
                  <StreamProvider>
                    <ComposioProvider hasGmailConnection={hasConnection}>
                      {children}
                    </ComposioProvider>
                  </StreamProvider>
                </InputHeightProvider>
              </ThreadProvider>
            </QueryProvider>
          </NuqsAdapter>
        </SessionProvider>
      </body>
    </html>
  );
}
