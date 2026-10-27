import './example-interactions.js'
import './content.css'
import './footer-social.js'
import './project-page.css'
import React from 'react'
import {createRoot} from 'react-dom/client'
import {PortableText} from '@portabletext/react'
import {fetchContent, isConfigured, safeUrl} from './content.js'
import {renderSections, getSection} from './sections.js'
import {renderPages} from './pages.js'
import {pageLink} from './page-routes.js'
import {postPath} from './news-routes.js'
import {replicationDefaults, replicationRecords} from '../scripts/replication-content.mjs'
import {hubKeys, hubRecord, hubContentRecords} from '../scripts/hub-content.mjs'
import {createPilotMapNavigation} from './pilot-map.js'
import {replicationMapLabels, replicationMapOffsets, setMapLabel} from './pilot-map-labels.js'
import {createPilotMapPreview} from './pilot-map-preview.js'
import {pilotGroups, pilotPath} from './pilot-routes.js'

const h = React.createElement
const pilotControls = document.createElement('div')
pilotControls.className = 'pilot-controls'
const nordicButtons = document.querySelector('.hub-list')
nordicButtons.setAttribute('role', 'group')
nordicButtons.setAttribute('aria-label', 'Five Nordic hubs')
const nordicLabel = document.createElement('p')
nordicLabel.className = 'pilot-row-label'
nordicLabel.id = 'nordic-pilots-label'
nordicLabel.textContent = 'Nordic disaster risk management innovation hubs (DRMIHs)'
nordicButtons.setAttribute('aria-labelledby', nordicLabel.id)
const replicationButtons = document.createElement('div')
replicationButtons.className = 'replication-list'
replicationButtons.setAttribute('role', 'group')
replicationButtons.setAttribute('aria-label', 'Six replication sites')
const replicationLabel = document.createElement('p')
replicationLabel.className = 'pilot-row-label'
replicationLabel.id = 'replication-sites-label'
replicationLabel.textContent = 'Replication sites (RS)'
replicationButtons.setAttribute('aria-labelledby', replicationLabel.id)
const nordicGroup = document.createElement('div')
nordicGroup.className = 'pilot-group'
nordicGroup.append(nordicLabel, nordicButtons)
const replicationGroup = document.createElement('div')
replicationGroup.className = 'pilot-group'
replicationGroup.append(replicationLabel, replicationButtons)
pilotControls.append(nordicGroup, replicationGroup)
document.querySelector('.regions-layout').before(pilotControls)
document.querySelector('#regions .replication').remove()
const keys = hubKeys
let content = {news: [], events: [], outcomes: [], hubs: [], status: 'loading'}
let dialogRoot
let previousHash = location.pathname.replace(/\/$/, '') === '/news' ? '' : '#updates'
let opener
let selectedReplication = null
const pilotPolygons = new Map()
const newsSection = document.getElementById('updates')
const originalNews = newsSection.querySelector('.news-item')
const newsList = document.createElement('div')
newsList.className = 'news-list'
originalNews.replaceWith(newsList)
newsList.append(originalNews)

const status = document.createElement('p')
status.className = 'content-status'
status.setAttribute('role', 'status')
newsSection.append(status)

const publishedOutcomes = document.createElement('div')
publishedOutcomes.className = 'published-outcomes'
document.querySelector('#outcomes > .wrap').append(publishedOutcomes)

const hubBody = document.createElement('div')
hubBody.className = 'hub-body'
document.querySelector('.hub-detail').append(hubBody)
const hubRoot = createRoot(hubBody)
const labText = document.querySelector('.hub-detail .detail-label:last-of-type + p')
const defaultLabText = labText.textContent
const originalHubFields = keys.map((key, index) => {
  document.querySelector(`.hub[data-hub="${index}"]`).click()
  return ['hub-country', 'hub-title', 'hub-description', 'hub-partner'].map(id => document.getElementById(id).textContent)
})
document.querySelector('.hub[data-hub="0"]').click()

const studioLink = document.getElementById('studio-link')
studioLink.href = safeUrl(import.meta.env.VITE_SANITY_STUDIO_URL) || 'http://localhost:3333'

const dialog = document.createElement('dialog')
dialog.className = 'content-dialog'
dialog.setAttribute('aria-labelledby', 'detail-title')
const close = document.createElement('button')
close.type = 'button'
close.className = 'dialog-close'
close.textContent = 'Close'
const dialogBody = document.createElement('div')
dialog.append(close, dialogBody)
document.body.append(dialog)
dialogRoot = createRoot(dialogBody)
close.addEventListener('click', closeDetail)
dialog.addEventListener('cancel', event => {event.preventDefault(); closeDetail()})
dialog.addEventListener('click', event => {if (event.target === dialog) closeDetail()})

