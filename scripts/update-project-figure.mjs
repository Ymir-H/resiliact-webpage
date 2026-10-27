import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'

const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-project', 'drafts.section-project'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-project')) throw new Error('Published About RESILIACT document not found')
const asset = await client.assets.upload('image', await readFile(new URL('../public/assets/resiliact-project-overview.png', import.meta.url)), {filename: 'resiliact-project-overview.png', contentType: 'image/png'})
const transaction = client.transaction()
for (const doc of documents) transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).setIfMissing({projectDetails: {}}).set({
  'projectDetails.figure': {
    _type: 'image', asset: {_type: 'reference', _ref: asset._id},
    alt: 'RESILIACT project framework: an integrated web-based platform connecting data interoperability, multi-hazard interaction, impact-based early warning, decision support and emergency risk communication through public-private-civic co-creation.',
  },
  'projectDetails.figureCaption': 'RESILIACT project framework: an integrated platform linking data interoperability, multi-hazard understanding, early warning, decision support and emergency risk communication through public-private-civic co-creation.',
}))
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  if (result.projectDetails?.figure?.asset?._ref !== asset._id) throw new Error(`Figure verification failed in ${doc._id}`)
  console.log(`Verified attached project figure and caption in ${doc._id}`)
}
