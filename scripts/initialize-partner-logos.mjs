import {getCliClient} from '../studio/node_modules/sanity/lib/cli.js'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const client = getCliClient({apiVersion: '2026-10-05'})
const catalog = JSON.parse(await readFile(new URL('./partner-assets.json', import.meta.url), 'utf8'))
for (const documentId of ['section-consortium', 'drafts.section-consortium']) {
  const doc = await client.getDocument(documentId)
  if (!doc) continue
  const fields = {pageHeading: 'Who we are', teamHeading: 'Meet the RESILIACT team', partnersHeading: 'Partners', associatedHeading: 'Associated partners'}
  const coordinator = catalog.find(item => item.name === doc.coordinatorName)
  const logo = async item => {
    const path = fileURLToPath(new URL(`../public${item.logoPath}`, import.meta.url))
    const asset = await client.assets.upload('image', await readFile(path), {filename: item.logoPath.split('/').at(-1)})
    return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: `${item.name} logo`}
  }
  if (coordinator) {
    fields.coordinatorWebsite = coordinator.website
    if (!doc.coordinatorLogo) fields.coordinatorLogo = await logo(coordinator)
  }
  for (const partner of doc.partners || []) {
    const defaults = catalog.find(item => item.name === partner.name)
    if (!defaults) continue
    const path = `partners[_key==${JSON.stringify(partner._key)}]`
    for (const field of ['website', 'logoBackground', 'logoSource', 'logoNote']) if (defaults[field]) fields[`${path}.${field}`] = defaults[field]
    fields[`${path}.group`] = 'partner'
    if (!partner.logo) fields[`${path}.logo`] = await logo(defaults)
    console.log(`Prepared ${partner.name}`)
  }
  await client.patch(documentId).setIfMissing(fields).commit()
}
console.log('Initialized consortium logos and official websites; existing content and logo edits were preserved.')
