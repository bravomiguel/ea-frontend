import { useState } from "react"
import { PaperclipIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center p-4"
    >
      <div className="max-w-3xl mx-auto w-full relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-gray-400 h-8 w-8"
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full h-8 w-8 bg-gray-900 hover:bg-gray-700 ml-2"
          disabled={disabled || !input.trim()}
        >
          <SendIcon className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  )
}
