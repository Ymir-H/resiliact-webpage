import React from 'react'
import {safeUrl} from './content.js'
import {hubKeys} from '../scripts/hub-content.mjs'
import {replicationDefaults} from '../scripts/replication-content.mjs'
import {pilotPath} from './pilot-routes.js'
import {getPilotProfile} from '../scripts/pilot-profile.mjs'
import {PilotIcon} from './pilot-icons.js'
import {replicationMapLabels} from './pilot-map-labels.js'
import './pilot-pages.css'

const h = React.createElement
// Reuse the bundled country artwork for cards without an editorial photograph.
const artwork = new Map()
for (const [index, key] of [...hubKeys, ...replicationDefaults.map(site => site.siteKey)].entries()) {
  const marker = index < hubKeys.length ? document.querySelector(`.map-hub[data-hub="${index}"] .map-dot`) : document.querySelectorAll('circle.replica-dot')[index - hubKeys.length]
  const countryId = marker?.dataset.countryId || marker?.parentElement.dataset.countryId
  const country = document.querySelector(`.map-country[data-country-id="${countryId}"]`)
  if (!country || !marker) continue
  const box = country.getBBox()
  const pad = Math.max(box.width, box.height) * .12
  artwork.set(key, {path: country.getAttribute('d'), viewBox: `${box.x - pad} ${box.y - pad} ${box.width + pad * 2} ${box.height + pad * 2}`, x: marker.getAttribute('cx'), y: marker.getAttribute('cy'), radius: Math.max(box.width, box.height) * .025})
}
export function PilotVisual({item, eager = false}) {
  const src = safeUrl(item.imageUrl)
  if (src) return h('img', {src, alt: item.heroImage?.alt || '', loading: eager ? 'eager' : 'lazy'})
  const art = artwork.get(item.hubKey)
  return art ? h('svg', {viewBox: art.viewBox, 'aria-hidden': true, focusable: false, className: 'pilot-country-art'},
    h('path', {d: art.path}), h('circle', {cx: art.x, cy: art.y, r: art.radius * 2.4, className: 'pilot-art-halo'}),
    h('circle', {cx: art.x, cy: art.y, r: art.radius, className: 'pilot-art-dot'})) : null
}
export function PilotCards({groups}) {
  return h(React.Fragment, null, ...groups.map(group => h('section', {key: group.id, className: 'pilot-card-section', id: `${group.id}-sites`, 'aria-labelledby': `${group.id}-heading`},
    h('div', {className: 'pilot-group-heading'}, h('div', null,
      h('p', {className: 'eyebrow'}, `${group.label} · ${group.items.length} locations`), h('h2', {id: `${group.id}-heading`}, group.title)), h('p', null, group.description)),
    h('div', {className: 'pilot-card-grid'}, ...group.items.map(item => h('a', {key: item.hubKey, className: 'pilot-card', href: pilotPath(item)},
      h('div', {className: 'pilot-card-visual'}, h(PilotVisual, {item}), h('span', {className: 'pilot-card-badge'}, group.id === 'drmih' ? `DRMIH-${hubKeys.indexOf(item.hubKey) + 1}` : replicationMapLabels[item.hubKey]?.[0].split(' ')[0] || group.label)),
      h('div', {className: 'pilot-card-copy'}, h('p', {className: 'eyebrow'}, item.country), h('h3', null, item.title),
        h('p', {className: 'pilot-card-summary'}, item.summary), h('span', {className: 'pilot-card-action'}, 'Explore this site', h('span', {'aria-hidden': true}, '↗')))))))))
}
export function PilotDetail({item, content, richText, downloadLinks}) {
  if (!item) return h('section', {className: 'wrap pilot-story'},
    h('h1', {className: 'page-title'}, content.status === 'loading' ? 'Loading site…' : content.status === 'error' ? 'Site content is temporarily unavailable' : 'Site not found'),
    h('p', null, content.status === 'error' ? 'Please reload the page to try again.' : content.status === 'loading' ? 'Fetching the latest published content.' : 'This site is unavailable or its address has changed.'),
    h('a', {href: '/innovation-hubs/', className: 'text-link'}, 'Back to all RESILIACT hubs'))
  const replication = item.pilotType === 'replication'
  const profile = getPilotProfile(item)
  const iconSection = (heading, entries, kind) => Array.isArray(entries) && entries.length > 0 && h('section', {className: `pilot-icon-section pilot-${kind}`, 'aria-label': heading},
    h('h2', null, heading), h('ul', {className: 'pilot-icon-grid'}, ...entries.map((entry, index) => h('li', {key: entry._key || index},
      h('span', {className: 'pilot-icon-symbol'}, h(PilotIcon, {name: entry.icon})), h('span', {className: 'pilot-icon-label'}, entry.label)))))
  return h('article', {className: 'wrap pilot-story'},
    h('a', {className: 'text-link pilot-back', href: `/innovation-hubs/#${replication ? 'replication' : 'drmih'}-sites`}, '← All RESILIACT hubs'),
    h('header', {className: 'pilot-story-header'}, h('div', null,
      h('p', {className: 'eyebrow'}, `${replication ? 'Replication site' : 'Nordic innovation hub · DRMIH'} · ${item.country}`),
      h('h1', {className: 'page-title'}, item.title), h('p', {className: 'pilot-story-summary'}, item.summary)),
      h('figure', {className: 'pilot-story-visual'}, h(PilotVisual, {item, eager: true}),
        (item.heroImage?.caption || item.heroImage?.credit) && h('figcaption', null, [item.heroImage.caption, item.heroImage.credit].filter(Boolean).join(' · ')))),
    h('section', {className: 'pilot-purpose-row', 'aria-label': 'Aim, why and how'},
      ...[['aim', 'Aim'], ['why', 'Why'], ['how', 'How']].map(([key, title], index) => h('section', {key},
        h('span', {className: 'pilot-purpose-number', 'aria-hidden': true}, `0${index + 1}`), h('h2', null, title), h('p', null, profile[key])))),
    iconSection('Hazards', profile.hazards, 'hazards'),
    iconSection('Stakeholders involved', profile.stakeholders, 'stakeholders'),
    (item.localAuthority || item.livingLabApproach) && h('div', {className: 'pilot-story-facts'},
      item.localAuthority && h('section', null, h('h2', null, 'Local authority and participating organisations'), h('p', null, item.localAuthority)),
      item.livingLabApproach && h('section', null, h('h2', null, 'The local charter for multi-stakeholders'), h('p', null, item.livingLabApproach))),
    h('div', {className: 'pilot-story-body article-body'}, richText(item.body)),
    item.gallery?.length > 0 && h('section', {className: 'pilot-story-gallery', 'aria-label': 'Site gallery'},
      ...item.gallery.filter(image => safeUrl(image.url)).map((image, index) => h('figure', {key: image._key || index},
        h('img', {src: image.url, alt: image.alt || '', loading: 'lazy'}),
        (image.caption || image.credit) && h('figcaption', null, [image.caption, image.credit].filter(Boolean).join(' · '))))),
    downloadLinks(item))
}
