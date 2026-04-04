import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSystemStore } from "@/stores/useSystemStore"

const PLACEHOLDER = `Describe your LLM/GenAI system architecture. For example:

"Our system is a customer support chatbot built with:
- A React frontend that users interact with
- An API gateway (FastAPI) that handles authentication and rate limiting
- An LLM endpoint using Claude via the Anthropic API
- A RAG pipeline that retrieves relevant docs from a Pinecone vector store
- A document ingestion service that processes PDFs and creates embeddings
- All internal services communicate over HTTPS within a VPC
- The frontend and API gateway are internet-facing
- The vector store and LLM endpoint are internal only"`

export function FreeformInput() {
  const { freeformText, setFreeformText, parseError } = useSystemStore()

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={PLACEHOLDER}
        value={freeformText}
        onChange={(e) => setFreeformText(e.target.value)}
        rows={12}
        className="font-mono text-sm"
      />
      {parseError && (
        <Alert variant="destructive">
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        Describe your system in natural language. Include components, data flows,
        and trust boundaries. The AI will parse this into a structured architecture.
      </p>
    </div>
  )
}
