import {
  DEFAULT_LEAD_INBOX,
  createLeadSubmissionEmailUrl,
} from '../src/constants/links.js'
import {
  discussOfferPresets,
  discussIntentPresets,
  getDiscussTopicPreset,
  normalizeDiscussOffer,
  normalizeDiscussIntent,
  normalizeDiscussTopic,
  responsePromise,
} from '../src/data/discussTopics.js'

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload)
}

function sanitizeField(value, maxLength = 2000) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.replace(/\r\n/g, '\n').trim().slice(0, maxLength)
}

function parseRequestBody(body) {
  if (!body) {
    return {}
  }

  if (typeof body === 'string') {
    return JSON.parse(body)
  }

  return body
}

function normalizeLeadPayload(body = {}) {
  const intent = normalizeDiscussIntent(sanitizeField(body.intent, 40))
  const intentPreset = discussIntentPresets[intent]
  const topic = normalizeDiscussTopic(sanitizeField(body.topic, 120))
  const preset = getDiscussTopicPreset(topic)
  const offer =
    intent === 'scope' && topic === 'cloud-fit-deployment'
      ? normalizeDiscussOffer(sanitizeField(body.offer, 40) || 'review')
      : 'general'
  const offerPreset = discussOfferPresets[offer]
  const scopedSubject = offer !== 'general' ? `${preset.emailSubject} — ${offerPreset.optionLabel}` : preset.emailSubject

  return {
    intent,
    intentLabel: intentPreset.optionLabel,
    topic,
    topicLabel: preset.optionLabel,
    offer,
    offerLabel: offerPreset.optionLabel,
    subject: intent === 'explore' ? `${preset.emailSubject} exploratory note` : scopedSubject,
    intro:
      intent === 'explore'
        ? `I would like to pressure-test whether the ${preset.optionLabel.toLowerCase()} proof path is the right starting point.`
        : offer !== 'general' && topic === 'cloud-fit-deployment'
          ? offerPreset.emailIntro
          : preset.emailIntro,
    name: sanitizeField(body.name, 120),
    workEmail: sanitizeField(body.workEmail, 160).toLowerCase(),
    company: sanitizeField(body.company, 160),
    role: sanitizeField(body.role, 120),
    timeline: sanitizeField(body.timeline, 80),
    budgetRange: sanitizeField(body.budgetRange, 80),
    problem: sanitizeField(body.problem, 3000),
    currentEnvironment: sanitizeField(body.currentEnvironment, 3000),
    desiredOutcome: sanitizeField(body.desiredOutcome, 3000),
    timeSensitivity: sanitizeField(body.timeSensitivity, 1200),
    website: sanitizeField(body.website, 240),
    pageUrl: sanitizeField(body.pageUrl, 500),
  }
}

function validateLeadPayload(lead) {
  const errors = {}
  const requiredFields = new Set(discussIntentPresets[lead.intent]?.requiredFields || discussIntentPresets.scope.requiredFields)

  if (requiredFields.has('name') && !lead.name) {
    errors.name = 'Name is required.'
  }

  if (requiredFields.has('workEmail') && !lead.workEmail) {
    errors.workEmail = 'Work email is required.'
  } else if (lead.workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.workEmail)) {
    errors.workEmail = 'Enter a valid email address.'
  }

  if (requiredFields.has('company') && !lead.company) {
    errors.company = 'Company is required.'
  }

  if (requiredFields.has('role') && !lead.role) {
    errors.role = 'Role is required.'
  }

  if (requiredFields.has('timeline') && !lead.timeline) {
    errors.timeline = 'Timeline is required.'
  }

  if (requiredFields.has('budgetRange') && !lead.budgetRange) {
    errors.budgetRange = 'Budget range is required.'
  }

  if (requiredFields.has('problem') && !lead.problem) {
    errors.problem = 'Problem / pressure point is required.'
  }

  if (requiredFields.has('currentEnvironment') && !lead.currentEnvironment) {
    errors.currentEnvironment = 'Current stack or environment is required.'
  }

  if (requiredFields.has('desiredOutcome') && !lead.desiredOutcome) {
    errors.desiredOutcome = 'Desired outcome is required.'
  }

  return errors
}

function formatLeadEmailText(lead) {
  return [
    `New portfolio lead: ${lead.topicLabel}`,
    '',
    `Intent: ${lead.intentLabel}`,
    ...(lead.offer !== 'general' ? [`Offer: ${lead.offerLabel}`] : []),
    `Name: ${lead.name || 'Not provided'}`,
    `Work email: ${lead.workEmail}`,
    `Company: ${lead.company || 'Not provided'}`,
    `Role: ${lead.role || 'Not provided'}`,
    `Timeline: ${lead.timeline || 'Not provided'}`,
    `Budget range: ${lead.budgetRange || 'Not provided'}`,
    ...(lead.pageUrl ? [`Source page: ${lead.pageUrl}`] : []),
    '',
    'Problem / pressure point:',
    lead.problem,
    '',
    'Current stack or environment:',
    lead.currentEnvironment || 'Not provided',
    '',
    'Desired outcome for the first phase:',
    lead.desiredOutcome || 'Not provided',
    '',
    'Anything time-sensitive:',
    lead.timeSensitivity || 'Not provided',
  ].join('\n')
}

