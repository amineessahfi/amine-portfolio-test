export const LOGIN_ROUTE = '/login'
export const SERVICES_DIRECTORY_ROUTE = '/services#services-directory'
export const LIVE_SANDBOX_ROUTE = '/services/live-terminal-sandbox#live-sandbox'
export const SANDBOX_LOGIN_ROUTE = '/services/live-terminal-sandbox#sandbox-login'
export const COST_REVIEW_ROUTE = '/services/cloud-cost-optimization#cost-review-model'
export const AWS_CALCULATOR_ROUTE = COST_REVIEW_ROUTE
export const ARCHITECTURE_STACK_ROUTE = '/architecture#stack-flow'

export function createDiscussUrl(topic = '') {
  return topic ? `/discuss?topic=${encodeURIComponent(topic)}` : '/discuss'
}
