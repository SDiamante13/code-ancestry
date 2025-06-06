export const generateFileName = (originalName: string): string => {
  const extension = originalName.split('.').pop()
  return `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`
}

export const extractErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error occurred'
}