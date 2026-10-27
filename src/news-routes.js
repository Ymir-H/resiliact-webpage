const zone = 'Europe/Oslo'
export function dateKey(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(date).map(part => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}
const slugValue = item => typeof item.slug === 'string' ? item.slug : item.slug?.current
export const eventPath = item => `/event/${encodeURIComponent(slugValue(item) || item._id)}/`
export const postPath = item => `/${dateKey(item.publishedAt).replaceAll('-', '/')}/${encodeURIComponent(slugValue(item) || item._id)}/`
export const archivePath = key => `/${key.replace('-', '/')}/`
export function newsRoute(pathname) {
  const path = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '')
  if (path === '/events') return {type: 'events', label: 'Events calendar'}
  let match = /^\/event\/([^/]+)$/.exec(path)
  if (match) {
    try {return {type: 'event', slug: decodeURIComponent(match[1]), label: 'Event'}} catch {return null}
  }
  match = /^\/(\d{4})\/(0[1-9]|1[0-2])(?:\/(0[1-9]|[12]\d|3[01])\/([^/]+))?$/.exec(path)
  if (!match) return null
  if (!match[3]) return {type: 'archive', month: `${match[1]}-${match[2]}`, label: monthLabel(`${match[1]}-${match[2]}`)}
  try {return {type: 'post', slug: decodeURIComponent(match[4]), label: 'Blog post'}} catch {return null}
}
export function monthLabel(key) {
  return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', timeZone: 'UTC'}).format(new Date(`${key}-01T12:00:00Z`))
}
