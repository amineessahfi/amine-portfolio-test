export const LOGIN_ROUTE = '/login'
export const SERVICES_ROUTE = '/services'
export const SERVICES_DIRECTORY_ROUTE = `${SERVICES_ROUTE}#services-directory`
export const LIVE_SANDBOX_SERVICE_ROUTE = '/services/live-terminal-sandbox'
export const CLOUD_FIT_SERVICE_ROUTE = '/services/cloud-fit-deployment'
export const WORKFLOW_COMPOSER_SERVICE_ROUTE = '/services/workflow-composer'
export const LIVE_SANDBOX_DEMO_ROUTE = `${LIVE_SANDBOX_SERVICE_ROUTE}/demo`
export const CLOUD_FIT_DEMO_ROUTE = `${CLOUD_FIT_SERVICE_ROUTE}/demo`
export const WORKFLOW_COMPOSER_DEMO_ROUTE = `${WORKFLOW_COMPOSER_SERVICE_ROUTE}/demo`
export const LIVE_SANDBOX_ARCHITECTURE_ROUTE = `${LIVE_SANDBOX_SERVICE_ROUTE}/architecture`
export const LIVE_SANDBOX_ROUTE = `${LIVE_SANDBOX_DEMO_ROUTE}#live-sandbox`
export const SANDBOX_LOGIN_ROUTE = `${LIVE_SANDBOX_DEMO_ROUTE}#sandbox-login`
export const CLOUD_FIT_ROUTE = `${CLOUD_FIT_DEMO_ROUTE}#cloud-fit-model`
export const WORKFLOW_COMPOSER_ROUTE = `${WORKFLOW_COMPOSER_DEMO_ROUTE}#workflow-composer`
export const COST_REVIEW_SERVICE_ROUTE = CLOUD_FIT_SERVICE_ROUTE
export const COST_REVIEW_DEMO_ROUTE = CLOUD_FIT_DEMO_ROUTE
export const COST_REVIEW_ROUTE = CLOUD_FIT_ROUTE
export const AWS_CALCULATOR_ROUTE = CLOUD_FIT_ROUTE
export const ARCHITECTURE_STACK_ROUTE = `${LIVE_SANDBOX_ARCHITECTURE_ROUTE}#stack-flow`

export function createServiceRoute(serviceSlug = '') {
  return serviceSlug ? `${SERVICES_ROUTE}/${encodeURIComponent(serviceSlug)}` : SERVICES_ROUTE
}

export function createServiceDemoRoute(serviceSlug, hash = '') {
  const demoRoute = `${createServiceRoute(serviceSlug)}/demo`
  return hash ? `${demoRoute}#${hash}` : demoRoute
}

export function createServiceArchitectureRoute(serviceSlug, hash = '') {
  const architectureRoute = `${createServiceRoute(serviceSlug)}/architecture`
  return hash ? `${architectureRoute}#${hash}` : architectureRoute
}

export function createDiscussUrl(topic = '', options = {}) {
  const normalizedOptions = typeof options === 'string' ? { intent: options } : options
  const params = new URLSearchParams()

  if (topic) {
    params.set('topic', topic)
  }

  if (normalizedOptions.intent && normalizedOptions.intent !== 'scope') {
    params.set('intent', normalizedOptions.intent)
  }

  if (normalizedOptions.offer) {
    params.set('offer', normalizedOptions.offer)
  }

  const query = params.toString()
  return query ? `/discuss?${query}` : '/discuss'
}
