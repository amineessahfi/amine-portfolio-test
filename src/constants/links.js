export const DEFAULT_LEAD_INBOX = 'amine.essahfi@gmail.com'
const defaultDiscussPrompts = [
  'Problem / pressure point:',
  'Current stack or environment:',
  'What good looks like in the first phase:',
  'Anything time-sensitive:',
]

export const GITHUB_URL = 'https://github.com/amineessahfi'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/amine-essahfi-834a59126'
export const EMAIL_URL = `mailto:${DEFAULT_LEAD_INBOX}`
export const RESUME_REQUEST_URL =
  `${EMAIL_URL}?subject=Resume%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20see%20your%20resume.`
export const AUDIT_REQUEST_URL =
  `${EMAIL_URL}?subject=Cloud%20fit%20review%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20discuss%20a%20cloud%20fit%20recommendation%20and%20deployment%20path.`

export function createDiscussEmailUrl({
  subject = 'Project conversation',
  intro = 'I would like to discuss a project.',
  prompts = defaultDiscussPrompts,
} = {}) {
  const body = encodeURIComponent(
    [
      'Hi Amine,',
      '',
      intro,
      '',
      ...prompts,
      '',
    ].join('\n'),
  )

  return `${EMAIL_URL}?subject=${encodeURIComponent(subject)}&body=${body}`
}

export function createLeadSubmissionEmailUrl({
  recipient = DEFAULT_LEAD_INBOX,
  subject = 'Project conversation',
  intro = 'I would like to discuss a project.',
  intentLabel = 'Discuss a live problem',
  topicLabel = 'General project fit',
  offerLabel = '',
  name = '',
  workEmail = '',
  company = '',
  role = '',
  timeline = '',
  budgetRange = '',
  problem = '',
  currentEnvironment = '',
  desiredOutcome = '',
  timeSensitivity = '',
  pageUrl = '',
} = {}) {
  const body = encodeURIComponent(
    [
      'Hi Amine,',
      '',
      intro,
      '',
      `Intent: ${intentLabel || 'Discuss a live problem'}`,
      `Topic: ${topicLabel || 'General project fit'}`,
      ...(offerLabel ? [`Offer: ${offerLabel}`] : []),
      `Name: ${name || 'Not provided'}`,
      `Work email: ${workEmail || 'Not provided'}`,
      `Company: ${company || 'Not provided'}`,
      `Role: ${role || 'Not provided'}`,
      `Timeline: ${timeline || 'Not provided'}`,
      `Budget range: ${budgetRange || 'Not provided'}`,
      '',
      'Problem / pressure point:',
      problem || 'Not provided',
      '',
      'Current stack or environment:',
      currentEnvironment || 'Not provided',
      '',
      'Desired outcome for the first phase:',
      desiredOutcome || 'Not provided',
      '',
      'Anything time-sensitive:',
      timeSensitivity || 'Not provided',
      ...(pageUrl ? ['', `Submitted from: ${pageUrl}`] : []),
      '',
    ].join('\n'),
  )

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`
}
