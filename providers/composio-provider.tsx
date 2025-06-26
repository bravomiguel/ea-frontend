'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';

import {
  checkConnectionAction,
  initiateConnectionAction,
  waitForConnectionAction,
} from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

type ComposioProviderProps = {
  children: React.ReactNode;
  hasGmailConnection: boolean;
};

type ComposioContextType = {
  isConnecting: boolean;
  connectionStatus: string;
  handleConnect: (appName: string) => Promise<void>;
  // handleWaitForConnection: (connectedAccountId: string) => Promise<void>;
  hasGmailConnection: boolean | undefined;
  callbackStatus: string | null;
  connectedAccountId: string | null;
};
const ComposioContext = createContext<ComposioContextType | null>(null);

export function ComposioProvider({
  children,
  hasGmailConnection: hasGmailConnectionInitial,
}: ComposioProviderProps) {
  const [callbackStatus, setCallbackStatus] = useQueryState('status');
  const [connectedAccountId, setConnectedAccountId] =
    useQueryState('connectedAccountId');
  const [appName, setAppName] = useQueryState('appName');

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const handleConnect = async (appName: string) => {
    setIsConnecting(true);
    setConnectionStatus('Initiating connection...');

    try {
      const result = await initiateConnectionAction(appName);

      if (result.success && result.redirectUrl) {
        setConnectionStatus('Redirecting to authorization...');
        // Redirect user to OAuth authorization
        window.location.href = result.redirectUrl;
      } else {
        setConnectionStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus('Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const { data: hasGmailConnection, refetch: refetchGmailConnection } =
    useQuery({
      queryKey: [`gmail-connection`],
      queryFn: async () => {
        const result = await checkConnectionAction('gmail');
        return result.hasConnection;
      },
      initialData: hasGmailConnectionInitial,
      refetchOnMount: false,
    });

  const handleWaitForConnection = useCallback(
    async (connectedAccountId: string) => {
      setIsConnecting(true);

      try {
        // Poll for 30 seconds (30 attempts, 1 second apart)
        let attempts = 0;
        const maxAttempts = 30;
        let isActive = false;
        let lastError = '';

        console.log(
          `Starting connection polling for account ID: ${connectedAccountId}`,
        );

        while (attempts < maxAttempts && !isActive) {
          attempts++;
          console.log(
            `Polling attempt ${attempts}/${maxAttempts} for connection...`,
          );

          const result = await waitForConnectionAction(connectedAccountId);

          if (result.success) {
            console.log(
              `Poll result: success=${result.success}, status=${result.status}, isActive=${result.isActive}`,
            );
            if (result.isActive) {
              isActive = true;
              console.log(
                `Connection is now active after ${attempts} attempts!`,
              );
              toast.success('Connection successful!');
              break;
            }
          } else {
            lastError = result.error ?? 'Unknown error';
            console.log(`Poll error: ${lastError}`);
          }

          // Wait for 1 second before the next poll
          if (!isActive && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // If we've exhausted all attempts and still not active
        if (!isActive) {
          console.log(
            `Connection failed after ${maxAttempts} polling attempts. Last error: ${
              lastError || 'None'
            }`,
          );
          toast.error('Connection timed out, please try again');
        }
      } catch (error) {
        console.error('Connection failed:', error);
        toast.error('Connection failed, please try again');
      } finally {
        setIsConnecting(false);
        setCallbackStatus(null);
        setConnectedAccountId(null);
        setAppName(null);
        refetchGmailConnection();
      }
    },
    [
      refetchGmailConnection,
      setCallbackStatus,
      setConnectedAccountId,
      setAppName,
    ],
  );

  useEffect(() => {
    if (callbackStatus === 'success' && connectedAccountId) {
      handleWaitForConnection(connectedAccountId);
    }
  }, [callbackStatus, connectedAccountId, handleWaitForConnection]);

  return (
    <ComposioContext.Provider
      value={{
        connectionStatus,
        handleConnect,
        // handleWaitForConnection,
        isConnecting,
        hasGmailConnection,
        connectedAccountId,
        callbackStatus,
      }}
    >
      {children}
    </ComposioContext.Provider>
  );
}

// Create a custom hook to use the context
export const useComposioContext = (): ComposioContextType => {
  const context = useContext(ComposioContext);
  if (!context) {
    throw new Error(
      'useComposioContext must be used within a ComposioProvider',
    );
  }
  return context;
};

export default ComposioContext;
