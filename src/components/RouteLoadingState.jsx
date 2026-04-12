import React from 'react'

function RouteLoadingState() {
  return (
    <main className="page-shell pt-12">
      <section className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">route — loading</div>
        </div>

        <div className="terminal-content">
          <p className="text-sm leading-7 text-gray-300">Preparing the next route.</p>
        </div>
      </section>
    </main>
  )
}

export default RouteLoadingState
