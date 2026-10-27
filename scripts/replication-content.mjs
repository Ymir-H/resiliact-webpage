export const replicationDefaults = [
  ['brussels', 'Brussels', 'Belgium'], ['attica', 'Attica', 'Greece'],
  ['bratislava', 'Bratislava', 'Slovakia'], ['lisbon', 'Lisbon', 'Portugal'],
  ['essex', 'Essex', 'United Kingdom'], ['algiers', 'Algiers', 'Algeria'],
].map(([siteKey, title, country], index) => ({
  _key: `replica-${index}`, siteKey, title, country,
  summary: `Placeholder: ${title} will explore how RESILIACT solutions can be adapted to its regional context. Local priorities and activities will be added by the project team.`,
  localAuthority: 'Placeholder: local authority and participating organisations to be confirmed.',
  livingLabApproach: 'Placeholder: local stakeholders will explore transferable approaches and share lessons with the Nordic innovation hubs. Details will be confirmed by the project team.',
}))
export function replicationRecords(records = replicationDefaults) {
  return records.map(record => {
    const fallback = replicationDefaults.find(item => item.siteKey === record.siteKey || item._key === record._key || item.country === record.country)
    const result = {...fallback, ...record}
    if (/^canvey island$/i.test(result.title || '')) result.title = 'Essex'
    return result
  })
}