function closeDetail() {
  dialog.close()
  document.body.classList.remove('detail-open')
  history.replaceState(null, '', previousHash || `${location.pathname}${location.search}`)
  if (opener?.isConnected) opener.focus()
}
function imageNode(item, className = 'article-image') {
  const src = safeUrl(item.imageUrl)
  if (!src) return null
  return h('figure', {className},
    h('img', {src, alt: item.heroImage?.alt || '', loading: 'lazy'}),
    item.heroImage?.credit && h('figcaption', null, item.heroImage.credit))
}
const portableComponents = {
  marks: {link: ({value, children}) => {
    const local = /^\/(project|platform|innovation-hubs|outcomes|consortium|news|contact)?\/?(?:#[^\s]*)?$/.test(value?.href || '') || /^#[a-z][a-z0-9-]*$/.test(value?.href || '')
    const href = local ? pageLink(value.href) : safeUrl(value?.href)
    return href ? h('a', {href, ...(local ? {} : {target: '_blank', rel: 'noopener noreferrer'})}, children) : h('span', null, children)
  }},
  types: {image: ({value}) => {
    const match = /^image-([a-zA-Z0-9]+)-(\d+x\d+)-([a-zA-Z0-9]+)$/.exec(value?.asset?._ref || '')
    if (!match || !isConfigured) return value.placeholder ? h('figure', {className: 'article-figure-placeholder'}, h('div', null, 'Photo placeholder'), value.caption && h('figcaption', null, value.caption)) : null
    const src = `https://cdn.sanity.io/images/${import.meta.env.VITE_SANITY_PROJECT_ID}/${import.meta.env.VITE_SANITY_DATASET || 'production'}/${match[1]}-${match[2]}.${match[3]}?w=1200&auto=format`
    return h('figure', null, h('img', {src, alt: value.alt || '', loading: 'lazy'}), (value.caption || value.credit) && h('figcaption', null, value.caption, value.caption && value.credit ? ' · ' : '', value.credit))
  }},
}
portableComponents.types.pullQuote = ({value}) => h('figure', {className: 'article-pull-quote'},
  value.placeholder && h('p', {className: 'editorial-placeholder-label'}, 'Quote placeholder'),
  h('blockquote', null, h('p', null, value.quote)), value.attribution && h('figcaption', null, value.attribution))
function richText(blocks) {
  return Array.isArray(blocks) && blocks.length ? h(PortableText, {value: blocks, components: portableComponents}) : null
}
function downloadLinks(item) {
  const files = (item.attachments || []).filter(file => safeUrl(file.url))
  if (!files.length) return null
  return h('div', {className: 'downloads'}, h('h3', null, 'Downloads'),
    ...files.map((file, index) => h('a', {key: file._key || index, href: safeUrl(file.url), target: '_blank', rel: 'noopener noreferrer'}, file.title || 'Download file')))
}
function displayDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo'}).format(date)
}
function detail(item, type) {
  return h('article', {className: 'article-detail'},
    h('p', {className: 'eyebrow'}, item.category || item.kind || type),
    h('h1', {id: 'detail-title'}, item.title),
    h('p', {className: 'article-meta'}, [displayDate(item.publishedAt), item.author].filter(Boolean).join(' · ')),
    h('p', {className: 'article-summary'}, item.summary), imageNode(item),
    h('div', {className: 'article-body'}, richText(item.body)), downloadLinks(item),
    safeUrl(item.externalUrl) && h('a', {className: 'text-link', href: safeUrl(item.externalUrl), target: '_blank', rel: 'noopener noreferrer'}, 'View external resource'),
    item.gallery?.length ? h('div', {className: 'hub-gallery'}, ...item.gallery.filter(image => safeUrl(image.url)).map((image, i) => h('img', {key: image._key || i, src: safeUrl(image.url), alt: image.alt || '', loading: 'lazy'}))) : null)
}
function routeDetail() {
  const match = /^#(news|outcome|hub)\/(.+)$/.exec(location.hash)
  if (!match) {
    if (dialog.open) {dialog.close(); document.body.classList.remove('detail-open')}
    return
  }
  let slug
  try {slug = decodeURIComponent(match[2])} catch {return}
  const collection = match[1] === 'news' ? content.news : match[1] === 'outcome' ? content.outcomes : hubContentRecords(content.hubs, getSection(content.sections, 'hubs'))
  const item = collection.find(record => (record.slug || record.hubKey) === slug)
  if (!item) return
  if (match[1] === 'news') {location.replace(postPath(item)); return}
  if (match[1] === 'hub') {location.replace(pilotPath(item)); return}
  dialogRoot.render(detail(item, match[1]))
  if (!dialog.open) dialog.showModal()
  document.body.classList.add('detail-open')
  close.focus()
}
function createLink(item, type, label) {
  const a = document.createElement('a')
  a.className = 'text-link'
  a.textContent = label
  a.href = `#${type}/${encodeURIComponent(item.slug || item.hubKey || '')}`
  if (type === 'news') {a.href = postPath(item); return a}
  if (type === 'hub') {a.href = pilotPath(item); return a}
  a.addEventListener('click', () => {
    previousHash = type === 'news' ? '#updates' : type === 'hub' ? '#regions' : '#outcomes'
    opener = a
  })
  return a
}
function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}
function renderNews() {
  newsList.replaceChildren()
  if (!content.news.length) {newsList.append(element('p', '', 'No news has been published yet.')); return}
  const latestPosts = [...content.news]
    .sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0))
    .slice(0, 5)
  for (const item of latestPosts) {
    const article = element('article', 'news-item')
    const date = element('div', 'news-date')
    date.append(element('time', '', displayDate(item.publishedAt)))
    const copy = element('div')
    copy.append(element('p', 'eyebrow', item.category || 'PROJECT NEWS'), element('h3', '', item.title), element('p', '', item.summary), createLink(item, 'news', 'Read article'))
    article.append(date, copy)
    newsList.append(article)
  }
}
function renderOutcomes() {
  publishedOutcomes.replaceChildren()
  if (!content.outcomes.length) return
  publishedOutcomes.append(element('h3', 'list-heading', getSection(content.sections, 'outcomes').publishedHeading))
  const grid = element('div', 'outcome-grid')
  for (const item of content.outcomes) {
    const card = element('article')
    card.append(element('span', 'outcome-number', item.kind || 'OUTCOME'), element('h3', '', item.title), element('p', '', item.summary), createLink(item, 'outcome', 'Read outcome'))
    grid.append(card)
  }
  publishedOutcomes.append(grid)
}
function updateHub(index) {
  highlightPilotArea(`hub:${index}`)
  selectedReplication = null
  document.querySelectorAll('.map-replica,.replication-site').forEach(node => {node.classList.remove('active'); node.setAttribute('aria-pressed', 'false')})
  const hub = hubRecord(content.hubs, getSection(content.sections, 'hubs').drmihSites, keys[index])
  const values = hub ? [hub.country, hub.title, hub.summary, hub.localAuthority] : originalHubFields[index]
  ;['hub-country', 'hub-title', 'hub-description', 'hub-partner'].forEach((id, i) => document.getElementById(id).textContent = values[i] || '')
  labText.textContent = hub?.livingLabApproach || defaultLabText
  hubRoot.render(hub ? h(React.Fragment, null, imageNode(hub, 'hub-image'), downloadLinks(hub)) : null)
  document.getElementById('hub-read-more')?.remove()
  if (hub?._id) {
    const link = createLink(hub, 'hub', 'Read hub updates')
    link.id = 'hub-read-more'
    hubBody.after(link)
  }
}

