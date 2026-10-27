import {useState} from 'react'
import {h, displayDate} from './news-page.js'
import {dateKey, eventPath, monthLabel} from './news-routes.js'
import {safeUrl} from './content.js'
import './event-calendar.css'

export const eventOnDay = (event, day) => dateKey(event.startsAt) <= day && dateKey(event.endsAt || event.startsAt) >= day
export function eventTime(event) {
  const format = value => new Intl.DateTimeFormat('en-GB', {dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Oslo'}).format(new Date(value))
  return `${format(event.startsAt)}${event.endsAt ? ` – ${format(event.endsAt)}` : ''} (Europe/Oslo)`
}
function EventList({events}) {
  return events.length ? h('div', {className: 'event-list'}, ...events.map(event => h('article', {className: 'event-list-entry', key: event._id},
    h('time', {className: 'event-date-badge', dateTime: event.startsAt, 'aria-label': displayDate(event.startsAt)},
      h('span', {className: 'event-date-month'}, new Intl.DateTimeFormat('en-GB', {month: 'short', timeZone: 'Europe/Oslo'}).format(new Date(event.startsAt))),
      h('strong', null, dateKey(event.startsAt).slice(8)), h('span', {className: 'event-date-year'}, dateKey(event.startsAt).slice(0, 4))),
    h('div', {className: 'event-list-copy'}, h('p', {className: 'article-meta'}, eventTime(event)), h('h3', null, h('a', {href: eventPath(event)}, event.title)),
      event.location && h('p', {className: 'event-location'}, event.location), h('p', null, event.summary),
      h('a', {href: eventPath(event), className: 'text-link'}, 'View event')),
    safeUrl(event.imageUrl) && h('a', {className: 'event-list-image', href: eventPath(event), tabIndex: -1, 'aria-hidden': true}, h('img', {src: safeUrl(event.imageUrl), alt: '', loading: 'lazy'}))))) : h('p', {className: 'news-empty', role: 'status'}, 'No events match this selection.')
}
export function EventsPage({events = [], document: doc}) {
  const today = dateKey(new Date())
  const [keyword, setKeyword] = useState('')
  const [view, setView] = useState('list')
  const [day, setDay] = useState(today)
  const [period, setPeriod] = useState('all')
  const month = day.slice(0, 7)
  const filtered = events.filter(event => `${event.title} ${event.summary} ${event.location || ''}`.toLowerCase().includes(keyword.toLowerCase()))
    .filter(event => period === 'all' || (period === 'upcoming' ? dateKey(event.endsAt || event.startsAt) >= today : dateKey(event.endsAt || event.startsAt) < today))
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
  const changePeriod = direction => {
    const date = new Date(`${day}T12:00:00Z`)
    if (view === 'month') {date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + direction)}
    else date.setUTCDate(date.getUTCDate() + direction)
    setDay(date.toISOString().slice(0, 10))
  }
  const first = new Date(`${month}-01T12:00:00Z`)
  const offset = (first.getUTCDay() + 6) % 7
  const days = new Date(first.getUTCFullYear(), first.getUTCMonth() + 1, 0).getDate()
  const cells = Array.from({length: Math.ceil((days + offset) / 7) * 7}, (_, index) => {
    const number = index - offset + 1
    if (number < 1 || number > days) return h('td', {key: index, className: 'calendar-blank'})
    const key = `${month}-${String(number).padStart(2, '0')}`
    const matches = filtered.filter(event => eventOnDay(event, key))
    return h('td', {key, className: key === today ? 'calendar-today' : ''},
      h('button', {type: 'button', className: 'calendar-day-number', 'aria-label': `View events on ${displayDate(`${key}T12:00:00Z`)}`, onClick: () => {setDay(key); setView('day')}}, number),
      ...matches.map(event => h('a', {key: event._id, className: 'calendar-event', href: eventPath(event)}, event.title)))
  })
  const upcoming = filtered.filter(event => dateKey(event.endsAt || event.startsAt) >= today)
  const past = filtered.filter(event => dateKey(event.endsAt || event.startsAt) < today).reverse()
  return h('div', {className: 'wrap news-page'}, h('p', {className: 'eyebrow'}, 'NEWS & EVENTS'), h('h1', {className: 'page-title'}, doc.calendarHeading || 'Events calendar'),
    h('p', {className: 'news-page-intro'}, doc.calendarIntro || 'Find RESILIACT meetings, workshops and community events.'),
    h('a', {href: '/news/', className: 'text-link'}, 'Back to News & Events'),
    h('div', {className: 'calendar-controls'},
      h('label', null, 'Search events', h('input', {type: 'search', value: keyword, placeholder: 'Keyword or location', onChange: event => setKeyword(event.target.value)})),
      h('label', null, 'Event period', h('select', {value: period, onChange: event => setPeriod(event.target.value)}, ...['all', 'upcoming', 'past'].map(value => h('option', {value, key: value}, `${value[0].toUpperCase()}${value.slice(1)} events`)))),
      h('div', {className: 'calendar-views', role: 'group', 'aria-label': 'Event view'}, ...['list', 'month', 'day'].map(value => h('button', {key: value, type: 'button', 'aria-pressed': view === value, onClick: () => setView(value)}, value[0].toUpperCase() + value.slice(1))))),
    view !== 'list' && h('div', {className: 'calendar-date-controls'},
      h('button', {type: 'button', onClick: () => changePeriod(-1), 'aria-label': `Previous ${view}`}, '←'),
      h('button', {type: 'button', onClick: () => setDay(today)}, 'Today'),
      h('label', null, 'Select date', h('input', {type: 'date', value: day, onChange: event => {if (event.target.value) setDay(event.target.value)}})),
      h('button', {type: 'button', onClick: () => changePeriod(1), 'aria-label': `Next ${view}`}, '→')),
    h('div', {className: 'calendar-results'},
      view === 'list' ? h('div', null,
        period !== 'past' && h('section', null, h('h2', null, 'Upcoming Events'), h(EventList, {events: upcoming})),
        period !== 'upcoming' && h('section', null, h('h2', null, 'Latest Past Events'), h(EventList, {events: past}))) :
      view === 'day' ? h('section', null, h('h2', null, displayDate(`${day}T12:00:00Z`)), h(EventList, {events: filtered.filter(event => eventOnDay(event, day))})) :
      h('div', {className: 'calendar-table-scroll'}, h('table', {className: 'calendar-table'}, h('caption', null, monthLabel(month)),
        h('thead', null, h('tr', null, ...['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => h('th', {key: label, scope: 'col'}, label)))),
        h('tbody', null, ...Array.from({length: cells.length / 7}, (_, row) => h('tr', {key: row}, ...cells.slice(row * 7, row * 7 + 7))))))))
}
