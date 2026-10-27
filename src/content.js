import {createClient} from '@sanity/client'

const env = import.meta.env || {}
export const isConfigured = /^[a-z0-9]+$/.test(env.VITE_SANITY_PROJECT_ID || '')
export const contentQuery = `{
  "sections": *[_id in ["section-home", "section-project", "section-platform", "section-hubs", "section-outcomes", "section-consortium", "section-news", "section-contact"]] {..., "drmihSites": drmihSites[]{..., "imageUrl": heroImage.asset->url, "attachments": attachments[]{..., "url": asset->url}, "gallery": gallery[]{..., "url": asset->url}}, "replicationSites": replicationSites[]{..., "imageUrl": heroImage.asset->url, "attachments": attachments[]{..., "url": asset->url}, "gallery": gallery[]{..., "url": asset->url}}, "projectDetails": projectDetails{..., "sisterProjects": sisterProjects[]{..., "logoUrl": logo.asset->url}}, "heroGallery": heroGallery[]{..., "mediaUrl": select(mediaType == "video" => video.asset->url, image.asset->url), "posterUrl": poster.asset->url}, "imageUrl": heroImage.asset->url, "projectFigureUrl": projectDetails.figure.asset->url, "coordinatorLogoUrl": coordinatorLogo.asset->url, "teamPhotoUrl": teamPhoto.asset->url, "partners": partners[]{..., "logoUrl": logo.asset->url}, "pageAttachments": pageAttachments[]{..., "url": asset->url}, "projectOverview": projectOverview {..., "pageAttachments": pageAttachments[]{..., "url": asset->url}}},
  "news": *[_type == "news" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ..., "slug": slug.current, "imageUrl": heroImage.asset->url,
    "attachments": attachments[]{..., "url": asset->url}
  },
  "outcomes": *[_type == "outcome" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ..., "slug": slug.current, "imageUrl": heroImage.asset->url,
    "attachments": attachments[]{..., "url": asset->url}
  },
  "events": *[_type == "projectEvent" && !(_id in path("drafts.**"))] | order(startsAt asc) {
    ..., "slug": slug.current, "imageUrl": heroImage.asset->url, "attachments": attachments[]{..., "url": asset->url}
  },
  "hubs": *[_type == "innovationHub" && !(_id in path("drafts.**"))] | order(_updatedAt asc) {
    ..., "slug": slug.current, "imageUrl": heroImage.asset->url,
    "attachments": attachments[]{..., "url": asset->url},
    "gallery": gallery[]{..., "url": asset->url}
  }
}`
export function safeUrl(value) {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : undefined
  } catch { return undefined }
}
export function publishedRecords(records) {
  return (Array.isArray(records) ? records : []).filter(record =>
    record && typeof record._id === 'string' && !record._id.startsWith('drafts.') && !record._id.startsWith('versions.'))
}
export async function fetchContent() {
  if (!isConfigured) return null
  const client = createClient({
    projectId: env.VITE_SANITY_PROJECT_ID,
    dataset: env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2026-10-05',
    perspective: 'published',
    // Fetch published edits directly so a stale query cache cannot replace
    // the local gallery with an older, shorter collection during startup.
    useCdn: false,
  })
  const data = await client.fetch(contentQuery, {}, {signal: AbortSignal.timeout(15000), cache: 'no-store'})
  return {news: publishedRecords(data.news), events: publishedRecords(data.events), outcomes: publishedRecords(data.outcomes), hubs: publishedRecords(data.hubs), sections: publishedRecords(data.sections)}
}
