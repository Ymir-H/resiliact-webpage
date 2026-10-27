import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {exampleDocuments} from './example-content.mjs'
import {sectionDocuments} from './section-content.mjs'
import {projectDetails} from './project-content.mjs'
import {replicationDefaults} from './replication-content.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
let transaction = client.transaction()
for (const document of [...exampleDocuments, ...sectionDocuments]) transaction = transaction.createIfNotExists(document)
await transaction.commit()
const pages = await client.fetch('*[_id in $ids]', {ids: sectionDocuments.filter(doc => !['homePage', 'projectPage'].includes(doc._type)).map(doc => doc._id)})
let summaries = client.transaction()
for (const doc of pages) summaries = summaries.patch(doc._id, {setIfMissing: {
  homeSummary: doc.lead || doc.intro || 'Follow the latest project news, events and milestones from the RESILIACT partnership.',
}})
await summaries.commit()
const newsDefaults = sectionDocuments.find(doc => doc._id === 'section-news')
await client.patch('section-news').setIfMissing(Object.fromEntries(
  ['pageHeading', 'eventsHeading', 'calendarButtonLabel', 'newsHeading', 'blogHeading'].map(key => [key, newsDefaults[key]])
)).commit()
const [home, project] = await Promise.all([client.getDocument('section-home'), client.getDocument('section-project')])
let projectSetup = client.transaction().patch('section-project', {setIfMissing: {projectDetails}, unset: ['eyebrow', 'heading', 'lead', 'paragraphs', 'principles', 'homeSummary']})
if (!home.projectOverview) {
  const projectOverview = Object.fromEntries(['eyebrow', 'heading', 'lead', 'paragraphs', 'principles', 'pageBody', 'pageAttachments'].filter(key => project[key] !== undefined).map(key => [key, project[key]]))
  projectSetup = projectSetup.patch('section-home', {setIfMissing: {projectOverview}}).patch('section-project', {unset: ['pageBody', 'pageAttachments']})
}
await projectSetup.commit()
const hubs = await client.getDocument('section-hubs')
let replicationSetup = client.transaction().patch('section-hubs', {set: {
  navigationLabel: 'RESILIACT Hubs', eyebrow: 'RESILIACT HUBS',
  ...(hubs.listHeading === 'Explore our five Nordic hubs' ? {listHeading: 'Explore our RESILIACT Hubs'} : {}),
}})
for (const site of hubs.replicationSites || []) {
  const fallback = replicationDefaults.find(item => item._key === site._key || item.siteKey === site.siteKey || item.country === site.country)
  if (!fallback) continue
  const path = `replicationSites[_key==${JSON.stringify(site._key)}]`
  const missing = Object.fromEntries(['siteKey', 'summary', 'localAuthority', 'livingLabApproach'].map(field => [`${path}.${field}`, fallback[field]]))
  const rename = /^canvey island$/i.test(site.title || '') ? {[`${path}.title`]: 'Essex'} : {}
  replicationSetup = replicationSetup.patch('section-hubs', {setIfMissing: missing, set: rename})
}
await replicationSetup.commit()
await import('./initialize-hub-content.mjs')
console.log('Imported Home, the seven navigation sections, five example hubs and existing Oslo article. Existing records were preserved.')
