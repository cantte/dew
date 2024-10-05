'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    throw new Error('NEXT_PUBLIC_POSTHOG_KEY is not set')
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  })
}

type Props = {
  children: React.ReactNode
}

export function CSPostHogProvider({ children }: Readonly<Props>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
