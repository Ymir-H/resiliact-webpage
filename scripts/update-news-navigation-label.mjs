import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'

const client = getCliClient({apiVersion: '2026-10-05'})
for (const id of ['section-news', 'drafts.section-news']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  await client.patch(id).ifRevisionId(doc._rev).set({navigationLabel: 'News & Events'}).commit()
  const result = await client.getDocument(id)
  if (result.navigationLabel !== 'News & Events') throw new Error(`Label verification failed: ${id}`)
  console.log(`Verified News & Events navigation label in ${id}`)
}
