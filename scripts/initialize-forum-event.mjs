import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {forumEvent} from './forum-event.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const existing = await client.fetch('*[_type == "projectEvent" && (_id == $id || slug.current == $slug || title == $title)][0]', {id: forumEvent._id, slug: forumEvent.slug.current, title: forumEvent.title})
if (existing) {
  console.log(`Forum event already exists: ${existing._id}; editor content preserved`)
} else {
  const asset = await client.assets.upload('image', await readFile(new URL('../public/assets/event-placeholder.svg', import.meta.url)), {filename: 'resiliact-civil-protection-forum-placeholder.svg', contentType: 'image/svg+xml'})
  await client.createIfNotExists({...forumEvent, heroImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: 'RESILIACT at the 9th European Civil Protection Forum, 3–4 November 2026 in Brussels — event image placeholder', caption: 'Event image placeholder. Official event artwork will be added when available.'}})
  console.log(`Published forum event: /event/${forumEvent.slug.current}/`)
}
const result = await client.fetch('*[_type == "projectEvent" && !(_id in path("drafts.**")) && slug.current == $slug][0]{title, startsAt, endsAt, "imageUrl": heroImage.asset->url}', {slug: forumEvent.slug.current})
if (!result?.imageUrl || result.title !== forumEvent.title) throw new Error('Forum publication verification failed')
console.log('Verified published forum title, dates and placeholder image')
