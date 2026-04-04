export const simulateDelay = (ms: number = 1500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))
