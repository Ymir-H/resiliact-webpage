const block = (key, text, style = 'normal') => ({_type: 'block', _key: key, style, markDefs: [], children: [{_type: 'span', _key: `${key}-text`, text, marks: []}]})

export const forumEvent = {
  _id: 'event-european-civil-protection-forum-2026',
  _type: 'projectEvent',
  title: 'Meet RESILIACT in the 9th European Civil Protection Forum!',
  slug: {_type: 'slug', current: 'meet-resiliact-9th-european-civil-protection-forum'},
  summary: 'Meet RESILIACT at the 9th European Civil Protection Forum in Brussels on 3–4 November 2026. Connect with the project and explore our work on multi-hazard impact forecasting, early warning and disaster resilience.',
  startsAt: '2026-11-03T07:00:00Z',
  endsAt: '2026-11-04T15:30:00Z',
  location: 'Tour & Taxis, Brussels',
  address: 'Avenue du Port 86c\n1000 Brussels, Belgium',
  organizer: 'European Commission — Directorate-General for European Civil Protection and Humanitarian Aid Operations (DG ECHO)',
  category: 'Forum',
  website: 'https://civil-protection-knowledge-network.europa.eu/european-civil-protection-forum-2026',
  registrationLabel: 'Official forum programme and information',
  body: [
    block('intro', 'The 9th European Civil Protection Forum brings together policymakers, civil protection authorities, first responders, researchers and other stakeholders to exchange knowledge and strengthen cooperation across Europe.'),
    block('theme', 'Under the theme “Preparing today, ready for tomorrow”, the Forum explores preparedness and resilience through plenary discussions, workshops, demonstrations and opportunities to connect with the civil protection community.'),
    block('meet-heading', 'Meet RESILIACT', 'h2'),
    block('meet-text', 'Meet the RESILIACT team to learn about our work connecting multi-hazard impact forecasting, early warning, decision support and risk communication. Discover how collaboration with authorities and communities helps shape practical approaches to disaster resilience.'),
    block('programme-text', 'Details of RESILIACT’s participation and opportunities to meet the team will be added here. Visit the official Forum website for the event programme and practical information.'),
  ],
}
