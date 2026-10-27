import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {heroMediaDefaults} from './hero-media.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const upload = async (type, path) => {
  const asset = await client.assets.upload(type, await readFile(new URL(`../public${path}`, import.meta.url)), {filename: path.split('/').at(-1)})
  return {_type: type, asset: {_type: 'reference', _ref: asset._id}}
}
for (const id of ['section-home', 'drafts.section-home']) {
  const doc = await client.getDocument(id)
  if (!doc || Array.isArray(doc.heroGallery)) continue
  const items = []
  for (const {mediaUrl, posterUrl, id: sourceId, slug, creator, page, ...item} of heroMediaDefaults) {
    if (item.mediaType === 'image') items.push({...item, image: doc.heroImage || await upload('image', mediaUrl), alt: doc.imageAlt || item.alt})
    else items.push({...item, video: await upload('file', mediaUrl), poster: await upload('image', posterUrl)})
  }
  await client.patch(id).setIfMissing({heroGallery: items}).commit()
  console.log(`Initialized editable hero gallery in ${id}; existing gallery edits preserved`)
}
