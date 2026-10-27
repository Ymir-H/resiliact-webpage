import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
const client = getCliClient({apiVersion: '2026-10-05'})
const catalog = JSON.parse(await readFile(new URL('./research-assets.json', import.meta.url), 'utf8'))
const images = new Map()
for (const entry of catalog) {
  const asset = await client.assets.upload('image', await readFile(new URL(`../public${entry.logoPath}`, import.meta.url)), {filename: entry.logoPath.split('/').at(-1)})
  images.set(entry.key, {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: `${entry.name} logo`})
}
for (const id of ['section-project', 'drafts.section-project']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  const fields = {}
  for (const item of doc.projectDetails?.sisterProjects || []) {
    const entry = catalog.find(entry => entry.website === item.website || entry.name.toLowerCase() === item.name?.toLowerCase())
    if (!entry) continue
    const path = `projectDetails.sisterProjects[_key==${JSON.stringify(item._key)}]`
    fields[`${path}.logo`] = images.get(entry.key)
    fields[`${path}.logoSource`] = entry.logoSource
  }
  if (Object.keys(fields).length) await client.patch(id).setIfMissing(fields).commit()
  console.log(`Initialized research community logos in ${id}; existing editor content preserved`)
}
