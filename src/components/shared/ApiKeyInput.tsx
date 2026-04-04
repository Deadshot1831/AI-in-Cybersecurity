import { useState } from "react"
import { Key, Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function ApiKeyInput() {
  const { apiKey, setApiKey } = useSettingsStore()
  const [keyInput, setKeyInput] = useState(apiKey ?? "")
  const [showKey, setShowKey] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim())
    }
    setOpen(false)
  }

  const handleClear = () => {
    setApiKey(null)
    setKeyInput("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          {apiKey ? "API Key Set" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anthropic API Key</DialogTitle>
          <DialogDescription>
            Enter your API key to enable live threat analysis with Claude.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription className="text-xs">
            Your API key is stored in this browser's localStorage. Anyone with
            access to this browser can see it. This tool is intended for
            personal/development use only. Never use a production API key.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Label>API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-ant-..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!keyInput.trim()}>
              Save Key
            </Button>
            {apiKey && (
              <Button variant="destructive" onClick={handleClear} className="gap-2">
                <Trash2 className="h-4 w-4" /> Clear Key
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