function updateReplication(key) {
  const sites = replicationRecords(getSection(content.sections, 'hubs').replicationSites)
  const summary = sites.find(item => item.siteKey === key)
  if (!summary) return
  const site = hubRecord(content.hubs, [{...summary, hubKey: key}], key)
  selectedReplication = key
  highlightPilotArea(`rs:${key}`)
  document.querySelectorAll('.hub,.map-hub').forEach(node => {node.classList.remove('active'); node.setAttribute('aria-pressed', 'false')})
  document.querySelectorAll('.map-replica,.replication-site').forEach(node => {
    const active = node.dataset.siteKey === key
    node.classList.toggle('active', active)
    node.setAttribute('aria-pressed', String(active))
  })
  ;['hub-country', 'hub-title', 'hub-description', 'hub-partner'].forEach((id, index) => document.getElementById(id).textContent = [site.country, site.title, site.summary, site.localAuthority][index] || '')
  labText.textContent = site.livingLabApproach || ''
  hubRoot.render(site._id ? h(React.Fragment, null, imageNode(site, 'hub-image'), downloadLinks(site)) : null)
  document.getElementById('hub-read-more')?.remove()
  if (site._id) {
    const link = createLink(site, 'hub', 'Read site updates')
    link.id = 'hub-read-more'
    hubBody.after(link)
  }
}
function updateReplicationMarkers() {
  const sites = replicationRecords(getSection(content.sections, 'hubs').replicationSites)
  document.querySelectorAll('.map-replica').forEach(marker => {
    const site = sites.find(item => item.siteKey === marker.dataset.siteKey)
    marker.style.display = site ? '' : 'none'
    if (!site) return
    const lines = replicationMapLabels[site.siteKey]
    marker.setAttribute('aria-label', `Explore ${lines.join(' ')}`)
    marker.querySelector('title').textContent = lines.join(' ')
    setMapLabel(marker.querySelector('text'), lines)
  })
}
document.querySelectorAll('circle.replica-dot').forEach((dot, index) => {
  const key = replicationDefaults[index].siteKey
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.classList.add('map-replica')
  group.dataset.siteKey = key
  group.dataset.countryId = dot.dataset.countryId
  group.setAttribute('role', 'button'); group.setAttribute('tabindex', '0'); group.setAttribute('aria-pressed', 'false')
  const halo = document.createElementNS(group.namespaceURI, 'circle')
  halo.classList.add('map-halo'); halo.setAttribute('cx', dot.getAttribute('cx')); halo.setAttribute('cy', dot.getAttribute('cy')); halo.setAttribute('r', '13')
  const hit = document.createElementNS(group.namespaceURI, 'circle')
  hit.classList.add('map-hit'); hit.setAttribute('cx', dot.getAttribute('cx')); hit.setAttribute('cy', dot.getAttribute('cy')); hit.setAttribute('r', '22')
  dot.replaceWith(group); group.append(hit, halo, dot)
  const [dx, dy, anchor] = replicationMapOffsets[key]
  const label = document.createElementNS(group.namespaceURI, 'text')
  label.setAttribute('x', String(Number(dot.getAttribute('cx')) + dx))
  label.setAttribute('y', String(Number(dot.getAttribute('cy')) + dy))
  label.setAttribute('text-anchor', anchor)
  group.append(label)
  group.addEventListener('click', () => updateReplication(key))
  group.addEventListener('keydown', event => {if (['Enter', ' '].includes(event.key)) {event.preventDefault(); updateReplication(key)}})
})
// Explicit country IDs also work for coastal capitals and small islands.
const regionMap = document.querySelector('.region-map')
const countryPaths = [...regionMap.querySelectorAll('.map-country')]
const mapNavigation = createPilotMapNavigation(regionMap)
const mapPreview = createPilotMapPreview(regionMap, () => pilotGroups(content, getSection(content.sections, 'hubs')).flatMap(group => group.items))
document.querySelectorAll('.map-hub,.map-replica').forEach(marker => {
  const key = marker.classList.contains('map-hub') ? `hub:${marker.dataset.hub}` : `rs:${marker.dataset.siteKey}`
  const polygon = countryPaths.find(path => path.dataset.countryId === marker.dataset.countryId)
  if (polygon) {pilotPolygons.set(key, polygon); polygon.dataset.pilotArea = key}
})
function highlightPilotArea(key) {
  countryPaths.forEach(path => path.classList.toggle('pilot-area-selected', path === pilotPolygons.get(key)))
  const marker = key.startsWith('hub:') ? regionMap.querySelector(`.map-hub[data-hub="${key.slice(4)}"]`) : regionMap.querySelector(`.map-replica[data-site-key="${key.slice(3)}"]`)
  mapNavigation.reveal(marker)
}
highlightPilotArea('hub:0')
const selectedLegend = document.createElement('span')
const selectedKey = document.createElement('i')
selectedKey.className = 'selected-pilot-key'
selectedLegend.append(selectedKey, document.createTextNode('Selected pilot'))
document.querySelector('.map-legend').append(selectedLegend)
document.addEventListener('select-replication', event => updateReplication(event.detail))
document.querySelectorAll('.hub').forEach(button => button.addEventListener('click', () => updateHub(Number(button.dataset.hub))))
window.addEventListener('hashchange', routeDetail)
document.addEventListener('click', event => {
  const link = event.target.closest('#news-detail a[href^="#news/"]')
  if (link) {previousHash = location.hash.startsWith('#news/') ? '' : location.hash; opener = link}
})

