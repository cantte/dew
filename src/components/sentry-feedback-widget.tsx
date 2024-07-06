'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect, useState } from 'react'

const createWidget = () => {
  return Sentry.getFeedback()?.createWidget()
}

const useFeedbackWidget = (shouldMount: boolean) => {
  const [widget, setWidget] = useState<ReturnType<typeof createWidget> | null>(
    null,
  )
  useEffect(() => {
    // Mount if true and no widget exists
    if (shouldMount && !widget) {
      const newWidget = createWidget()
      setWidget(newWidget)
    }

    // Unmount if false and widget exists
    if (!shouldMount && widget) {
      widget.removeFromDom()
      setWidget(null)
    }
  }, [shouldMount, widget])
}

export const SentryFeedbackWidget = () => {
  useFeedbackWidget(true)

  return null
}
