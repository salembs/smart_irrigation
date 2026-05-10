'use client'

import { useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    return null
  }
  
  supabaseInstance = createClient(url, key)
  return supabaseInstance
}

// Demo data when Supabase is not configured
const DEMO_DATA: IrrigationData = {
  id: 1,
  soil_moisture: 0,
  rain: 0,
  command: 0,
  duration: 0,
  updated_at: new Date().toISOString(),
}

export interface IrrigationData {
  id: number
  soil_moisture: number // 0 = low, 1 = high
  rain: number // 0 = low, 1 = high
  command: number // 0 = off, 1 = on
  duration: number // minutes
  updated_at: string
}

export function useIrrigationData() {
  const [data, setData] = useState<IrrigationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // If Supabase is not configured, use demo mode
    if (!supabase) {
      console.log('[v0] Supabase not configured, using demo mode')
      setData(DEMO_DATA)
      setLoading(false)
      setIsDemo(true)
      return
    }

    // Initial fetch
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get the most recent record
        const { data: latestData, error: queryError } = await supabase
          .from('irrigation')
          .select('*')
          .order('id', { ascending: false })
          .limit(1)

        if (queryError) {
          console.error('[v0] Supabase fetch error:', queryError)
          setError(queryError.message)
        } else if (latestData && latestData.length > 0) {
          console.log('[v0] Fetched irrigation data:', latestData[0])
          setData(latestData[0] as IrrigationData)
        } else {
          // If table is empty, create initial record
          console.log('[v0] No irrigation data found, creating initial record')
          const { data: newRecord, error: insertError } = await supabase
            .from('irrigation')
            .insert([
              {
                soil_moisture: 0,
                rain: 0,
                command: 0,
                duration: 0,
                updated_at: new Date().toISOString(),
              },
            ])
            .select()

          if (insertError) {
            console.error('[v0] Error creating initial record:', insertError)
            setError(insertError.message)
          } else if (newRecord && newRecord.length > 0) {
            setData(newRecord[0] as IrrigationData)
          }
        }
      } catch (err) {
        console.error('[v0] Error fetching irrigation data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('irrigation_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'irrigation',
        },
        (payload) => {
          console.log('[v0] Real-time update received:', payload)
          if (payload.new) {
            setData(payload.new as IrrigationData)
          }
        }
      )
      .subscribe((status) => {
        console.log('[v0] Realtime subscription status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const updateCommand = async (command: number, duration: number) => {
    try {
      if (!data || data.id === undefined || data.id === null) {
        const errorMsg = 'No irrigation data loaded, cannot update'
        console.error('[v0]', errorMsg)
        setError(errorMsg)
        throw new Error(errorMsg)
      }

      console.log('[v0] Updating command:', { command, duration, id: data.id })
      
      // Demo mode - just update local state
      if (isDemo) {
        console.log('[v0] Demo mode: updating local state only')
        setData({
          ...data,
          command,
          duration,
          updated_at: new Date().toISOString(),
        })
        return
      }
      
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        throw new Error('Supabase not configured')
      }
      
      const { error: updateError, data: updatedData } = await supabase
        .from('irrigation')
        .update({ 
          command, 
          duration, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.id)
        .select()

      if (updateError) {
        console.error('[v0] Error updating command:', updateError)
        setError(updateError.message)
        throw updateError
      } else {
        console.log('[v0] Command updated successfully:', updatedData)
        if (updatedData && updatedData.length > 0) {
          setData(updatedData[0] as IrrigationData)
          setError(null)
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error in updateCommand:', errorMsg)
      setError(errorMsg)
      throw err
    }
  }

  const stopIrrigation = async () => {
    try {
      if (!data || data.id === undefined || data.id === null) {
        const errorMsg = 'No irrigation data loaded, cannot stop'
        console.error('[v0]', errorMsg)
        setError(errorMsg)
        throw new Error(errorMsg)
      }

      console.log('[v0] Stopping irrigation, setting soil_moisture=1, command=0, duration=0')
      
      // Demo mode - just update local state
      if (isDemo) {
        console.log('[v0] Demo mode: updating local state only')
        setData({
          ...data,
          command: 0,
          duration: 0,
          soil_moisture: 1,
          updated_at: new Date().toISOString(),
        })
        return
      }
      
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        throw new Error('Supabase not configured')
      }
      
      const { error: updateError, data: updatedData } = await supabase
        .from('irrigation')
        .update({ 
          command: 0, 
          duration: 0,
          soil_moisture: 1,
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.id)
        .select()

      if (updateError) {
        console.error('[v0] Error stopping irrigation:', updateError)
        setError(updateError.message)
        throw updateError
      } else {
        console.log('[v0] Irrigation stopped successfully:', updatedData)
        if (updatedData && updatedData.length > 0) {
          setData(updatedData[0] as IrrigationData)
          setError(null)
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error in stopIrrigation:', errorMsg)
      setError(errorMsg)
      throw err
    }
  }

  return { data, loading, error, updateCommand, stopIrrigation, isDemo }
}
