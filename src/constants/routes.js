export const SERVICES_DIRECTORY_ROUTE = '/services#services-directory'
export const LIVE_SANDBOX_ROUTE = '/services/live-terminal-sandbox#live-sandbox'
export const AWS_CALCULATOR_ROUTE = '/services/aws-cost-optimization#aws-cost-calculator'
export const ARCHITECTURE_STACK_ROUTE = '/architecture#stack-flow'

export function createDiscussUrl(topic = '') {
  return topic ? `/discuss?topic=${encodeURIComponent(topic)}` : '/discuss'
}
