'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useComposioContext } from '@/providers/composio-provider';

export function ConnectGmailCard() {
  const { handleConnect, isConnecting } = useComposioContext();

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-lg">Connect Email Assistant</CardTitle>
        <CardDescription className='pt-4 text-md'>
          Connect your Email Assistant to your Gmail account using Composio.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={async () => await handleConnect('gmail')} 
          className="ml-auto" 
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : 'Connect to Composio'}
        </Button>
      </CardFooter>
    </Card>
  );
}
