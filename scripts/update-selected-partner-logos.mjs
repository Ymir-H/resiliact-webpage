import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const client = getCliClient({apiVersion: '2026-10-05'})
const catalog = JSON.parse(await readFile(new URL('./partner-assets.json', import.meta.url), 'utf8'))
const selected = catalog.filter(item => ['lisbon', 'eena', 'tvs'].includes(item.partnerKey))
const images = new Map()
for (const item of selected) {
  const path = fileURLToPath(new URL(`../public${item.logoPath}`, import.meta.url))
  const asset = await client.assets.upload('image', await readFile(path), {filename: item.logoPath.split('/').at(-1)})
  images.set(item.name, {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: `${item.name} logo`})
}
for (const id of ['section-consortium', 'drafts.section-consortium']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  const fields = {}
  for (const item of selected) {
    const partner = doc.partners?.find(partner => partner.name === item.name)
    if (!partner) throw new Error(`Missing partner: ${item.name}`)
    const path = `partners[_key==${JSON.stringify(partner._key)}]`
    fields[`${path}.logo`] = images.get(item.name)
    fields[`${path}.logoBackground`] = item.logoBackground
    fields[`${path}.logoSource`] = item.logoSource
  }
  await client.patch(id).ifRevisionId(doc._rev).set(fields).commit()
  console.log(`Updated Lisbon, EENA and Technovative logos in ${id}`)
}
