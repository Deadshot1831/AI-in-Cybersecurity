import type Anthropic from "@anthropic-ai/sdk"

interface StreamOptions {
  client: Anthropic
  systemPrompt: string
  userPrompt: string
  onChunk: (text: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}

export async function streamAnalysis({
  client,
  systemPrompt,
  userPrompt,
  onChunk,
  onComplete,
  onError,
}: StreamOptions): Promise<void> {
  try {
    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    stream.on("text", (text) => {
      onChunk(text)
    })

    const finalMessage = await stream.finalMessage()
    const fullText = finalMessage.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    onComplete(fullText)
  } catch (error) {
    if (error instanceof Error) {
      onError(error)
    } else {
      onError(new Error("Unknown error during streaming"))
    }
  }
}
