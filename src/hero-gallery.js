import {safeUrl} from './content.js'
import {heroMediaDefaults} from '../scripts/hero-media.mjs'
import './hero-gallery.css'

const hero = document.querySelector('#home')
const original = hero.querySelector('.hero-photo')
const layer = document.createElement('div')
layer.className = 'hero-gallery-media'
hero.prepend(layer)
original.remove()
const panel = document.createElement('div')
panel.className = 'hero-gallery-panel wrap'
panel.setAttribute('role', 'group')
panel.setAttribute('aria-label', 'Homepage media gallery')
hero.append(panel)
const controls = document.createElement('div')
controls.className = 'hero-gallery-controls'
const button = (label, text, action) => {
  const node = document.createElement('button')
  node.type = 'button'
  node.setAttribute('aria-label', label)
  node.textContent = text
  node.addEventListener('click', action)
  return node
}
const previous = button('Previous hero media', '←', () => show(index - 1))
const next = button('Next hero media', '→', () => show(index + 1))
const dots = document.createElement('div')
dots.className = 'hero-gallery-dots'
const motion = matchMedia('(prefers-reduced-motion: reduce)')
let playing = !motion.matches
const toggle = button('Pause gallery', 'Pause', () => {playing = !playing; syncPlayback()})
const credit = document.createElement('div')
credit.className = 'hero-gallery-credit'
controls.append(previous, dots, next, toggle)
panel.append(controls, credit)
let items = [], index = 0, media, timer, signature, visible = true
const mediaUrl = value => /^\/assets\/[a-z0-9._/-]+$/i.test(value || '') ? value : safeUrl(value)
const durationFor = item => Number.isInteger(item?.durationSeconds) && item.durationSeconds >= 1 && item.durationSeconds <= 300 ? item.durationSeconds : undefined

function syncPlayback() {
  clearTimeout(timer)
  const active = playing && visible && !hero.hidden && !document.hidden
  toggle.textContent = playing ? 'Pause' : 'Play'
  toggle.setAttribute('aria-label', playing ? 'Pause gallery' : 'Play gallery')
  toggle.setAttribute('aria-pressed', String(playing))
  if (media?.tagName === 'VIDEO') {
    media.autoplay = active
    if (active) {
      const current = media
      current.play().catch(error => {
        if (error.name === 'AbortError' || current !== media || !visible || hero.hidden || document.hidden) return
        playing = false
        syncPlayback()
      })
    }
    else media.pause()
  } else if (active && items.length > 1) timer = setTimeout(() => show(index + 1), (durationFor(items[index]) ?? 7) * 1000)
}
function show(selected) {
  clearTimeout(timer)
  if (media?.tagName === 'VIDEO') media.pause()
  index = (selected + items.length) % items.length
  const item = items[index]
  media = document.createElement(item.mediaType === 'video' ? 'video' : 'img')
  media.className = 'hero-photo'
  if (item.mediaType === 'video') {
    media.muted = true
    media.defaultMuted = true
    media.playsInline = true
    media.loop = items.length === 1
    media.preload = 'none'
    const poster = mediaUrl(item.posterUrl)
    if (poster) media.poster = poster
    media.setAttribute('aria-label', item.alt || item.title)
    const video = media
    const duration = durationFor(item)
    if (duration) video.addEventListener('timeupdate', () => {
      if (video !== media || !playing || !visible || hero.hidden || document.hidden || video.currentTime < duration) return
      if (items.length > 1) show(index + 1)
      else video.currentTime = 0
    })
    media.addEventListener('ended', () => {
      if (playing && items.length > 1) show(index + 1)
      else {playing = false; syncPlayback()}
    })
    media.addEventListener('error', () => {playing = false; syncPlayback()})
  } else {
    media.alt = item.alt || item.title || ''
    media.fetchPriority = 'high'
  }
  media.src = mediaUrl(item.mediaUrl)
  layer.replaceChildren(media)
  for (const [position, dot] of [...dots.children].entries()) {
    dot.setAttribute('aria-current', String(position === index))
  }
  const activeDot = dots.children[index]
  if (activeDot) {
    const left = activeDot.offsetLeft
    if (left < dots.scrollLeft || left + activeDot.offsetWidth > dots.scrollLeft + dots.clientWidth) dots.scrollLeft = left - dots.clientWidth / 2
  }
  credit.replaceChildren()
  if (item.credit) {
    const url = safeUrl(item.creditUrl)
    const node = document.createElement(url ? 'a' : 'span')
    node.textContent = item.credit
    if (url) {node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'}
    credit.append(node)
  }
  syncPlayback()
}
export function renderHeroGallery(home) {
  const records = Array.isArray(home.heroGallery) ? home.heroGallery : heroMediaDefaults.map((item, position) =>
    position === 0 ? {...item, mediaUrl: safeUrl(home.imageUrl) || item.mediaUrl, alt: home.imageAlt || item.alt} : item)
  let valid = records.filter(item => ['image', 'video'].includes(item.mediaType) && mediaUrl(item.mediaUrl))
  if (!valid.length) valid = [{...heroMediaDefaults[0], mediaUrl: safeUrl(home.imageUrl) || heroMediaDefaults[0].mediaUrl}]
  const serialized = JSON.stringify(valid)
  if (serialized === signature) return
  signature = serialized
  items = valid
  dots.replaceChildren(...items.map((item, position) => button(`Show ${item.title || `media ${position + 1}`}`, '', () => show(position))))
  previous.hidden = next.hidden = dots.hidden = items.length < 2
  show(0)
}
new MutationObserver(syncPlayback).observe(hero, {attributes: true, attributeFilter: ['hidden']})
new IntersectionObserver(entries => {visible = entries[0].isIntersecting; syncPlayback()}, {threshold: 0}).observe(hero)
document.addEventListener('visibilitychange', syncPlayback)
motion.addEventListener('change', event => {playing = !event.matches; syncPlayback()})
