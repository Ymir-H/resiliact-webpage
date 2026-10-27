import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
const client = getCliClient({apiVersion:'2026-10-05'})
const asset = await client.assets.upload('image', await readFile(new URL('../public/assets/partners/norsar-transparent.svg',import.meta.url)), {filename:'norsar-transparent.svg',contentType:'image/svg+xml',source:{id:'Norsar_logo.svg',name:'Wikipedia / Wikimedia Commons',url:'https://no.wikipedia.org/wiki/Fil:Norsar_logo.svg'}})
for (const id of ['section-consortium','drafts.section-consortium']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  await client.patch(id).ifRevisionId(doc._rev).set({coordinatorLogo:{...doc.coordinatorLogo,_type:'image',asset:{_type:'reference',_ref:asset._id},alt:doc.coordinatorLogo?.alt || 'NORSAR logo'}}).commit()
  console.log(`Updated transparent coordinator logo in ${id}`)
}
