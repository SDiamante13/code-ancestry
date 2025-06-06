import { useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { analytics } from '@/src/lib/analytics'

interface UploadOptions {
  onSuccess?: (publicUrl: string) => void
  onError?: (error: string) => void
  bucket?: string
  analyticsEvent?: 'before' | 'during' | 'after'
  evolutionId?: string
}

export const useFileUpload = (options: UploadOptions = {}) => {
  const [uploading, setUploading] = useState(false)
  
  const {
    onSuccess,
    onError,
    bucket = 'screenshots',
    analyticsEvent,
    evolutionId
  } = options

  const generateFileName = (originalName: string): string => {
    const extension = originalName.split('.').pop()
    return `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null

    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = generateFileName(file.name)

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      if (analyticsEvent && evolutionId) {
        analytics.trackEvolutionCreate(analyticsEvent, { evolution_id: evolutionId })
      }

      onSuccess?.(publicUrl)
      return publicUrl
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (analyticsEvent && evolutionId) {
        analytics.trackError(`${analyticsEvent} upload failed: ${errorMessage}`, { evolution_id: evolutionId })
      }
      
      onError?.(errorMessage)
      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    uploadFile
  }
}