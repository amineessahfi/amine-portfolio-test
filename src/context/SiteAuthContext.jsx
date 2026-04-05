import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SANDBOX_API_BASE } from '../constants/sandbox'

const defaultAuthState = {
  authenticated: false,
  authConfigured: false,
  provider: 'google',
  freeAnonymousSessions: 1,
  anonymousSessionsUsed: 0,
  user: null,
}

const SiteAuthContext = createContext(null)

function normalizeAuthState(payload = {}) {
  return {
    authenticated: Boolean(payload.authenticated),
    authConfigured: Boolean(payload.authConfigured),
    provider: payload.provider || 'google',
    freeAnonymousSessions: payload.freeAnonymousSessions ?? 1,
    anonymousSessionsUsed: payload.anonymousSessionsUsed ?? 0,
    user: payload.user || null,
  }
}

export function SiteAuthProvider({ children }) {
  const [authState, setAuthState] = useState(defaultAuthState)
  const [authReady, setAuthReady] = useState(false)

  const syncAuthState = useCallback(async () => {
    try {
      const response = await fetch(`${SANDBOX_API_BASE}/auth/status`, {
        credentials: 'include',
      })

      if (!response.ok) {
        return {
          ok: false,
          error: 'Login status could not be loaded right now.',
        }
      }

      const payload = await response.json()
      setAuthState(normalizeAuthState(payload))

      return {
        ok: true,
        payload,
      }
    } catch {
      return {
        ok: false,
        error: 'Login status could not be loaded right now.',
      }
    } finally {
      setAuthReady(true)
    }
  }, [])

  useEffect(() => {
    void syncAuthState()
  }, [syncAuthState])

  const consumeOauthResult = useCallback(() => {
    const currentUrl = new URL(window.location.href)
    const oauthState = currentUrl.searchParams.get('oauth')

    if (!oauthState) {
      return ''
    }

    currentUrl.searchParams.delete('oauth')
    window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`)

    return oauthState
  }, [])

  const startSignIn = useCallback((returnTo = window.location.href) => {
    if (!authState.authConfigured) {
      return 'Secure sign-in is not configured on the backend yet.'
    }

    const currentUrl = new URL(returnTo, window.location.origin)
    currentUrl.searchParams.delete('oauth')

    window.location.assign(
      `${SANDBOX_API_BASE}/auth/google/start?returnTo=${encodeURIComponent(currentUrl.toString())}`,
    )

    return ''
  }, [authState.authConfigured])

  const signOut = useCallback(async () => {
    try {
      const response = await fetch(`${SANDBOX_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        return 'Could not sign out right now.'
      }

      const result = await syncAuthState()
      return result.ok ? '' : result.error
    } catch {
      return 'Could not sign out right now.'
    }
  }, [syncAuthState])

  const value = useMemo(() => ({
    authReady,
    authState,
    consumeOauthResult,
    signOut,
    startSignIn,
    syncAuthState,
  }), [authReady, authState, consumeOauthResult, signOut, startSignIn, syncAuthState])

  return (
    <SiteAuthContext.Provider value={value}>
      {children}
    </SiteAuthContext.Provider>
  )
}

export function useSiteAuth() {
  const context = useContext(SiteAuthContext)

  if (!context) {
    throw new Error('useSiteAuth must be used within a SiteAuthProvider.')
  }

  return context
}
