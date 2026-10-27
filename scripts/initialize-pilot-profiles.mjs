import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {getPilotProfile} from './pilot-profile.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-hubs', 'drafts.section-hubs'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-hubs')) throw new Error('Published RESILIACT Hubs document not found')
const transaction = client.transaction()
let count = 0
for (const doc of documents) {
  const fields = {}
  for (const list of ['drmihSites', 'replicationSites']) for (const site of doc[list] || []) {
    if (!site._key) throw new Error(`Missing site key in ${doc._id}.${list}`)
    const profile = getPilotProfile({...site, hubKey: site.hubKey || site.siteKey})
    const existing = site.siteOverview || {}
    const missing = Object.fromEntries(['aim', 'why', 'how', 'hazards', 'stakeholders'].filter(key => existing[key] == null).map(key => [key, profile[key]]))
    if (!Object.keys(missing).length) continue
    fields[`${list}[_key==${JSON.stringify(site._key)}].siteOverview`] = {_type: 'siteOverview', ...existing, ...missing}
    count++
  }
  if (Object.keys(fields).length) transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields))
}
if (count) await transaction.commit()
console.log(`Initialized ${count} site profiles; existing profile fields and all other site content preserved`)
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  for (const site of [...result.drmihSites || [], ...result.replicationSites || []]) {
    if (!site.siteOverview) throw new Error(`Missing profile for ${site.title}`)
    console.log(`${doc._id}: ${site.hubKey || site.siteKey}: ${site.siteOverview.hazards?.length || 0} hazard icons, ${site.siteOverview.stakeholders?.length || 0} stakeholder icons`)
  }
}