function formatLeadEmailHtml(lead) {
  const escape = (value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const blocks = [
    ['Problem / pressure point', lead.problem],
    ['Current stack or environment', lead.currentEnvironment],
    ['Desired outcome for the first phase', lead.desiredOutcome],
    ['Anything time-sensitive', lead.timeSensitivity || 'Not provided'],
  ]

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">New portfolio lead: ${escape(lead.topicLabel)}</h2>
      <p style="margin: 0 0 16px;">Reply promise shown on the site: ${escape(responsePromise)}</p>
      <table style="border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Intent</strong></td><td>${escape(lead.intentLabel)}</td></tr>
        ${
          lead.offer !== 'general'
            ? `<tr><td style="padding: 4px 12px 4px 0;"><strong>Offer</strong></td><td>${escape(lead.offerLabel)}</td></tr>`
            : ''
        }
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Name</strong></td><td>${escape(lead.name || 'Not provided')}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Work email</strong></td><td>${escape(lead.workEmail)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Company</strong></td><td>${escape(lead.company || 'Not provided')}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Role</strong></td><td>${escape(lead.role || 'Not provided')}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Timeline</strong></td><td>${escape(lead.timeline || 'Not provided')}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Budget range</strong></td><td>${escape(lead.budgetRange || 'Not provided')}</td></tr>
        ${
          lead.pageUrl
            ? `<tr><td style="padding: 4px 12px 4px 0;"><strong>Source page</strong></td><td>${escape(lead.pageUrl)}</td></tr>`
            : ''
        }
      </table>
      ${blocks
        .map(
          ([label, value]) => `
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 6px;"><strong>${escape(label)}</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${escape(value)}</p>
            </div>
          `,
        )
        .join('')}
    </div>
  `
}

async function sendLeadEmail(lead, recipient) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return {
      mode: 'mailto',
        mailtoUrl: createLeadSubmissionEmailUrl({
          recipient,
          subject: lead.subject,
          intro: lead.intro,
          intentLabel: lead.intentLabel,
          topicLabel: lead.topicLabel,
          offerLabel: lead.offer !== 'general' ? lead.offerLabel : '',
          name: lead.name,
          workEmail: lead.workEmail,
        company: lead.company,
        role: lead.role,
        timeline: lead.timeline,
        budgetRange: lead.budgetRange,
        problem: lead.problem,
        currentEnvironment: lead.currentEnvironment,
        desiredOutcome: lead.desiredOutcome,
        timeSensitivity: lead.timeSensitivity,
        pageUrl: lead.pageUrl,
      }),
    }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || 'Portfolio Leads <onboarding@resend.dev>',
      to: [recipient],
      reply_to: lead.workEmail,
      subject: lead.company ? `${lead.subject} — ${lead.company}` : lead.subject,
      text: formatLeadEmailText(lead),
      html: formatLeadEmailHtml(lead),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Email delivery failed.')
  }

  return {
    mode: 'direct',
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, {
      ok: true,
      configured: Boolean(process.env.RESEND_API_KEY),
      responsePromise,
    })
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {
      ok: false,
      error: 'Method not allowed.',
    })
    return
  }

  let rawBody

  try {
    rawBody = parseRequestBody(req.body)
  } catch {
    sendJson(res, 400, {
      ok: false,
      error: 'Invalid request body.',
    })
    return
  }

  const lead = normalizeLeadPayload(rawBody)

  if (lead.website) {
    sendJson(res, 200, {
      ok: true,
      mode: 'ignored',
      message: 'Thanks.',
    })
    return
  }

  const errors = validateLeadPayload(lead)

  if (Object.keys(errors).length > 0) {
    sendJson(res, 422, {
      ok: false,
      error: 'Please complete the missing fields.',
      fieldErrors: errors,
    })
    return
  }

  const recipient = process.env.LEADS_INBOX || DEFAULT_LEAD_INBOX

  try {
    const delivery = await sendLeadEmail(lead, recipient)

    if (delivery.mode === 'mailto') {
      sendJson(res, 200, {
        ok: true,
        mode: 'mailto',
        mailtoUrl: delivery.mailtoUrl,
        message: 'Direct delivery is still being configured. Your mail client can send the same guided intake right now.',
      })
      return
    }

    sendJson(res, 200, {
      ok: true,
      mode: 'direct',
      message: responsePromise,
    })
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      error: 'Lead delivery failed. Use the email fallback below for the same guided intake.',
      mailtoUrl: createLeadSubmissionEmailUrl({
        recipient,
        subject: lead.subject,
        intro: lead.intro,
        intentLabel: lead.intentLabel,
        topicLabel: lead.topicLabel,
        offerLabel: lead.offer !== 'general' ? lead.offerLabel : '',
        name: lead.name,
        workEmail: lead.workEmail,
        company: lead.company,
        role: lead.role,
        timeline: lead.timeline,
        budgetRange: lead.budgetRange,
        problem: lead.problem,
        currentEnvironment: lead.currentEnvironment,
        desiredOutcome: lead.desiredOutcome,
        timeSensitivity: lead.timeSensitivity,
        pageUrl: lead.pageUrl,
      }),
        details: error instanceof Error ? error.message : undefined,
    })
  }
}
