import {hubRecord} from '../scripts/hub-content.mjs'
import {replicationRecords} from '../scripts/replication-content.mjs'

export const pilotPath = item => `/innovation-hubs/${encodeURIComponent(item.slug?.current || item.slug || item.hubKey)}/`
export function pilotRoute(pathname) {
  const match = /^\/innovation-hubs\/([^/]+)$/.exec(pathname.replace(/\/index\.html$/, '').replace(/\/+$/, ''))
  if (!match) return null
  try {return {slug: decodeURIComponent(match[1])}} catch {return {slug: null}}
}
export function pilotGroups(content, overview) {
  const hubs = content.hubs || []
  const nordic = overview.drmihSites || []
  const replicas = replicationRecords(overview.replicationSites)
  return [
    {id: 'drmih', title: 'Nordic innovation hubs', label: 'DRMIH', description: 'Disaster Risk Management Innovation Hubs in five Nordic capitals. Explore the local priorities, partners and activities.', items: nordic.map(site => ({...hubRecord(hubs, nordic, site.hubKey), pilotType: 'drmih'}))},
    {id: 'replication', title: 'Replication sites', label: 'RS', description: 'Six regions exploring how RESILIACT solutions can transfer to different local and institutional contexts.', items: replicas.map(site => ({...hubRecord(hubs, [{...site, hubKey: site.siteKey}], site.siteKey), pilotType: 'replication'}))},
  ]
}
