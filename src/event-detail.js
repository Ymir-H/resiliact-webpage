import {h, displayDate, externalLink} from './news-page.js'
import {eventTime} from './events-page.js'
import {dateKey, eventPath} from './news-routes.js'
import {safeUrl} from './content.js'

export function EventDetail({item, events, richText, downloadLinks}) {
  const ended = new Date(item.endsAt || item.startsAt) < new Date()
  const image = safeUrl(item.imageUrl)
  const related = [...events].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)).filter(event => event._id !== item._id).slice(0, 3)
  return h('div', {className: 'wrap news-page event-detail-page'},
    h('a', {href: '/events/', className: 'text-link event-back-link'}, '← All Events'),
    ended && h('p', {className: 'past-event-notice'}, 'This event has passed.'),
    h('div', {className: 'event-detail-layout'},
      h('article', {className: 'event-story'},
        h('header', {className: 'event-hero'},
          image && h('img', {className: 'event-hero-image', src: image, alt: item.heroImage?.alt || ''}),
          h('div', {className: 'event-hero-heading'}, h('p', {className: 'eyebrow'}, item.category || 'EVENT'),
            h('h1', {className: 'page-title'}, item.title), h('p', {className: 'event-hero-time'}, eventTime(item)))),
        (item.heroImage?.caption || item.heroImage?.credit) && h('p', {className: 'event-image-caption'}, [item.heroImage.caption, item.heroImage.credit].filter(Boolean).join(' · ')),
        h('p', {className: 'article-summary'}, item.summary),
        h('div', {className: 'article-body'}, richText(item.body)), downloadLinks(item),
        safeUrl(item.website) && h('div', {className: 'event-official-link'}, externalLink(item.registrationLabel || 'Event details and registration', item.website, 'button'))),
      h('aside', {className: 'event-practical', 'aria-labelledby': 'event-information-title'},
        h('h2', {id: 'event-information-title'}, 'Practical information'),
        h('section', null, h('h3', null, 'Details'), h('dl', null,
          h('dt', null, 'Date'), h('dd', null, displayDate(item.startsAt), item.endsAt && dateKey(item.endsAt) !== dateKey(item.startsAt) ? ` – ${displayDate(item.endsAt)}` : ''),
          h('dt', null, 'Date and time'), h('dd', null, eventTime(item)),
          item.category && h('dt', null, 'Event category'), item.category && h('dd', null, item.category))),
        (item.location || item.address) && h('section', null, h('h3', null, 'Venue'), h('dl', null,
          item.location && h('dt', null, 'Venue'), item.location && h('dd', null, item.location),
          item.address && h('dt', null, 'Address'), item.address && h('dd', null, item.address))),
        item.organizer && h('section', null, h('h3', null, 'Organizer'), h('p', null, item.organizer)))),
    related.length > 0 && h('nav', {className: 'post-navigation', 'aria-label': 'More events'}, ...related.map(event => h('a', {href: eventPath(event), key: event._id}, event.title))))
}
