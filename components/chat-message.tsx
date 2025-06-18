import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 py-4",
        role === "assistant" ? "" : "justify-end"
      )}
    >
      {role === "assistant" && (
        <Avatar className="mt-1 h-8 w-8">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "space-y-2 max-w-[80%]",
        role === "user" ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "inline-block rounded-lg px-4 py-2 text-sm",
          role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
        )}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
            </div>
          ) : (
            <div className="whitespace-pre-line">{content}</div>
          )}
        </div>
      </div>
    </div>
  )
}
