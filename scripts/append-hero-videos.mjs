import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {additionalHeroMedia} from './additional-hero-media.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const upload = async (type, path) => {
  const asset = await client.assets.upload(type, await readFile(new URL(`../public${path}`, import.meta.url)), {filename: path.split('/').at(-1)})
  return {_type: type, asset: {_type: 'reference', _ref: asset._id}}
}
const additions = []
for (const {mediaUrl, posterUrl, id: sourceId, slug, creator, page, ...item} of additionalHeroMedia) {
  const video = await upload('file', mediaUrl)
  const poster = await upload('image', posterUrl)
  additions.push({...item, video, poster})
  console.log(`Uploaded ${item.title}`)
}
for (const id of ['section-home', 'drafts.section-home']) {
  const doc = await client.getDocument(id)
  if (!doc) continue
  const missing = additions.filter(item => !doc.heroGallery?.some(existing => existing._key === item._key || existing.creditUrl === item.creditUrl))
  if (!missing.length) continue
  let patch = client.patch(id).ifRevisionId(doc._rev)
  patch = doc.heroGallery?.length ? patch.append('heroGallery', missing) : patch.set({heroGallery: missing})
  await patch.commit()
  console.log(`Appended ${missing.length} videos to ${id}; existing media and ordering preserved`)
}
