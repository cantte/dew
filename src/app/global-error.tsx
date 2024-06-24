'use client'

import * as Sentry from '@sentry/nextjs'
import Error from 'next/error'
import { useEffect } from 'react'

type Props = {
  error: unknown
}

export default function GlobalError({ error }: Readonly<Props>) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <Error statusCode={500} title="An unexpected error has occurred" />
      </body>
    </html>
  )
}
