import { useCallback, useState } from 'react'
import { supabase } from '@/components/supabaseClient'
import { getApiErrorMessage } from '@/api/http'
import {
  createAd as createAdRequest,
  deleteAd as deleteAdRequest,
  listAds,
  updateAd as updateAdRequest,
} from '@/api/ads/route'

const ADS_BUCKET = 'ads'

export type Ad = {
  id: string
  image_path: string
  alt_text: string | null
  is_active: boolean
  created_at: string
  imageUrl?: string | null
}

export type CreateAdPayload = {
  image_path: string
  alt_text?: string | null
  is_active?: boolean
}

export type UpdateAdPayload = {
  alt_text?: string | null
  is_active?: boolean
  image_path?: string
}

/**
 * Hook for fetching and managing advertisements.
 */
export function useAds() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches all active ads and attaches a public URL for each image.
   * Used by public Ads.jsx component.
   */
  const fetchAds = useCallback(async (): Promise<Ad[]> => {
    setError(null)
    const data = await listAds(true)

    return data.map((ad) => {
      const { data: urlData } = supabase.storage
        .from(ADS_BUCKET)
        .getPublicUrl(ad.image_path)

      return {
        ...ad,
        imageUrl: urlData?.publicUrl ?? null,
      }
    })
  }, [])

  /**
   * Fetches ALL ads (active and inactive) for admin management.
   */
  const fetchAllAds = useCallback(async (): Promise<Ad[]> => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAds()

      return data.map((ad) => {
        const { data: urlData } = supabase.storage
          .from(ADS_BUCKET)
          .getPublicUrl(ad.image_path)

        return {
          ...ad,
          imageUrl: urlData?.publicUrl ?? null,
        }
      })
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Uploads an advertisement image to Supabase Storage ('ads' bucket).
   * Returns the image_path.
   */
  const uploadAdImage = useCallback(async (file: File): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${Date.now()}_${sanitizedName}`

      const { data, error: uploadErr } = await supabase.storage
        .from(ADS_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadErr) throw uploadErr
      return data.path
    } catch (err: any) {
      const msg = err?.message || 'Failed to upload advertisement image.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Removes an image file from Supabase Storage ('ads' bucket).
   */
  const deleteAdImage = useCallback(async (imagePath: string): Promise<void> => {
    if (!imagePath) return
    try {
      const { error: removeErr } = await supabase.storage
        .from(ADS_BUCKET)
        .remove([imagePath])

      if (removeErr) {
        console.warn('Warning: Failed to remove file from storage:', removeErr.message)
      }
    } catch (err) {
      console.warn('Warning: Error removing file from storage:', err)
    }
  }, [])

  /**
   * Creates a new advertisement database record.
   */
  const createAd = useCallback(async (payload: CreateAdPayload, token: string): Promise<Ad> => {
    setLoading(true)
    setError(null)
    try {
      return await createAdRequest(payload, token)
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Updates an existing advertisement record.
   */
  const updateAd = useCallback(async (id: string, payload: UpdateAdPayload, token: string): Promise<Ad> => {
    setLoading(true)
    setError(null)
    try {
      return await updateAdRequest(id, payload, token)
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Deletes an advertisement record from DB and deletes its image from storage.
   */
  const deleteAd = useCallback(async (id: string, imagePath: string | undefined, token: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await deleteAdRequest(id, token)

      if (imagePath) {
        await deleteAdImage(imagePath)
      }
    } catch (err) {
      const msg = getApiErrorMessage(err)
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [deleteAdImage])

  return {
    loading,
    error,
    fetchAds,
    fetchAllAds,
    uploadAdImage,
    deleteAdImage,
    createAd,
    updateAd,
    deleteAd,
  }
}