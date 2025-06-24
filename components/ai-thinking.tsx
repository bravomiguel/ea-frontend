import { Loader2 } from 'lucide-react';

export function AIThinking() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground py-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Thinking...</span>
    </div>
  );
}
