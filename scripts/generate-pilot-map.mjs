// Natural Earth 1:50m boundaries, distributed by world-atlas 2.0.2 (ISC).
// Natural Earth geographic data is public domain: https://www.naturalearthdata.com/about/terms-of-use/
// Source: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
import {readFileSync, writeFileSync} from 'node:fs'
import {geoProjection, geoPath, geoGraticule} from 'd3-geo'
import {feature} from 'topojson-client'
import {hubMapLabels} from '../src/pilot-map-labels.js'

const width = 900, height = 760
const miller = (lambda, phi) => [lambda, 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * phi))]
const projection = geoProjection(miller).scale(1).translate([0, 0])
const topLeft = projection([-29, 72.5]), bottomRight = projection([39, 31])
const scale = Math.min((width - 48) / (bottomRight[0] - topLeft[0]), (height - 48) / (bottomRight[1] - topLeft[1]))
projection.scale(scale).translate([
  width / 2 - scale * (topLeft[0] + bottomRight[0]) / 2,
  height / 2 - scale * (topLeft[1] + bottomRight[1]) / 2,
]).clipExtent([[0, 0], [width, height]])
const path = geoPath(projection).digits(1)
const countries = feature(JSON.parse(readFileSync(new URL('./countries-50m.json', import.meta.url))), 'countries')
const pilots = [
  {hub: 0, name: 'Oslo', country: '578', coordinates: [10.7522, 59.9139], label: [-16, -17, 'end']},
  {hub: 1, name: 'Reykjavík', country: '352', coordinates: [-21.9426, 64.1466], label: [16, 5, 'start']},
  {hub: 2, name: 'Stockholm', country: '752', coordinates: [18.0686, 59.3293], label: [17, 19, 'start']},
  {hub: 3, name: 'Copenhagen', country: '208', coordinates: [12.5683, 55.6761], label: [16, -14, 'start']},
  {hub: 4, name: 'Helsinki', country: '246', coordinates: [24.9384, 60.1699], label: [-16, -35, 'end']},
  {key: 'brussels', name: 'Brussels', country: '056', coordinates: [4.3517, 50.8503], label: [16, 20, 'start']},
  {key: 'attica', name: 'Attica', country: '300', coordinates: [23.7275, 37.9838], label: [16, -14, 'start']},
  {key: 'bratislava', name: 'Bratislava', country: '703', coordinates: [17.1077, 48.1486], label: [16, -14, 'start']},
  {key: 'lisbon', name: 'Lisbon', country: '620', coordinates: [-9.1393, 38.7223], label: [-16, -14, 'end']},
  {key: 'essex', name: 'Essex', country: '826', coordinates: [0.4691, 51.7356], label: [-16, -16, 'end']},
  {key: 'algiers', name: 'Algiers', country: '012', coordinates: [3.0588, 36.7538], label: [16, 23, 'start']},
]
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const countryPaths = countries.features.flatMap(country => {
  const outline = path(country)
  if (!outline) return []
  const id = String(country.id).padStart(3, '0')
  const pilot = pilots.some(item => item.country === id)
  return [`<path class="map-country${pilot ? ' pilot-country' : ''}" data-country-id="${id}" data-country="${escape(country.properties.name.toLowerCase())}" d="${outline}"><title>${escape(country.properties.name)}</title></path>`]
}).join('')
const markers = pilots.map(pilot => {
  const [x, y] = projection(pilot.coordinates).map(value => Number(value.toFixed(1)))
  const [dx, dy, anchor] = pilot.label
  if (pilot.key) return `<circle class="replica-dot" data-country-id="${pilot.country}" cx="${x}" cy="${y}" r="6"><title>${pilot.name} replication site</title></circle>`
  return `<g class="map-hub${pilot.hub === 0 ? ' active' : ''}" data-country-id="${pilot.country}" role="button" tabindex="0" aria-label="Explore ${hubMapLabels[pilot.hub].join(' ')}" aria-pressed="${pilot.hub === 0}" data-hub="${pilot.hub}"><circle class="map-hit" cx="${x}" cy="${y}" r="22"/><circle class="map-halo" cx="${x}" cy="${y}" r="16"/><circle class="map-dot" cx="${x}" cy="${y}" r="7"/><text x="${x + dx}" y="${y + dy}" text-anchor="${anchor}">${hubMapLabels[pilot.hub].map(escape).join(' ')}</text></g>`
}).join('')
const svg = `<svg class="region-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="group" aria-labelledby="map-title map-desc"><title id="map-title">RESILIACT innovation hubs and replication sites</title><desc id="map-desc">Interactive map of Europe and the Mediterranean. Select one of five Nordic hubs or six replication sites. Use the zoom buttons and drag to explore.</desc><g class="map-geography"><path class="map-graticule" d="${path(geoGraticule().extent([[-40, 25], [55, 80]]).step([10, 10])())}"/>${countryPaths}</g>${markers}</svg>`
const indexPath = new URL('../index.html', import.meta.url)
const html = readFileSync(indexPath, 'utf8')
if (!/<svg class="region-map"[\s\S]*?<\/svg>/.test(html)) throw new Error('Pilot map not found in index.html')
writeFileSync(indexPath, html.replace(/<svg class="region-map"[\s\S]*?<\/svg>/, svg))
console.log(`Generated Miller map: ${countries.features.length} source countries, ${pilots.length} pilot locations`)
