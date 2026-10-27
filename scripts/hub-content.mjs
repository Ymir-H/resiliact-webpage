import {exampleDocuments} from './example-content.mjs'

export const hubKeys = ['oslo', 'reykjavik', 'stockholm', 'copenhagen', 'helsinki']
export const drmiDefaults = exampleDocuments.filter(item => item._type === 'innovationHub').map(item => ({
  _key: item.hubKey,
  ...Object.fromEntries(['hubKey', 'title', 'country', 'summary', 'localAuthority', 'livingLabApproach'].map(field => [field, item[field]])),
}))

// Embedded list entries own both the map details and the full story.
// Legacy records are a fallback until existing content has been migrated.
export function hubRecord(records, summaries, key) {
  const record = records.findLast(item => item.hubKey === key)
  const summary = summaries?.find(item => item.hubKey === key)
  if (!record && !summary) return undefined
  const merged = {...(summary?.contentMerged ? {} : record), ...summary}
  if (!summary?.contentMerged && record) {
    if (!summary?.heroImage) merged.imageUrl = record.imageUrl
    if (summary?.attachments == null) merged.attachments = record.attachments
    if (summary?.gallery == null) merged.gallery = record.gallery
  }
  return {...merged, _id: record?._id || `embedded-${key}`, hubKey: key,
    slug: merged.slug?.current || merged.slug || key}
}

export function hubContentRecords(records, overview) {
  const summaries = [...(overview.drmihSites || []), ...(overview.replicationSites || []).map(site => ({...site, hubKey: site.siteKey}))]
  const keys = new Set([...records.map(item => item.hubKey), ...summaries.map(item => item.hubKey)])
  return [...keys].map(key => hubRecord(records, summaries, key)).filter(Boolean)
}
