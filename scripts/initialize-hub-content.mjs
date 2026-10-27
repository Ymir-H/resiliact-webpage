import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {mergeHubLists} from './merge-hub-content.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const records = await client.withConfig({perspective: 'raw'}).fetch('*[_type == "innovationHub" && !(_id in path("versions.**"))] | order(_updatedAt asc)')
const page = await client.getDocument('section-hubs')
if (!page) throw new Error('Missing section-hubs; initialize the project content first.')
let draft = await client.getDocument('drafts.section-hubs')
// Keep unpublished individual-hub work in a draft of the merged editor.
if (!draft && records.some(record => record._id.startsWith('drafts.'))) {
  const fields = Object.fromEntries(Object.entries(page).filter(([key]) => !key.startsWith('_') || key === '_type'))
  draft = await client.createIfNotExists({...fields, _id: 'drafts.section-hubs'})
}
for (const document of [page, draft].filter(Boolean)) {
  await client.patch(document._id).ifRevisionId(document._rev)
    .set(mergeHubLists(document, records, document._id.startsWith('drafts.'))).commit()
}
console.log('Merged hub summaries, full content, media and downloads into the two RESILIACT Hubs lists. Legacy records were retained; unpublished work remains in the page draft.')
