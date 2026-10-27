import {pilotPath} from './pilot-routes.js'
import {hubKeys} from '../scripts/hub-content.mjs'

export function createPilotMapPreview(svg, getRecords) {
  const panel = svg.closest('.map-panel')
  const preview = document.createElement('aside')
  preview.id = 'pilot-map-preview'
  preview.className = 'pilot-map-preview'
  preview.hidden = true
  preview.setAttribute('aria-label', 'Site overview')
  const close = document.createElement('button')
  close.type = 'button'; close.className = 'pilot-preview-close'; close.textContent = '×'
  close.setAttribute('aria-label', 'Close site overview')
  const category = document.createElement('p'); category.className = 'eyebrow'
  const title = document.createElement('h3')
  const summary = document.createElement('p'); summary.className = 'pilot-preview-summary'
  const link = document.createElement('a'); link.className = 'text-link'
  preview.append(close, category, title, summary, link)
  panel.append(preview)
  let activeMarker, timer, suppressFocus = false
  const hide = () => {
    clearTimeout(timer)
    preview.hidden = true
    activeMarker?.setAttribute('aria-expanded', 'false')
    svg.querySelectorAll('.map-country-preview').forEach(country => country.classList.remove('map-country-preview'))
  }
  const dismiss = () => {
    const returnFocus = preview.contains(document.activeElement)
    hide()
    if (returnFocus && activeMarker) {suppressFocus = true; activeMarker.focus(); suppressFocus = false}
  }
  const scheduleHide = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!preview.contains(document.activeElement) && document.activeElement !== activeMarker) hide()
    }, 180)
  }
  const show = marker => {
    if (suppressFocus || !document.body.classList.contains('hubs-overview-page')) return
    const key = marker.classList.contains('map-hub') ? hubKeys[Number(marker.dataset.hub)] : marker.dataset.siteKey
    const item = getRecords().find(record => record.hubKey === key)
    if (!item) return
    hide(); activeMarker = marker
    marker.setAttribute('aria-expanded', 'true')
    category.textContent = `${item.pilotType === 'drmih' ? 'DRMIH' : 'Replication site'} · ${item.country}`
    title.textContent = item.title
    summary.textContent = item.summary || ''
    link.textContent = `Explore ${item.title} →`; link.href = pilotPath(item)
    preview.hidden = false
    const dot = marker.querySelector('.map-dot,.replica-dot').getBoundingClientRect()
    const bounds = panel.getBoundingClientRect()
    const x = dot.x + dot.width / 2 - bounds.x, y = dot.y + dot.height / 2 - bounds.y
    const left = x + 22 + preview.offsetWidth <= bounds.width - 12 ? x + 22 : x - preview.offsetWidth - 22
    preview.style.left = `${Math.max(12, Math.min(bounds.width - preview.offsetWidth - 12, left))}px`
    preview.style.top = `${Math.max(12, Math.min(bounds.height - preview.offsetHeight - 12, y - preview.offsetHeight / 2))}px`
    svg.querySelector(`.map-country[data-country-id="${marker.dataset.countryId}"]`)?.classList.add('map-country-preview')
  }
  for (const marker of svg.querySelectorAll('.map-hub,.map-replica')) {
    marker.setAttribute('aria-controls', preview.id)
    marker.setAttribute('aria-expanded', 'false')
    marker.addEventListener('pointerenter', () => show(marker))
    marker.addEventListener('pointerleave', scheduleHide)
    marker.addEventListener('focus', () => show(marker))
    marker.addEventListener('blur', scheduleHide)
    marker.addEventListener('click', () => show(marker))
    marker.addEventListener('keydown', event => {
      if (event.key === 'Escape') {hide(); event.stopPropagation()}
      if (event.key === 'Tab' && !event.shiftKey && !preview.hidden && activeMarker === marker) {
        event.preventDefault(); link.focus()
      }
    })
  }
  close.addEventListener('click', dismiss)
  preview.addEventListener('pointerenter', () => clearTimeout(timer))
  preview.addEventListener('pointerleave', scheduleHide)
  preview.addEventListener('focusout', scheduleHide)
  preview.addEventListener('keydown', event => {
    if (event.key === 'Escape') {event.preventDefault(); dismiss()}
    if (event.key === 'Tab' && event.shiftKey && event.target === link) {event.preventDefault(); activeMarker?.focus()}
  })
  // Keep previews attached to their actual marker position after navigation.
  new MutationObserver(hide).observe(svg, {attributes: true, attributeFilter: ['viewBox']})
  window.addEventListener('resize', hide)
  document.addEventListener('fullscreenchange', hide)
  return {refresh: () => {if (!preview.hidden && activeMarker) show(activeMarker)}}
}
