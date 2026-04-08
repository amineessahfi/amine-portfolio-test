const baseEmailAddress = 'amine.essahfi@gmail.com'
const defaultDiscussPrompts = [
  'Problem / pressure point:',
  'Current stack or environment:',
  'What good looks like in the first phase:',
  'Anything time-sensitive:',
]

export const GITHUB_URL = 'https://github.com/amineessahfi'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/amine-essahfi-834a59126'
export const EMAIL_URL = `mailto:${baseEmailAddress}`
export const RESUME_REQUEST_URL =
  `${EMAIL_URL}?subject=Resume%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20see%20your%20resume.`
export const AUDIT_REQUEST_URL =
  `${EMAIL_URL}?subject=AWS%20audit%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20discuss%20an%20AWS%20cost%20and%20platform%20audit.`

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
