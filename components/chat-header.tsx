import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="mt-3">
      <div className="flex h-12 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-auto">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </div>
  )
}
