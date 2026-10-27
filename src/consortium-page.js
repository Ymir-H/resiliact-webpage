import React from 'react'
import assets from '../scripts/partner-assets.json'
import {safeUrl} from './content.js'
import './consortium-page.css'

const h = React.createElement
function partnerCard(item, coordinator = false) {
  const defaults = assets.find(asset => asset.name === item.name)
  const website = safeUrl(item.website || defaults?.website)
  const logo = safeUrl(item.logoUrl) || defaults?.logoPath
  const copy = h(React.Fragment, null,
    h('div', {className: `consortium-logo${defaults?.partnerKey === 'tvs' ? ' consortium-logo-technovative' : ''} logo-background-${item.logoBackground || defaults?.logoBackground || 'white'}`},
      logo ? h('img', {src: logo, alt: item.logo?.alt || `${item.name} logo`, loading: 'lazy'}) : h('span', {className: 'partner-monogram', 'aria-hidden': true}, item.name.slice(0, 2))),
    h('div', {className: 'consortium-partner-copy'}, coordinator && h('p', {className: 'eyebrow'}, 'PROJECT COORDINATOR'),
      h('h3', null, item.name), h('p', {className: 'partner-country'}, item.country),
      item.description && h('p', {className: 'partner-description'}, item.description),
      (item.logoNote || defaults?.logoNote) && h('p', {className: 'partner-logo-note'}, item.logoNote || defaults.logoNote)))
  return h('article', {className: `consortium-partner${coordinator ? ' consortium-coordinator' : ''}`, key: item._key || item.name},
    website ? h('a', {href: website, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${item.name} — official website (opens in a new tab)`}, copy) : h('div', null, copy))
}
export function ConsortiumPage({document: doc, richText, downloadLinks, embedded = false}) {
  const partners = doc.partners || []
  const groups = [
    {heading: doc.partnersHeading || 'Partners', records: partners.filter(partner => partner.group !== 'associated')},
    {heading: doc.associatedHeading || 'Associated partners', records: partners.filter(partner => partner.group === 'associated')},
  ]
  const teamPhoto = safeUrl(doc.teamPhotoUrl)
  return h(embedded ? 'section' : 'div', {id: embedded ? 'project-consortium' : undefined, className: embedded ? 'consortium-page project-consortium' : 'wrap consortium-page', 'aria-labelledby': embedded ? 'project-consortium-title' : undefined},
    h('div', {className: 'consortium-introduction'}, h('p', {className: 'eyebrow'}, doc.eyebrow || 'A EUROPEAN PARTNERSHIP'),
      h(embedded ? 'h2' : 'h1', {id: embedded ? 'project-consortium-title' : undefined, className: 'page-title'}, doc.pageHeading || 'Who we are'),
      h('h2', null, doc.teamHeading || 'Meet the RESILIACT team'), h('p', {className: 'consortium-lead'}, doc.intro)),
    h('figure', {className: 'consortium-team-photo'}, teamPhoto
      ? h('img', {src: teamPhoto, alt: doc.teamPhoto?.alt || ''})
      : h('div', {className: 'consortium-team-placeholder'},
        h('svg', {viewBox: '0 0 80 56', width: 80, height: 56, fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true},
          h('circle', {cx: 40, cy: 15, r: 9}), h('circle', {cx: 16, cy: 20, r: 7}), h('circle', {cx: 64, cy: 20, r: 7}),
          h('path', {d: 'M25 52V42a15 15 0 0 1 30 0v10M3 48v-7a13 13 0 0 1 20-11M77 48v-7a13 13 0 0 0-20-11'})),
        h('p', null, 'RESILIACT group photo'), h('span', null, 'Photo coming soon')),
      teamPhoto && doc.teamPhoto?.caption && h('figcaption', null, doc.teamPhoto.caption)),
    h('section', {className: 'consortium-coordinator-section', 'aria-labelledby': 'coordinator-heading'},
      h('h2', {id: 'coordinator-heading'}, doc.coordinatorLabel || 'Project coordinator'),
      partnerCard({name: doc.coordinatorName || 'NORSAR', country: doc.coordinatorCountry || 'Norway', website: doc.coordinatorWebsite, logo: doc.coordinatorLogo, logoUrl: doc.coordinatorLogoUrl, description: doc.coordinatorDescription}, true)),
    ...groups.filter(group => group.records.length).map((group, index) => h('section', {className: 'consortium-partner-section', key: index, 'aria-labelledby': `partner-group-${index}`},
      h('h2', {id: `partner-group-${index}`}, group.heading), h('div', {className: 'consortium-partner-grid'}, ...group.records.map(partner => partnerCard(partner))))),
    h('div', {className: 'page-extra article-body'}, richText(doc.pageBody), downloadLinks({attachments: doc.pageAttachments})))
}
