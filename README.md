# Platform Engineering Portfolio

Modern portfolio website for Amine Essahfi, Platform Engineer specializing in Data Infrastructure, AWS, Kubernetes, and Edge Computing.

## Features

- **Interactive Terminal Demo** - Typewriter effect showcasing expertise
- **AWS Cost Calculator** - Interactive savings estimator with charts
- **Platform Engineering Focus** - Highlights DataOps + Telco specialization
- **Responsive Design** - Mobile-first, dark theme
- **Modern Stack** - React, Vite, Tailwind CSS, Chart.js

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Charts:** Chart.js
- **Icons:** React Icons
- **Deployment:** Vercel

## Development

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Automatically deployed by Vercel from the repository's default branch.

## Routes

- `/`
- `/services`
- `/services/:serviceSlug`

## Contact flows

The current contact, resume, and audit CTAs use `mailto:` links, so no backend is required for those flows.

## Live sandbox

The live terminal sandbox UI is hosted in the Vercel frontend, while the backend is intended to run separately on `essahfi_instance` behind `https://vm2.amineessahfi.xyz/sandbox-api`.

## AWS demo control plane

The sandbox backend also includes a token-protected AWS demo control plane for spinning up short-lived demo stacks from repo-stored YAML specs.

- specs live under `sandbox-backend/demo-specs/`
- run state is stored in SQLite on the host
- the first enabled template provisions S3, SQS, Lambda, EventBridge, Glue, and Athena validation
- docs: [`docs/aws-demo-control-plane.md`](docs/aws-demo-control-plane.md)

## License

MIT
