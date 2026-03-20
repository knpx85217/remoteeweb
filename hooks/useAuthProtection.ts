import { useCallback } from 'react'

export function useAuthProtection() {
  // Protected action wrapper - just executes action
  const protectedAction = useCallback(async (action: () => Promise<void>) => {
    return action()
  }, [])

  return { protectedAction }
}