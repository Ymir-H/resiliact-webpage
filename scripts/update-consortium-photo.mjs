import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'

const client = getCliClient({apiVersion: '2026-10-05'})
const asset = await client.assets.upload('image', await readFile(new URL('../public/assets/resiliact-team-web.jpg', import.meta.url)), {filename: 'resiliact-team.jpg', contentType: 'image/jpeg'})
for (const id of ['section-consortium', 'drafts.section-consortium']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  const attica = doc.partners?.find(partner => partner.name === 'Region of Attica')
  if (!attica) throw new Error('Attica partner missing')
  await client.patch(id).ifRevisionId(doc._rev).set({
    [`partners[_key==${JSON.stringify(attica._key)}].website`]: 'https://athensattica.com/highlights/municipalities/',
    teamPhoto: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: 'RESILIACT consortium group photo at Oslo City Hall', caption: 'RESILIACT partners at the first in-person consortium meeting, Oslo City Hall, September 2026.'},
  }).commit()
  console.log(`Updated Attica link and team photo in ${id}`)
}
