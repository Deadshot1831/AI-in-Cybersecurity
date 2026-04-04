export interface OwaspLlmCategory {
  id: string
  name: string
  description: string
  exampleAttacks: string[]
  mitigationStrategies: string[]
}

export interface StrideCategory {
  id: string
  name: string
  description: string
  securityProperty: string
  aiSpecificExamples: string[]
}

export interface AtlasTactic {
  id: string
  name: string
  description: string
  techniques: AtlasTechnique[]
}

export interface AtlasTechnique {
  id: string
  name: string
  description: string
  tacticId: string
}
