import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function IntakeTriggerButton({
  topic = '',
  intent = 'scope',
  offer = '',
  className = '',
  children,
  ...props
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleOpen = () => {
    const nextSearchParams = new URLSearchParams(location.search)

    nextSearchParams.set('intake', '1')

    if (topic) {
      nextSearchParams.set('topic', topic)
    } else {
      nextSearchParams.delete('topic')
    }

    if (intent && intent !== 'scope') {
      nextSearchParams.set('intent', intent)
    } else {
      nextSearchParams.delete('intent')
    }

    if (offer) {
      nextSearchParams.set('offer', offer)
    } else {
      nextSearchParams.delete('offer')
    }

    const nextSearch = nextSearchParams.toString()

    navigate({
      pathname: location.pathname,
      search: nextSearch ? `?${nextSearch}` : '',
      hash: location.hash,
    })
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={className}
      aria-haspopup="dialog"
      aria-controls="quick-intake-dialog"
      {...props}
    >
      {children}
    </button>
  )
}

export default IntakeTriggerButton
