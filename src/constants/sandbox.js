const defaultSandboxApiBase = 'https://vm2.amineessahfi.xyz/sandbox-api'

export const SANDBOX_API_BASE = (import.meta.env.VITE_SANDBOX_API_BASE || defaultSandboxApiBase).replace(/\/$/, '')
