import {drmiDefaults} from './hub-content.mjs'
import {replicationDefaults} from './replication-content.mjs'

const contentFields = ['title', 'country', 'summary', 'localAuthority', 'livingLabApproach', 'slug', 'heroImage', 'body', 'gallery', 'attachments']

export function mergeHubLists(document, records, includeDrafts = false) {
  const merge = (field, keyField, defaults) => {
    const existing = document[field] || []
    const items = [...existing, ...defaults.filter(fallback => !existing.some(item =>
      item[keyField] === fallback[keyField] || item._key === fallback._key))]
    return items.map(item => {
      if (item.contentMerged) return item
      const fallback = defaults.find(candidate => candidate[keyField] === item[keyField] || candidate._key === item._key)
      const key = item[keyField] || fallback?.[keyField]
      const matching = records.filter(record => (record.hubKey || record.siteKey) === key && !record._id.startsWith('versions.'))
      const record = (includeDrafts && matching.findLast(record => record._id.startsWith('drafts.'))) ||
        matching.findLast(record => !record._id.startsWith('drafts.'))
      const legacy = Object.fromEntries(contentFields.filter(name => record?.[name] !== undefined).map(name => [name, record[name]]))
      return {body: [], gallery: [], attachments: [], heroImage: null,
        slug: {_type: 'slug', current: key}, ...fallback, ...legacy, ...item, contentMerged: true}
    })
  }
  return {drmihSites: merge('drmihSites', 'hubKey', drmiDefaults), replicationSites: merge('replicationSites', 'siteKey', replicationDefaults)}
}
