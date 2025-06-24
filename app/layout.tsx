import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';
import { getThreadsAction } from '@/lib/actions';
import { ThreadProvider } from '@/providers/thread-provider';
import { QueryProvider } from '@/providers/query-provider';
import { StreamProvider } from '@/providers/stream-provider';
import { InputHeightProvider } from '@/providers/input-height-provider';

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
  const threads = await getThreadsAction();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Toaster />
          <QueryProvider>
            <ThreadProvider threads={threads}>
              <InputHeightProvider>
                <StreamProvider>{children}</StreamProvider>
              </InputHeightProvider>
            </ThreadProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
