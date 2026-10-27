import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {projectDetails} from './project-content.mjs'

const client = getCliClient({apiVersion: '2026-10-05'})
const documents = (await Promise.all(['section-project', 'drafts.section-project'].map(id => client.getDocument(id)))).filter(Boolean)
if (!documents.some(doc => doc._id === 'section-project')) throw new Error('Published About RESILIACT document not found')
const transaction = client.transaction()
for (const doc of documents) transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).setIfMissing({projectDetails: {}}).set({'projectDetails.aboutIntro': projectDetails.aboutIntro}))
await transaction.commit()
for (const doc of documents) {
  const result = await client.getDocument(doc._id)
  if (result.projectDetails?.aboutIntro !== projectDetails.aboutIntro) throw new Error(`Introduction verification failed in ${doc._id}`)
  console.log(`Verified project introduction in ${doc._id}`)
}
