import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {researchProjects} from './research-projects.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const catalog = JSON.parse(await readFile(new URL('./research-assets.json', import.meta.url), 'utf8'))
const documents = (await Promise.all(['section-project', 'drafts.section-project'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-project')) throw new Error('Published About RESILIACT document not found')
const logos = new Map()
for (const project of researchProjects) {
  const entry = catalog.find(item => item.key === project._key)
  if (!entry) throw new Error(`Missing logo source for ${project.name}`)
  const asset = await client.assets.upload('image', await readFile(new URL(`../public${entry.logoPath}`, import.meta.url)), {filename: entry.logoPath.split('/').at(-1)})
  logos.set(project._key, {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: `${project.name} logo`})
}
const transaction = client.transaction()
for (const doc of documents) {
  const fields = {}
  for (const project of researchProjects) {
    const item = doc.projectDetails?.sisterProjects?.find(item => item._key === project._key)
    if (!item) throw new Error(`Missing card ${project.name} in ${doc._id}`)
    const entry = catalog.find(entry => entry.key === project._key)
    const path = `projectDetails.sisterProjects[_key==${JSON.stringify(item._key)}]`
    fields[`${path}.description`] = project.description
    fields[`${path}.logo`] = logos.get(project._key)
    fields[`${path}.logoSource`] = entry.logoSource
  }
  transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields))
}
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  for (const project of researchProjects) {
    const item = result.projectDetails.sisterProjects.find(item => item._key === project._key)
    if (item?.description !== project.description || item?.logo?.asset?._ref !== logos.get(project._key).asset._ref) throw new Error(`Verification failed: ${project.name}`)
  }
  console.log(`Verified all 12 project logos and summaries in ${doc._id}`)
}
