import { createFileRoute, redirect } from '@tanstack/react-router'

/** The app has a single page: send the root URL to the editor. */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/code-challenge/feature-flag-form', replace: true })
  },
})
