import { useStreamContext } from '@/providers/stream-provider';
import { useState, useEffect, useRef } from 'react';

export function useStreamHelper() {
  const { messages } = useStreamContext();

  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  const prevMessageLength = useRef(0);

  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === 'ai'
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  return {
    firstTokenReceived,
    setFirstTokenReceived,
  };
}