import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
const client = getCliClient({apiVersion:'2026-10-05'})
for (const [key, fields] of [
  ['project',{navigationLabel:'About RESILIACT'}],
  ['hubs',{navigationLabel:'RESILIACT Hubs',eyebrow:'RESILIACT HUBS',listHeading:'Explore our RESILIACT Hubs'}],
]) {
  for (const id of [`section-${key}`,`drafts.section-${key}`]) {
    const doc = await client.getDocument(id)
    if (!doc) continue
    await client.patch(id).ifRevisionId(doc._rev).set(fields).commit()
    console.log(`Updated labels in ${id}`)
  }
}
