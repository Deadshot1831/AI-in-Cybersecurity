export type ComponentType =
  | "llm-endpoint"
  | "rag-database"
  | "vector-store"
  | "prompt-template"
  | "user-interface"
  | "api-gateway"
  | "data-pipeline"
  | "auth-service"
  | "external-api"
  | "storage"
  | "custom"

export interface SystemComponent {
  id: string
  name: string
  type: ComponentType
  description: string
  technologies: string[]
  isExternalFacing: boolean
}

export interface DataFlow {
  id: string
  sourceId: string
  targetId: string
  label: string
  dataType: string
  isEncrypted: boolean
  protocol?: string
}

export interface TrustBoundary {
  id: string
  name: string
  componentIds: string[]
  trustLevel: "high" | "medium" | "low"
}

export interface SystemArchitecture {
  id: string
  name: string
  description: string
  components: SystemComponent[]
  dataFlows: DataFlow[]
  trustBoundaries: TrustBoundary[]
  createdAt: string
}

export type InputMode = "freeform" | "structured"

export const COMPONENT_TYPE_LABELS: Record<ComponentType, string> = {
  "llm-endpoint": "LLM Endpoint",
  "rag-database": "RAG Database",
  "vector-store": "Vector Store",
  "prompt-template": "Prompt Template",
  "user-interface": "User Interface",
  "api-gateway": "API Gateway",
  "data-pipeline": "Data Pipeline",
  "auth-service": "Auth Service",
  "external-api": "External API",
  storage: "Storage",
  custom: "Custom",
}
