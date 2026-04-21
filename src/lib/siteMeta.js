import { discussIntentPresets, getDiscussTopicPreset } from '../data/discussTopics.js'
import { getServiceBySlug, normalizeServiceSlug, serviceSlugAliases, services } from '../data/services.js'
import { LIVE_SANDBOX_ARCHITECTURE_ROUTE, LOGIN_ROUTE, SERVICES_ROUTE } from '../constants/routes.js'

const envSiteUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SITE_URL || process.env.SITE_URL))

export const SITE_URL = String(envSiteUrl || 'https://amine-portfolio-test.vercel.app').replace(/\/+$/, '')

const HOME_PATH = '/'
const DISCUSS_ROUTE = '/discuss'
const ARCHITECTURE_COMPAT_ROUTE = '/architecture'
const DEFAULT_ROBOTS = 'index,follow'
const DEFAULT_OG_TYPE = 'website'
const SERVICE_PATHS = services.map((service) => `/services/${service.slug}`)
const DEMO_PATHS = [
  '/services/live-terminal-sandbox/demo',
  '/services/cloud-fit-deployment/demo',
  '/services/workflow-composer/demo',
  '/services/data-platforms/demo',
]
const COMPATIBILITY_SERVICE_PATHS = Object.keys(serviceSlugAliases).map((aliasSlug) => `/services/${aliasSlug}`)
const INDEXABLE_PATHS = [
  HOME_PATH,
  SERVICES_ROUTE,
  DISCUSS_ROUTE,
  ...SERVICE_PATHS,
  ...DEMO_PATHS,
  LIVE_SANDBOX_ARCHITECTURE_ROUTE,
]

