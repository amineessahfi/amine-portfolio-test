import fs from 'node:fs/promises'
import path from 'node:path'
import { buildAbsoluteUrl, getPageMeta, getSitemapEntries, getStaticHtmlPaths, SITE_URL } from '../src/lib/siteMeta.js'

const distDir = path.resolve(process.cwd(), 'dist')
const rootHtmlPath = path.join(distDir, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;')
}

function replaceMetaTag(html, tagPattern, replacement) {
  return tagPattern.test(html) ? html.replace(tagPattern, replacement) : html
}

function injectSeo(html, pageMeta) {
  const canonicalUrl = buildAbsoluteUrl(pageMeta.canonicalPath || '/')

  return [
    [/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageMeta.title)}</title>`],
    [
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${escapeAttribute(pageMeta.description)}" />`,
    ],
    [
      /<meta\s+property="og:title"[\s\S]*?\/>/i,
      `<meta property="og:title" content="${escapeAttribute(pageMeta.title)}" />`,
    ],
    [
      /<meta\s+property="og:description"[\s\S]*?\/>/i,
      `<meta property="og:description" content="${escapeAttribute(pageMeta.description)}" />`,
    ],
    [
      /<meta\s+property="og:type"[\s\S]*?\/>/i,
      `<meta property="og:type" content="${escapeAttribute(pageMeta.ogType)}" />`,
    ],
    [
      /<meta\s+property="og:site_name"[\s\S]*?\/>/i,
      '<meta property="og:site_name" content="Amine Essahfi" />',
    ],
    [
      /<meta\s+property="og:url"[\s\S]*?\/>/i,
      `<meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    ],
    [
      /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
      `<meta name="twitter:title" content="${escapeAttribute(pageMeta.title)}" />`,
    ],
    [
      /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
      `<meta name="twitter:description" content="${escapeAttribute(pageMeta.description)}" />`,
    ],
    [
      /<meta\s+name="robots"[\s\S]*?\/>/i,
      `<meta name="robots" content="${escapeAttribute(pageMeta.robots)}" />`,
    ],
    [
      /<link\s+rel="canonical"[\s\S]*?>/i,
      `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    ],
  ].reduce((nextHtml, [pattern, replacement]) => replaceMetaTag(nextHtml, pattern, replacement), html)
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`
}

function buildSitemapXml() {
  const urls = getSitemapEntries()
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(buildAbsoluteUrl(entry.path))}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

async function writeStaticHtml(routePath, templateHtml) {
  const html = injectSeo(templateHtml, getPageMeta(routePath))
  const outputPath = routePath === '/' ? rootHtmlPath : path.join(distDir, routePath.slice(1), 'index.html')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, html, 'utf8')
}

async function main() {
  const templateHtml = await fs.readFile(rootHtmlPath, 'utf8')

  for (const routePath of getStaticHtmlPaths()) {
    await writeStaticHtml(routePath, templateHtml)
  }

  await fs.writeFile(path.join(distDir, '404.html'), injectSeo(templateHtml, getPageMeta('/404')), 'utf8')
  await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
