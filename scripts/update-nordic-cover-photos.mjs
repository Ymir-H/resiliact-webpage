import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'

const photos = [
  {key: 'reykjavik', id: 'geYUKmAKZp0', slug: 'aerial-view-of-city-buildings-during-daytime', author: 'Einar H. Reynis', alt: 'Aerial view of Reykjavík, Iceland, with colourful city buildings and the waterfront', caption: 'Reykjavík, Iceland.'},
  {key: 'stockholm', id: 'SvwMa5Mwzoc', slug: 'a-body-of-water-with-buildings-around-it', author: 'Anastasiya D', alt: 'Stockholm waterfront and city buildings beside the water in Sweden', caption: 'Stockholm, Sweden.'},
  {key: 'copenhagen', id: 'qYB1OOh-iGw', slug: 'lake-between-city-under-blue-sky-during-daytime', author: 'Lindsay Martin', alt: 'Aerial view of Copenhagen with waterways and city buildings beneath a blue sky', caption: 'Copenhagen, Denmark.'},
  {key: 'helsinki', id: 'bpDJvls-h-0', slug: 'helsinki-cathedral-above-waterfront-in-helsinki', author: 'Tapio Haaja', alt: 'Helsinki Cathedral rising above waterfront buildings in Helsinki, Finland', caption: 'Helsinki Cathedral and waterfront, Finland.'},
]
const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-hubs', 'drafts.section-hubs'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-hubs')) throw new Error('Published RESILIACT Hubs document not found')
for (const doc of documents) for (const photo of photos) {
  if (!doc.drmihSites?.some(site => site.hubKey === photo.key && site._key)) throw new Error(`${photo.key} entry missing in ${doc._id}`)
}
const assets = new Map()
for (const photo of photos) {
  const source = {id: photo.id, name: `${photo.author} / Unsplash`, url: `https://unsplash.com/photos/${photo.slug}-${photo.id}`}
  const asset = await client.assets.upload('image', await readFile(new URL(`../public/assets/${photo.key}-cover.jpg`, import.meta.url)), {filename: `${photo.key}-cover-unsplash-${photo.id}.jpg`, contentType: 'image/jpeg', source})
  assets.set(photo.key, asset._id)
}
const transaction = client.transaction()
for (const doc of documents) {
  const fields = {}
  for (const photo of photos) {
    const site = doc.drmihSites.find(item => item.hubKey === photo.key)
    fields[`drmihSites[_key==${JSON.stringify(site._key)}].heroImage`] = {
      _type: 'image', asset: {_type: 'reference', _ref: assets.get(photo.key)},
      alt: photo.alt, caption: photo.caption, credit: `Photo: ${photo.author} / Unsplash (${photo.id})`,
    }
  }
  transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields))
}
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  for (const photo of photos) {
    const site = result.drmihSites.find(item => item.hubKey === photo.key)
    if (site.heroImage?.asset?._ref !== assets.get(photo.key)) throw new Error(`Image verification failed for ${photo.key} in ${doc._id}`)
    console.log(`Verified ${photo.key} cover photo in ${doc._id}`)
  }
}
