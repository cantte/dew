'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LeavingDialog } from '~/components/leaving-dialog'

type Props = {
  prevent: boolean
  backHref: string
  reset: () => void
}

export const PreventNavigation = ({ prevent, backHref, reset }: Props) => {
  const [leavingPage, setLeavingPage] = useState(false)
  const router = useRouter()

  /**
   * Function that will be called when the user selects `yes` in the confirmation modal,
   * redirected to the selected page.
   */
  // biome-ignore lint/suspicious/noEmptyBlockStatements: This is a placeholder for the confirmation function.
  const confirmationFn = useRef<() => void>(() => {})

  // Used to make popstate event trigger when back button is clicked.
  // Without this, the popstate event will not fire because it needs there to be a href to return.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, document.title, window.location.href)
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: only need prevent
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!prevent) {
        return
      }

      const target = event.target as HTMLAnchorElement

      event.preventDefault()

      confirmationFn.current = () => {
        router.push(target.href)
      }

      setLeavingPage(true)
    }

    const handlePopState = () => {
      if (!prevent) {
        window.history.back()
        return
      }

      window.history.pushState(null, document.title, window.location.href)
      confirmationFn.current = () => {
        router.push(backHref)
      }

      setLeavingPage(true)
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!prevent) {
        return
      }

      event.preventDefault()
      event.returnValue = true
    }

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', handleClick)
    })

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.querySelectorAll('a').forEach((link) => {
        link.removeEventListener('click', handleClick)
      })

      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [prevent])

  const handleConfirmation = () => {
    confirmationFn.current()
    setLeavingPage(false)

    // biome-ignore lint/suspicious/noEmptyBlockStatements: This is a placeholder for the confirmation function.
    confirmationFn.current = () => {}
    reset()
  }

  const handleCancel = () => {
    setLeavingPage(false)
    // biome-ignore lint/suspicious/noEmptyBlockStatements: This is a placeholder for the confirmation function.
    confirmationFn.current = () => {}
  }

  return (
    <LeavingDialog
      open={leavingPage}
      onComfirm={handleConfirmation}
      onCancel={handleCancel}
    />
  )
}
