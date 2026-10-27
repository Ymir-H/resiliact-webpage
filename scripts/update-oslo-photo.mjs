import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'

const client = getCliClient({apiVersion: '2026-10-05'})
const source = {id: '2VhYx0B0I98', name: 'Eirik Skarstein / Unsplash', url: 'https://unsplash.com/photos/white-boat-on-body-of-water-near-city-buildings-during-daytime-2VhYx0B0I98'}
const documents = (await Promise.all(['section-hubs', 'drafts.section-hubs'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-hubs')) throw new Error('Published RESILIACT Hubs document not found')
for (const doc of documents) if (!doc.drmihSites?.some(site => site.hubKey === 'oslo' && site._key)) throw new Error(`Oslo entry missing in ${doc._id}`)
const asset = await client.assets.upload('image', await readFile(new URL('../public/assets/oslo-aker-brygge.jpg', import.meta.url)), {filename: 'oslo-aker-brygge-eirik-skarstein.jpg', contentType: 'image/jpeg', source})
const transaction = client.transaction()
for (const doc of documents) {
  const oslo = doc.drmihSites.find(site => site.hubKey === 'oslo')
  transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set({
    [`drmihSites[_key==${JSON.stringify(oslo._key)}].heroImage`]: {
      _type: 'image', asset: {_type: 'reference', _ref: asset._id},
      alt: 'White boat on the waterfront at Aker Brygge in Oslo, with city buildings behind it',
      caption: 'Aker Brygge, Oslo, Norway.', credit: 'Photo: Eirik Skarstein / Unsplash (2VhYx0B0I98)',
    },
  }))
}
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  const oslo = result.drmihSites.find(site => site.hubKey === 'oslo')
  if (oslo.heroImage?.asset?._ref !== asset._id) throw new Error(`Image verification failed in ${doc._id}`)
  console.log(`Verified Oslo featured image in ${doc._id}`)
}
