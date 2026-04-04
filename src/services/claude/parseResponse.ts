export function extractJson(text: string): string {
  // Strip markdown code fences
  let cleaned = text.trim()

  // Remove ```json ... ``` or ``` ... ```
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim()
  }

  // Try to find JSON object boundaries
  const startIdx = cleaned.indexOf("{")
  const endIdx = cleaned.lastIndexOf("}")
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(startIdx, endIdx + 1)
  }

  return cleaned
}

export function parseJsonResponse<T>(text: string): T {
  const jsonStr = extractJson(text)

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    // Attempt to fix common issues
    let fixed = jsonStr
      // Remove trailing commas before closing brackets
      .replace(/,\s*([}\]])/g, "$1")
      // Fix unescaped newlines in strings
      .replace(/(?<=": ")(.*?)(?="[,}\n])/gs, (match) =>
        match.replace(/\n/g, "\\n")
      )

    try {
      return JSON.parse(fixed) as T
    } catch (e) {
      throw new Error(
        `Failed to parse Claude response as JSON: ${e instanceof Error ? e.message : "unknown error"}`
      )
    }
  }
}
