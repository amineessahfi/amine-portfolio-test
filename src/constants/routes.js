export const LOGIN_ROUTE = '/login'
export const SERVICES_DIRECTORY_ROUTE = '/services#services-directory'
export const LIVE_SANDBOX_SERVICE_ROUTE = '/services/live-terminal-sandbox'
export const COST_REVIEW_SERVICE_ROUTE = '/services/cloud-cost-optimization'
export const WORKFLOW_COMPOSER_SERVICE_ROUTE = '/services/workflow-composer'
export const LIVE_SANDBOX_ROUTE = `${LIVE_SANDBOX_SERVICE_ROUTE}/demo#live-sandbox`
export const SANDBOX_LOGIN_ROUTE = `${LIVE_SANDBOX_SERVICE_ROUTE}/demo#sandbox-login`
export const COST_REVIEW_ROUTE = `${COST_REVIEW_SERVICE_ROUTE}/demo#cost-review-model`
export const WORKFLOW_COMPOSER_ROUTE = `${WORKFLOW_COMPOSER_SERVICE_ROUTE}/demo#workflow-composer`
export const AWS_CALCULATOR_ROUTE = COST_REVIEW_ROUTE
export const ARCHITECTURE_STACK_ROUTE = '/architecture#stack-flow'

export function createServiceRoute(serviceSlug = '') {
  return serviceSlug ? `/services/${encodeURIComponent(serviceSlug)}` : '/services'
}

export function createServiceDemoRoute(serviceSlug, hash = '') {
  const demoRoute = `${createServiceRoute(serviceSlug)}/demo`
  return hash ? `${demoRoute}#${hash}` : demoRoute
}

export function createDiscussUrl(topic = '') {
  return topic ? `/discuss?topic=${encodeURIComponent(topic)}` : '/discuss'
}
