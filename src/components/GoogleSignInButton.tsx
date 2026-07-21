import { useEffect, useRef, useState } from 'react'
import { API_CONFIG } from '../api/config'
import './GoogleSignInButton.css'

type GoogleSignInButtonProps = {
  disabled?: boolean
  onCredential: (idToken: string) => void | Promise<void>
  onError?: (message: string) => void
}

function waitForGoogleScript(timeoutMs = 10_000): Promise<NonNullable<Window['google']>> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    function check() {
      if (window.google?.accounts?.id) {
        resolve(window.google)
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Google Sign-In failed to load. Please refresh and try again.'))
        return
      }

      window.setTimeout(check, 50)
    }

    check()
  })
}

function measureButtonWidth(element: HTMLElement): number {
  const width = Math.floor(element.getBoundingClientRect().width)
  // GIS accepts pixel widths; clamp to its documented range.
  return Math.min(400, Math.max(width || 320, 200))
}

export function GoogleSignInButton({
  disabled = false,
  onCredential,
  onError,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)
  const [ready, setReady] = useState(false)

  onCredentialRef.current = onCredential
  onErrorRef.current = onError

  useEffect(() => {
    const clientId = API_CONFIG.googleClientId
    if (!clientId) {
      onErrorRef.current?.('Google Sign-In is not configured.')
      return
    }

    const container = containerRef.current
    const buttonHost = buttonRef.current
    if (!container || !buttonHost) {
      return
    }

    let cancelled = false
    let googleApi: NonNullable<Window['google']> | null = null
    let lastWidth = 0

    function renderGoogleButton(width: number) {
      if (!googleApi || !buttonHost || cancelled) {
        return
      }

      buttonHost.innerHTML = ''
      googleApi.accounts.id.renderButton(buttonHost, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width,
        logo_alignment: 'left',
        locale: 'en',
      })
      lastWidth = width
      setReady(true)
    }

    async function setup() {
      try {
        googleApi = await waitForGoogleScript()
        if (cancelled || !buttonHost) {
          return
        }

        googleApi.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              onErrorRef.current?.('Google did not return a credential.')
              return
            }
            void onCredentialRef.current(response.credential)
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        // Wait a frame so the 100% width container has a real layout size.
        requestAnimationFrame(() => {
          if (cancelled || !container) {
            return
          }
          renderGoogleButton(measureButtonWidth(container))
        })
      } catch (err) {
        if (!cancelled) {
          onErrorRef.current?.(
            err instanceof Error ? err.message : 'Unable to load Google Sign-In.',
          )
        }
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry || !googleApi) {
        return
      }

      const nextWidth = measureButtonWidth(container)
      if (Math.abs(nextWidth - lastWidth) >= 1) {
        renderGoogleButton(nextWidth)
      }
    })

    resizeObserver.observe(container)
    void setup()

    return () => {
      cancelled = true
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`google-signin${disabled || !ready ? ' google-signin--disabled' : ''}`}
      aria-busy={!ready}
    >
      <div ref={buttonRef} className="google-signin__button" />
      {!ready ? (
        <button type="button" className="login-button login-button--google" disabled>
          Continue with Google
        </button>
      ) : null}
    </div>
  )
}
