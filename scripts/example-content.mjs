import {osloBlogTemplate} from './blog-template.mjs'

const hubs = [
  ['oslo', 'Norway', 'Oslo', 'Exploring rain-triggered quick-clay instability and urban flooding, with a focus on coordinating responses across agencies and essential services.', 'Agency for Emergency Planning, City of Oslo'],
  ['reykjavik', 'Iceland', 'Reykjavík', 'Bringing multi-hazard forecasting, preparedness and emergency coordination into a shared local environment for co-design and evaluation.', 'Capital Region Fire Department'],
  ['stockholm', 'Sweden', 'Stockholm', 'Exploring rainfall-induced flooding and heatwave response coordination, including implications for urban services, health and social care.', 'Safety and Security Department, City of Stockholm'],
  ['copenhagen', 'Denmark', 'Copenhagen', 'Exploring compound coastal and urban flood impacts, with a focus on multi-agency decision support and alert coordination.', 'Hovedstadens Beredskab, Capital Emergency Services'],
  ['helsinki', 'Finland', 'Helsinki', 'Exploring heat-health management, linking forecasting and decision support with health, energy and social-care services.', 'Helsinki City Rescue Department'],
]
export const exampleDocuments = [
  ...hubs.map(([hubKey, country, title, summary, localAuthority]) => ({
    _id: `hub-${hubKey}`, _type: 'innovationHub', hubKey, country, title, summary, localAuthority,
    slug: {_type: 'slug', current: hubKey},
    livingLabApproach: 'Authorities, researchers, businesses and civil society shape, test and evaluate the solutions together.',
  })),
  {
    _id: 'news-oslo-consortium-meeting-2026', _type: 'news',
    title: 'RESILIACT partners meet at Oslo City Hall',
    slug: {_type: 'slug', current: 'resiliact-partners-meet-at-oslo-city-hall'},
    summary: 'The first in-person consortium meeting brought the partnership together in Oslo to discuss project activities, coordination and the development of the RESILIACT solutions.',
    category: 'Consortium meeting · Oslo', publishedAt: '2026-09-22T10:00:00+02:00',
    body: osloBlogTemplate,
    hub: {_type: 'reference', _ref: 'hub-oslo'},
  },
]
