// Shared by the website, Studio and the non-destructive profile initializer.
export const hazardIcons = [
  {value: 'rain', title: 'Heavy rainfall'}, {value: 'flood', title: 'Flooding'},
  {value: 'coastal', title: 'Coastal flooding'}, {value: 'landslide', title: 'Ground instability'},
  {value: 'volcano', title: 'Volcanic activity'}, {value: 'seismic', title: 'Seismic activity'},
  {value: 'heat', title: 'Heat and heat stress'}, {value: 'fire', title: 'Fire weather'},
  {value: 'weather', title: 'Extreme weather'}, {value: 'hydrology', title: 'Hydrological extremes'},
  {value: 'geohazard', title: 'Geohazards'},
]
export const stakeholderIcons = [
  {value: 'authority', title: 'Public authorities'}, {value: 'protection', title: 'Civil protection'},
  {value: 'responder', title: 'Emergency services'}, {value: 'forecast', title: 'Weather and hydrology services'},
  {value: 'science', title: 'Research and academic institutions'}, {value: 'community', title: 'Civil society and communities'},
  {value: 'volunteer', title: 'Volunteers'}, {value: 'infrastructure', title: 'Infrastructure and utilities'},
  {value: 'health', title: 'Health and social care'},
]
const copy = {
  oslo: {
    aim: 'Explore rain-triggered quick-clay instability and urban flooding, with a focus on coordinating responses across agencies and essential services.',
    why: 'Rain, ground instability and flooding can affect several services at once. Shared information and coordinated decisions help agencies work together.',
    how: 'Build on the Oslo Emergency Forum and the Oslo Charter to connect public authorities, emergency services, scientific institutions, civil society and volunteers.',
  },
  reykjavik: {
    aim: 'Explore volcanic and seismic cascades affecting critical infrastructure and coastal operations, linking forecasting with cross-sector decision support.',
    why: 'Cascading volcanic and seismic events connect the needs of infrastructure operators, coastal services and emergency responders.',
    how: 'Use the Capital Area Emergency Coordination Forum and the Reykjavik Charter to connect regional authorities, emergency services, infrastructure partners, researchers and volunteer organisations.',
  },
  stockholm: {
    aim: 'Explore rainfall-induced flooding and heatwave response coordination across urban services, health and social care.',
    why: 'Flooding and heatwaves involve municipal services, utilities, health and social care, making coordination between these sectors a shared priority.',
    how: 'Build on the Stockholm Resilience and Preparedness Forum and the Stockholm Charter, bringing municipal and regional authorities together with emergency services, utilities, academic institutions and care organisations.',
  },
  copenhagen: {
    aim: 'Explore compound coastal and urban flood impacts through multi-agency decision support and alert coordination.',
    why: 'Coastal and urban flood impacts connect the responsibilities of emergency services, municipal authorities, utilities and communities.',
    how: 'Use the Copenhagen Resilience and Emergency Forum and the Copenhagen Charter to coordinate municipal authorities, emergency services, utility providers and community organisations.',
  },
  helsinki: {
    aim: 'Explore urban heat and heat-stress responses, linking forecasting and decision support across health, energy and social-care services.',
    why: 'Heat-stress response connects healthcare, social care and energy services, requiring shared preparedness and coordinated decisions.',
    how: 'Build on the Helsinki City Preparedness Forum and the Helsinki Charter to connect municipal authorities, emergency services, care providers, civil society and volunteers.',
  },
  brussels: {
    aim: 'Explore how RESILIACT approaches can support preparedness for weather and hydrological extremes in Brussels.',
    why: 'Weather and hydrological extremes require public authorities, emergency services and communities to share information and coordinate preparedness.',
    how: 'Build on the Brussels Urban Safety and Crisis Forum and the Brussels Charter, connecting regional and municipal risk-management authorities, emergency services, public institutions and community organisations.',
  },
  attica: {
    aim: 'Explore how RESILIACT approaches can support preparedness for heat and fire-weather impacts in Attica.',
    why: 'Heat and fire-weather preparedness brings together the needs of civil protection, infrastructure providers, municipalities and local communities.',
    how: 'Use the Attica Disaster Risk Governance Forum and the Attica Charter to connect regional civil protection, infrastructure providers, volunteer networks, municipal authorities and emergency services.',
  },
  bratislava: {
    aim: 'Explore how RESILIACT approaches can support preparedness for weather and hydrological extremes in Bratislava.',
    why: 'Weather and hydrological extremes connect crisis management, hydro-meteorological expertise and the needs of local communities.',
    how: 'Use the Bratislava Charter to support knowledge exchange, capacity building and collaboration between authorities, civil protection, researchers, emergency services and civil society.',
  },
  algiers: {
    aim: 'Explore how RESILIACT approaches can support preparedness for geohazards and geophysical events in Algiers.',
    why: 'Geohazard preparedness connects national and local risk-management authorities with scientific institutions, emergency services and communities.',
    how: 'Use the Algiers Charter to connect national and local authorities, civil-protection services, academic partners and civil society across the North African context.',
  },
  lisbon: {
    aim: 'Explore how RESILIACT approaches can support preparedness for weather and hydrological extremes in Lisbon.',
    why: 'Preparedness for weather and hydrological extremes calls for coordination across public authorities, first responders and the port and urban areas described in the local charter.',
    how: 'Use the Lisbon Charter to support knowledge exchange, capacity building and collaboration among national and local authorities, civil protection, first responders and academic partners.',
  },
  essex: {
    aim: 'Explore how RESILIACT approaches can support preparedness for weather and hydrological extremes and flooding in Essex.',
    why: 'Flood risk management connects the responsibilities of national and local authorities, civil-protection services and scientific partners.',
    how: 'Use the Essex Charter to support knowledge exchange, capacity building and collaboration among authorities, civil protection and academic partners in flood risk management.',
  },
}
const textOf = blocks => (blocks || []).filter(block => block?._type === 'block').map(block => (block.children || []).map(span => span.text || '').join('')).join(' ')
const entry = (icon, label) => ({_key: icon, icon, label})
export function inferHazards(item) {
  const text = `${item.summary || ''} ${textOf(item.body)}`.toLowerCase()
  const result = []
  const add = (icon, label) => result.push(entry(icon, label))
  if (/rain|rainfall/.test(text)) add('rain', 'Heavy rainfall')
  if (/quick.?clay|landslide|ground instability/.test(text)) add('landslide', /quick.?clay/.test(text) ? 'Quick-clay and ground instability' : 'Ground instability')
  if (/coastal.*flood|flood.*coastal/.test(text)) add('coastal', 'Coastal flooding')
  if (/flood/.test(text)) add('flood', /urban flood/.test(text) ? 'Urban flooding' : 'Flooding')
  if (/volcan/.test(text)) add('volcano', 'Volcanic activity')
  if (/seismic|earthquake/.test(text)) add('seismic', 'Seismic activity')
  if (/heat/.test(text)) add('heat', /heat.?stress|heat.health/.test(text) ? 'Heat stress' : /urban heat island/.test(text) ? 'Urban heat' : /heatwave/.test(text) ? 'Heatwaves' : 'Heat impacts')
  if (/fire.weather|wildfire/.test(text)) add('fire', 'Fire-weather impacts')
  if (/weather.*extreme|extreme.*weather/.test(text)) add('weather', 'Weather extremes')
  if (/hydrolog/.test(text)) add('hydrology', 'Hydrological extremes')
  if (/geohazard|geophysical/.test(text)) add('geohazard', 'Geohazards and geophysical events')
  return result
}
export function inferStakeholders(item) {
  const text = `${item.localAuthority || ''} ${item.livingLabApproach || ''}`.toLowerCase()
  const result = []
  const add = (icon, label) => result.push(entry(icon, label))
  if (/authorit|municipal|city|county council|region of/.test(text)) add('authority', 'Public authorities')
  if (/civil.protection|risk.management|major risks|crisis management|security and prevention|emergency planning/.test(text)) add('protection', 'Civil protection and risk management')
  if (/emergency services|fire department|rescue department|first responders|search and rescue/.test(text)) add('responder', 'Emergency services and first responders')
  if (/met[eo]*rological|meteorolog|hydro.meteorolog|hydrological institute/.test(text)) add('forecast', 'Meteorological and hydrological services')
  if (/academic|scientific|research|geological survey/.test(text)) add('science', 'Research and academic institutions')
  if (/civil society|community|communities|ngo|red cross|people.s aid/.test(text)) add('community', 'Civil society and community organisations')
  if (/volunteer/.test(text)) add('volunteer', 'Volunteer organisations')
  if (/infrastructure|utility|utilities|water and wastewater/.test(text)) add('infrastructure', 'Infrastructure and utility providers')
  if (/health|social.care|healthcare/.test(text)) add('health', 'Health and social-care services')
  return result
}
export function getPilotProfile(item) {
  const defaults = copy[item.hubKey || item.siteKey] || {
    aim: item.summary || '', why: 'Connect local priorities with coordinated disaster preparedness.', how: item.livingLabApproach || '',
  }
  const overrides = Object.fromEntries(Object.entries(item.siteOverview || {}).filter(([, value]) => value != null))
  return {...defaults, hazards: inferHazards(item), stakeholders: inferStakeholders(item), ...overrides}
}