let loading = false
async function refresh() {
  if (!isConfigured || loading) return
  loading = true
  status.textContent = 'Loading latest content…'
  try {
    content = await fetchContent()
    renderSections(content.sections)
    renderNews()
    renderOutcomes()
    updateReplicationMarkers()
    if (selectedReplication) updateReplication(selectedReplication)
    else updateHub(Number(document.querySelector('.hub.active')?.dataset.hub || 0))
    renderPages(content, richText, downloadLinks)
    mapPreview.refresh()
    status.textContent = ''
    routeDetail()
  } catch {
    content.status = 'error'
    renderPages(content, richText, downloadLinks)
    status.replaceChildren(document.createTextNode('Latest content is temporarily unavailable. '))
    const retry = element('button', 'text-link', 'Try again')
    retry.type = 'button'
    retry.addEventListener('click', refresh)
    status.append(retry)
  } finally {loading = false}
}
renderSections([])
updateReplicationMarkers()
renderPages(content, richText, downloadLinks)
// The requested page is selected before exposing the shared HTML shell.
document.documentElement.removeAttribute('data-page-loading')
refresh()
// Revalidate when visitors return and once a minute so publishing needs no frontend rebuild.
document.addEventListener('visibilitychange', () => {if (document.visibilityState === 'visible') refresh()})
setInterval(() => {if (document.visibilityState === 'visible') refresh()}, 60000)