function trimDescription(text, maxLength = 170) {
  if (!text) {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  const truncated = text.slice(0, maxLength - 1)
  const lastWordBoundary = truncated.lastIndexOf(' ')
  const safeSlice = lastWordBoundary > 96 ? truncated.slice(0, lastWordBoundary) : truncated

  return `${safeSlice.trimEnd()}...`
}

function withBrand(label) {
  return `${label} | Amine Essahfi`
}

function createMeta({ title, description, pathname, canonicalPath = pathname, robots = DEFAULT_ROBOTS }) {
  return {
    title,
    description: trimDescription(description),
    pathname: normalizePathname(pathname),
    canonicalPath: canonicalPath ? normalizePathname(canonicalPath) : null,
    robots,
    ogType: DEFAULT_OG_TYPE,
  }
}

function getDemoMetaForService(service, pathname, canonicalPath, robots) {
  const demoMetaBySlug = {
    'live-terminal-sandbox': createMeta({
      title: withBrand('Live Linux sandbox demo'),
      description:
        'Launch a five-minute Linux shell inside guarded runtime boundaries and inspect the architecture behind the public proof surface.',
      pathname,
      canonicalPath,
      robots,
    }),
    'cloud-fit-deployment': createMeta({
      title: withBrand('Cloud fit demo'),
      description:
        'Compare provider fit, inspect the services bill of materials, preview the generated IaC pack, and choose the right delivery handoff.',
      pathname,
      canonicalPath,
      robots,
    }),
    'workflow-composer': createMeta({
      title: withBrand('Workflow composer demo'),
      description:
        'Preview triggers, branches, approvals, and a restricted live studio before you scope a workflow automation build.',
      pathname,
      canonicalPath,
      robots,
    }),
    'data-platforms': createMeta({
      title: withBrand('AWS data architecture demo'),
      description:
        'Shape ingestion, lakehouse, orchestration, governance, serving, and recovery decisions for a production-minded AWS data platform.',
      pathname,
      canonicalPath,
      robots,
    }),
  }

  return demoMetaBySlug[service.slug] || getNotFoundMeta(pathname)
}

function getNotFoundMeta(pathname = HOME_PATH) {
  return createMeta({
    title: withBrand('Page not found'),
    description: 'The page you requested does not exist or is no longer published at this route.',
    pathname,
    canonicalPath: HOME_PATH,
    robots: 'noindex,follow',
  })
}

export function normalizePathname(pathname = HOME_PATH) {
  if (!pathname) {
    return HOME_PATH
  }

  const normalizedPathname = pathname.replace(/\/+$/, '')
  return normalizedPathname || HOME_PATH
}

export function buildAbsoluteUrl(pathname = HOME_PATH) {
  return new URL(normalizePathname(pathname), `${SITE_URL}/`).toString()
}

export function getStaticHtmlPaths() {
  return [
    HOME_PATH,
    SERVICES_ROUTE,
    DISCUSS_ROUTE,
    LOGIN_ROUTE,
    ARCHITECTURE_COMPAT_ROUTE,
    ...SERVICE_PATHS,
    ...COMPATIBILITY_SERVICE_PATHS,
    ...DEMO_PATHS,
    LIVE_SANDBOX_ARCHITECTURE_ROUTE,
  ]
}

export function getSitemapEntries() {
  return INDEXABLE_PATHS.map((path) => {
    if (path === HOME_PATH) {
      return { path, changefreq: 'weekly', priority: '1.0' }
    }

    if (path === SERVICES_ROUTE) {
      return { path, changefreq: 'weekly', priority: '0.95' }
    }

    if (path === DISCUSS_ROUTE) {
      return { path, changefreq: 'monthly', priority: '0.8' }
    }

    if (path.endsWith('/demo')) {
      return { path, changefreq: 'monthly', priority: '0.82' }
    }

    if (path === LIVE_SANDBOX_ARCHITECTURE_ROUTE) {
      return { path, changefreq: 'monthly', priority: '0.74' }
    }

    return { path, changefreq: 'monthly', priority: '0.88' }
  })
}

export function getPageMeta(pathname = HOME_PATH, search = '') {
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === HOME_PATH) {
    return createMeta({
      title: 'Amine Essahfi | Diagnose hidden failure in complex systems',
      description:
        'Proof-led consulting across platform systems, cloud fit, workflow automation, operational data, telecom tooling, and safe interactive demos.',
      pathname: normalizedPathname,
    })
  }

  if (normalizedPathname === SERVICES_ROUTE) {
    return createMeta({
      title: withBrand('Services for platform, cloud, data, automation, and telco delivery'),
      description:
        'Browse consulting services across platform engineering, cloud fit and deployment packs, data platforms, telecom tooling, live sandbox systems, and workflow automation.',
      pathname: normalizedPathname,
    })
  }

  if (normalizedPathname === DISCUSS_ROUTE) {
    const params = new URLSearchParams(search)
    const topicPreset = getDiscussTopicPreset(params.get('topic') || 'general')
    const intentKey = params.get('intent') === 'explore' ? 'explore' : 'scope'
    const intentPreset = discussIntentPresets[intentKey]
    const isGeneralTopic = topicPreset.optionLabel === 'General project fit'
    const title = isGeneralTopic
      ? withBrand(intentKey === 'explore' ? 'Discuss from proof' : 'Discuss a scoped engagement')
      : withBrand(`Discuss ${topicPreset.optionLabel.toLowerCase()}`)

    return createMeta({
      title,
      description: isGeneralTopic
        ? 'Use the guided intake to move from proof or delivery pressure into a fit verdict and a concrete next step.'
        : `${topicPreset.intro} ${intentPreset.summaryText}`,
      pathname: normalizedPathname,
      canonicalPath: DISCUSS_ROUTE,
    })
  }

  if (normalizedPathname === LOGIN_ROUTE) {
    return createMeta({
      title: withBrand('Access for gated proof surfaces'),
      description:
        'Use sign-in only for the small set of gated demos that need identified or temporary access. Browsing the site stays open.',
      pathname: normalizedPathname,
      robots: 'noindex,follow',
    })
  }

  if (normalizedPathname === ARCHITECTURE_COMPAT_ROUTE) {
    return createMeta({
      title: withBrand('Live sandbox architecture'),
      description:
        'See how the browser UI, routing layer, backend broker, and bounded runtime fit together behind the live sandbox proof surface.',
      pathname: normalizedPathname,
      canonicalPath: LIVE_SANDBOX_ARCHITECTURE_ROUTE,
      robots: 'noindex,follow',
    })
  }

  if (normalizedPathname === LIVE_SANDBOX_ARCHITECTURE_ROUTE) {
    return createMeta({
      title: withBrand('Live sandbox architecture'),
      description:
        'See how the browser UI, routing layer, backend broker, and bounded runtime fit together behind the live sandbox proof surface.',
      pathname: normalizedPathname,
    })
  }

  const pathSegments = normalizedPathname.split('/').filter(Boolean)

  if (pathSegments[0] === 'services' && pathSegments.length === 2) {
    const requestedSlug = pathSegments[1]
    const canonicalSlug = normalizeServiceSlug(requestedSlug)
    const service = getServiceBySlug(requestedSlug)

    if (!service) {
      return getNotFoundMeta(normalizedPathname)
    }

    return createMeta({
      title: withBrand(service.title),
      description: service.summary,
      pathname: normalizedPathname,
      canonicalPath: `/services/${service.slug}`,
      robots: requestedSlug === canonicalSlug ? DEFAULT_ROBOTS : 'noindex,follow',
    })
  }

  if (pathSegments[0] === 'services' && pathSegments.length === 3 && pathSegments[2] === 'demo') {
    const requestedSlug = pathSegments[1]
    const canonicalSlug = normalizeServiceSlug(requestedSlug)
    const service = getServiceBySlug(requestedSlug)

    if (!service || !DEMO_PATHS.includes(`/services/${service.slug}/demo`)) {
      return getNotFoundMeta(normalizedPathname)
    }

    return getDemoMetaForService(
      service,
      normalizedPathname,
      `/services/${service.slug}/demo`,
      requestedSlug === canonicalSlug ? DEFAULT_ROBOTS : 'noindex,follow',
    )
  }

  return getNotFoundMeta(normalizedPathname)
}
