import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {osloBlogTemplate} from './blog-template.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const id = 'news-oslo-consortium-meeting-2026'
for (const documentId of [id, `drafts.${id}`]) {
  if (!await client.getDocument(documentId)) continue
  await client.patch(documentId).setIfMissing({body: osloBlogTemplate}).commit()
}
console.log('Initialized the Oslo article body only where missing; existing article edits were preserved.')
