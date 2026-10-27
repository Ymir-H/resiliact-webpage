import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'

const photos = [
  {key: 'brussels', id: 'TUthZjfR3Ps', slug: 'photography-of-buildings-during-daytime', author: 'François Genon', alt: 'Historic buildings in Brussels, Belgium, photographed during daytime', caption: 'Brussels, Belgium.'},
  {key: 'attica', id: 'KmdxChGx8Eo', slug: 'city-with-high-rise-buildings-under-blue-sky-during-daytime', author: 'Datingscout', alt: 'City buildings in Athens, Attica, beneath a blue sky', caption: 'Athens, Attica, Greece.'},
  {key: 'bratislava', id: 'yuYEWwROH5U', slug: 'view-of-a-city-with-church-and-river', author: 'Sky', alt: 'View across Bratislava with a church and the Danube River', caption: 'Bratislava, Slovakia.'},
  {key: 'algiers', id: 'RCsOlTBX5Tw', slug: 'a-view-of-a-city-with-a-body-of-water-in-the-distance', author: 'Sid Ahmed SAOUD', alt: 'View of Algiers city buildings with the sea in the distance', caption: 'Algiers, Algeria.'},
  {key: 'lisbon', id: 'Dq3cr3sQ_c0', slug: 'a-city-with-many-buildings', author: 'Jeroen den Otter', alt: 'Lisbon cityscape with densely arranged buildings and rooftops', caption: 'Lisbon, Portugal.'},
  {key: 'essex', source: {id: 'Spring_EE River Harlow_Web.jpg', name: 'Essex County Council', url: 'https://www.essex.gov.uk/sites/default/files/styles/small_21_9/public/2023-05/Spring_EE%20River%20Harlow_Web.jpg?itok=60IqsRv9'}, alt: 'An aerial view of a river in Harlow. There are several barges stationary in the river. On each side of the river there are fields and trees, and footpaths which follow the river. On one side of the river there is a car park with several cars parked.', caption: 'River in Harlow, Essex, United Kingdom.', credit: 'Image source: Essex County Council.'},
]
const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-hubs', 'drafts.section-hubs'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-hubs')) throw new Error('Published RESILIACT Hubs document not found')
for (const doc of documents) for (const photo of photos) {
  if (!doc.replicationSites?.some(site => site.siteKey === photo.key && site._key)) throw new Error(`${photo.key} entry missing in ${doc._id}`)
}
const assets = new Map()
for (const photo of photos) {
  const source = photo.source || {id: photo.id, name: `${photo.author} / Unsplash`, url: `https://unsplash.com/photos/${photo.slug}-${photo.id}`}
  const asset = await client.assets.upload('image', await readFile(new URL(`../public/assets/${photo.key}-cover.jpg`, import.meta.url)), {filename: `${photo.key}-cover-${photo.id || 'essex-council'}.jpg`, contentType: 'image/jpeg', source})
  assets.set(photo.key, asset._id)
}
const transaction = client.transaction()
for (const doc of documents) {
  const fields = {}
  for (const photo of photos) {
    const site = doc.replicationSites.find(item => item.siteKey === photo.key)
    fields[`replicationSites[_key==${JSON.stringify(site._key)}].heroImage`] = {
      _type: 'image', asset: {_type: 'reference', _ref: assets.get(photo.key)},
      alt: photo.alt, caption: photo.caption, credit: photo.credit || `Photo: ${photo.author} / Unsplash (${photo.id})`,
    }
  }
  transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields))
}
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  for (const photo of photos) {
    const site = result.replicationSites.find(item => item.siteKey === photo.key)
    if (site.heroImage?.asset?._ref !== assets.get(photo.key)) throw new Error(`Image verification failed for ${photo.key} in ${doc._id}`)
    console.log(`Verified ${photo.key} cover photo in ${doc._id}`)
  }
}
