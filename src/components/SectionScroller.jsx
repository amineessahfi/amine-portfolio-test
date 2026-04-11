import React from 'react'

function SectionScroller({ items, label = 'Page sections' }) {
  if (!items?.length) {
    return null
  }

  return (
    <div className="section-scroller-shell">
      <div className="section-scroller">
        <p className="section-scroller-label">{label}</p>
        <nav aria-label={label} className="section-scroller-track">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="section-scroller-link">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SectionScroller
