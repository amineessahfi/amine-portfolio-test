const baseEmailAddress = 'amine.essahfi@gmail.com'

export const GITHUB_URL = 'https://github.com/amineessahfi'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/amine-essahfi-834a59126'
export const EMAIL_URL = `mailto:${baseEmailAddress}`
export const RESUME_REQUEST_URL =
  `${EMAIL_URL}?subject=Resume%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20see%20your%20resume.`
export const AUDIT_REQUEST_URL =
  `${EMAIL_URL}?subject=AWS%20audit%20request&body=Hi%20Amine%2C%20I%27d%20like%20to%20discuss%20an%20AWS%20cost%20and%20platform%20audit.`

export function createDiscussEmailUrl(subject = 'Project conversation') {
  const body = encodeURIComponent(
    `Hi Amine,

I would like to discuss a project.

Context:
- Problem to solve:
- Current stack:
- Desired outcome:
- Anything time-sensitive:
`,
  )

  return `${EMAIL_URL}?subject=${encodeURIComponent(subject)}&body=${body}`
}
