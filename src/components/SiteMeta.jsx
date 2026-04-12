import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { buildAbsoluteUrl, getPageMeta } from '../lib/siteMeta'

function upsertHeadElement(selector, tagName, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement(tagName)
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([attribute, value]) => {
    if (value === null || value === undefined || value === '') {
      element.removeAttribute(attribute)
      return
    }

    element.setAttribute(attribute, value)
  })
}

function SiteMeta() {
  const location = useLocation()

  useEffect(() => {
    const pageMeta = getPageMeta(location.pathname, location.search)
    const canonicalUrl = buildAbsoluteUrl(pageMeta.canonicalPath || '/')

    document.title = pageMeta.title

    upsertHeadElement('meta[name="description"]', 'meta', {
      name: 'description',
      content: pageMeta.description,
    })
    upsertHeadElement('meta[property="og:title"]', 'meta', {
      property: 'og:title',
      content: pageMeta.title,
    })
    upsertHeadElement('meta[property="og:description"]', 'meta', {
      property: 'og:description',
      content: pageMeta.description,
    })
    upsertHeadElement('meta[property="og:type"]', 'meta', {
      property: 'og:type',
      content: pageMeta.ogType,
    })
    upsertHeadElement('meta[property="og:site_name"]', 'meta', {
      property: 'og:site_name',
      content: 'Amine Essahfi',
    })
    upsertHeadElement('meta[property="og:url"]', 'meta', {
      property: 'og:url',
      content: canonicalUrl,
    })
    upsertHeadElement('meta[name="twitter:card"]', 'meta', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertHeadElement('meta[name="twitter:title"]', 'meta', {
      name: 'twitter:title',
      content: pageMeta.title,
    })
    upsertHeadElement('meta[name="twitter:description"]', 'meta', {
      name: 'twitter:description',
      content: pageMeta.description,
    })
    upsertHeadElement('meta[name="robots"]', 'meta', {
      name: 'robots',
      content: pageMeta.robots,
    })
    upsertHeadElement('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: canonicalUrl,
    })
  }, [location.pathname, location.search])

  return null
}

export default SiteMeta
