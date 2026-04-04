import React from 'react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <section className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">route — not found</div>
        </div>

        <div className="terminal-content">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">404</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">That page does not exist.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              The route may have changed while the site is being expanded into service pages.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage
