import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {researchProjects} from './research-projects.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-project', 'drafts.section-project'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-project')) throw new Error('Published About RESILIACT document not found')
const identity = value => value?.trim().toLowerCase()
const websiteIdentity = value => value ? new URL(value).hostname.replace(/^www\./, '').toLowerCase() : ''
const matches = (item, project) => item._key === project._key || identity(item.name) === identity(project.name) || websiteIdentity(item.website) === websiteIdentity(project.website)
const transaction = client.transaction()
for (const doc of documents) {
  const existing = doc.projectDetails?.sisterProjects || []
  const additions = researchProjects.filter(project => !existing.some(item => matches(item, project)))
  if (!additions.length) continue
  transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev)
    .setIfMissing({projectDetails: {}, 'projectDetails.sisterProjects': []})
    .append('projectDetails.sisterProjects', additions))
  console.log(`Adding ${additions.length} research project cards to ${doc._id}`)
}
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  for (const project of researchProjects) {
    if (!result.projectDetails?.sisterProjects?.some(item => matches(item, project))) throw new Error(`Missing ${project.name} in ${doc._id}`)
  }
  console.log(`Verified all 12 requested research project cards in ${doc._id}`)
}
