const defaultSandboxApiBase = 'https://vm2.amineessahfi.xyz/sandbox-api'
const defaultWorkflowStudioUrl = `${new URL(defaultSandboxApiBase).origin}/workflow-studio/`

export const SANDBOX_API_BASE = (import.meta.env.VITE_SANDBOX_API_BASE || defaultSandboxApiBase).replace(/\/$/, '')
export const WORKFLOW_STUDIO_URL = (import.meta.env.VITE_WORKFLOW_STUDIO_URL || defaultWorkflowStudioUrl).replace(/\/?$/, '/')
