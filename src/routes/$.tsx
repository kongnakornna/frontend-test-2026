import { createFileRoute, redirect } from '@tanstack/react-router'

/** Catch-all: the app has a single page, so every unknown URL redirects to the editor. */
export const Route = createFileRoute('/$')({
  beforeLoad: () => {
    throw redirect({ to: '/code-challenge/feature-flag-form', replace: true })
  },
})
