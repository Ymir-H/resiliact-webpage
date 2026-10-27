import {sectionDocuments} from '../scripts/section-content.mjs'
import {safeUrl} from './content.js'
import {pageLink} from './page-routes.js'
import {replicationRecords} from '../scripts/replication-content.mjs'
import {hubKeys} from '../scripts/hub-content.mjs'
import {hubMapLabels} from './pilot-map-labels.js'
import {renderHeroGallery} from './hero-gallery.js'

const sections = [
  ['project', '#about'], ['platform', '#platform'], ['hubs', '#regions'],
  ['outcomes', '#outcomes'], ['consortium', '#consortium'], ['news', '#updates'], ['contact', '#contact'],
]
let previous = ''
const node = (tag, className, value) => {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (value != null) element.textContent = value
  return element
}
const setText = (selector, value) => {
  const element = document.querySelector(selector)
  if (element) element.textContent = value || ''
}
const paragraph = value => node('p', '', value)
const link = (label, href, className = 'text-link') => {
  const local = href === '/#contact' || /^#[a-z][a-z0-9-]*$/.test(href || '') || /^\/(project|platform|innovation-hubs|outcomes|consortium|news|contact)?\/?$/.test(href || '')
  const target = local ? pageLink(href) : safeUrl(href)
  if (!target) return node('span', className, label)
  const anchor = node('a', className, label)
  anchor.href = target
  if (!target.startsWith('#') && !target.startsWith('/')) {anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'}
  return anchor
}
export function getSection(records, key) {
  return records?.find(record => record._id === `section-${key}`) || sectionDocuments.find(record => record._id === `section-${key}`)
}
export function renderSections(records = []) {
  const home = getSection(records, 'home')
  const documents = sections.map(([key]) => getSection(records, key))
  const project = home.projectOverview || (documents[0].lead ? documents[0] : getSection([], 'project'))
  const signature = JSON.stringify([home, ...documents])
  if (signature === previous) return
  previous = signature
  document.title = home.pageTitle
  document.querySelector('meta[name="description"]').content = home.pageDescription
  setText('#home .eyebrow', home.eyebrow)
  const heading = document.querySelector('#home h1')
  heading.classList.add('cms-heading')
  heading.replaceChildren(document.createTextNode(home.heading || ''), node('span', '', home.highlight))
  ;[['.lead', 'lead'], ['.hero-description', 'description'], ['.hero-side-caption p', 'sideCaption']].forEach(([selector, field]) => {
    const element = document.querySelector(`#home ${selector}`)
    element.textContent = home[field] || ''
    element.classList.add('cms-heading')
  })
  setText('#home .hero-side-caption > span', home.sideLabel)
  setText('#home .hero-bottom span', home.bottomLabel)
  setText('#home .hero-bottom a', home.exploreLabel)
  renderHeroGallery(home)
  document.querySelector('#home .actions').replaceChildren(...(home.actions || []).map((action, i) => link(action.label, action.target, i === 0 ? 'button' : 'button outline-button')))
  document.querySelector('.project-facts .stats').replaceChildren(...(home.facts || []).map(fact => {
    const element = node('div')
    element.append(node('strong', '', fact.value), node('span', '', fact.label))
    return element
  }))
  sections.forEach(([key, selector], index) => {
    const doc = key === 'project' ? project : documents[index]
    setText(`${selector} .eyebrow`, doc.eyebrow)
    setText(`${selector} .page-title, ${selector} h2`, doc.heading)
    document.querySelector(`${selector} .page-title, ${selector} h2`).classList.add('cms-heading')
    document.querySelectorAll(`#navigation a[href="${selector}"]`).forEach(anchor => anchor.textContent = doc.navigationLabel)
    if ('intro' in doc && key !== 'contact') {
      let intro = document.querySelector(`${selector} .section-top > p`)
      if (!intro && doc.intro) {
        intro = node('p')
        document.querySelector(`${selector} .section-top`).append(intro)
      }
      if (intro) {intro.textContent = doc.intro || ''; intro.hidden = !doc.intro}
    }
  })
  const [, platform, hubs, outcomes, consortium, , contact] = documents
  const principles = node('div', 'principles')
  ;(project.principles || []).forEach((item, index) => {
    const card = node('div')
    card.append(node('span', '', String(index + 1).padStart(2, '0')), node('h3', '', item.title), paragraph(item.description))
    principles.append(card)
  })
  document.querySelector('.about-content').replaceChildren(node('p', 'large-copy', project.lead), ...(project.paragraphs || []).map(paragraph), principles)

  const selectedCode = document.getElementById('component-code').textContent
  const controls = document.querySelector('.component-list')
  controls.replaceChildren()
  const components = platform.components || []
  const selectComponent = index => {
    const item = components[index]
    if (!item) return
    controls.querySelectorAll('button').forEach((button, i) => {
      button.classList.toggle('active', i === index)
      button.setAttribute('aria-pressed', String(i === index))
    })
    ;[['component-code', 'code'], ['component-title', 'title'], ['component-description', 'description'], ['component-outcome', 'outcome']].forEach(([id, field]) => document.getElementById(id).textContent = item[field] || '')
  }
  components.forEach((item, index) => {
    const button = node('button', 'component')
    button.type = 'button'
    button.dataset.component = index
    button.append(node('span', '', String(index + 1).padStart(2, '0')), document.createTextNode(item.label || ''), node('small', '', item.code))
    button.addEventListener('click', () => selectComponent(index))
    controls.append(button)
  })
  selectComponent(Math.max(0, components.findIndex(item => item.code === selectedCode)))
  setText('.development-note', platform.developmentNote)

  setText('#regions .list-heading', hubs.listHeading)
  for (const item of hubs.drmihSites || []) {
    const index = hubKeys.indexOf(item.hubKey)
    if (index < 0) continue
    setText(`.hub[data-hub="${index}"] span`, item.title)
    setText(`.hub[data-hub="${index}"] small`, item.country)
    setText(`.map-hub[data-hub="${index}"] text`, hubMapLabels[index].join(' '))
    const marker = document.querySelector(`.map-hub[data-hub="${index}"]`)
    marker?.setAttribute('aria-label', `Explore ${hubMapLabels[index].join(' ')}`)
  }
  const locations = replicationRecords(hubs.replicationSites).map(item => {
    const location = node('button', 'replication-site')
    location.append(node('span', '', item.title))
    location.type = 'button'
    location.dataset.siteKey = item.siteKey
    location.setAttribute('aria-pressed', 'false')
    location.addEventListener('click', () => document.dispatchEvent(new CustomEvent('select-replication', {detail: item.siteKey})))
    location.append(node('small', '', item.country))
    return location
  })
  document.querySelector('.replication-list').replaceChildren(...locations)
  document.querySelector('#outcomes > .wrap > .outcome-grid').replaceChildren(...(outcomes.expectedOutcomes || []).map((item, index) => {
    const card = node('article')
    card.append(node('span', 'outcome-number', String(index + 1).padStart(2, '0')), node('h3', 'cms-heading', item.title), paragraph(item.description), link(item.linkLabel, item.linkTarget))
    return card
  }))
  setText('.coordinator > span', consortium.coordinatorLabel)
  setText('.coordinator strong', consortium.coordinatorName)
  setText('.coordinator > p', consortium.coordinatorCountry)
  document.getElementById('partners').replaceChildren(...(consortium.partners || []).map(item => {
    const partner = node('div', 'partner')
    partner.append(node('strong', '', item.name), node('span', '', item.country))
    return partner
  }))
  setText('.contact-grid > div:first-child > p:last-child', contact.intro)
  setText('.contact-details h3', contact.organisation)
  setText('.contact-details > p:first-of-type', contact.role)
  setText('.contact-details > p:nth-of-type(2)', contact.address)
  document.querySelector('.contact-details > p:nth-of-type(2)').classList.add('cms-heading')
  const details = document.querySelector('.contact-details')
  details.querySelector('.button').replaceWith(link(contact.websiteLabel, contact.websiteUrl, 'button light'))
  details.querySelector('.contact-cordis').replaceWith(link(contact.projectLinkLabel, contact.projectLinkUrl, 'contact-cordis'))
  details.querySelector('.contact-email')?.remove()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email || '')) details.append(link(contact.email, `mailto:${contact.email}`, 'contact-email contact-cordis'))
}
