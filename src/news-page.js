import React from 'react'
import {safeUrl} from './content.js'
import {archivePath, dateKey, monthLabel, postPath} from './news-routes.js'
import './news-page.css'

export const h = React.createElement
export const displayDate = value => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo'}).format(parsed)
}
export const externalLink = (label, value, className) => {
  const href = safeUrl(value)
  return href ? h('a', {href, className, target: '_blank', rel: 'noopener noreferrer'}, label) : h('span', null, label)
}
export function PostCards({posts}) {
  return posts.length ? h('div', {className: 'blog-cards'}, ...posts.map(item => h('article', {className: 'blog-card', key: item._id},
    h('a', {href: postPath(item), className: 'blog-card-image', tabIndex: -1, 'aria-hidden': true},
      h('img', {src: safeUrl(item.imageUrl) || '/assets/resilience-landscape.jpg', alt: '', loading: 'lazy'})),
    h('div', {className: 'blog-card-copy'}, h('p', {className: 'article-meta'}, h('time', {dateTime: item.publishedAt}, displayDate(item.publishedAt)), ' · ', item.category || 'Project news'),
      h('h3', null, h('a', {href: postPath(item)}, item.title)), h('p', null, item.summary), h('a', {className: 'text-link', href: postPath(item)}, 'Read article'))))) :
    h('p', {className: 'news-empty'}, 'No blog posts have been published for this period.')
}
export function ArchiveLinks({posts, selected}) {
  const months = new Map()
  for (const post of posts) {
    const key = dateKey(post.publishedAt).slice(0, 7)
    if (key) months.set(key, (months.get(key) || 0) + 1)
  }
  const years = [...new Set([...months.keys()].map(key => key.slice(0, 4)))].sort().reverse()
  return h('aside', {className: 'blog-archives', 'aria-label': 'Blog archives'}, h('h2', null, 'Archives'),
    years.length ? years.map(year => h('div', {key: year}, h('h3', null, year),
      h('ul', null, ...[...months.keys()].filter(key => key.startsWith(year)).sort().reverse().map(key => h('li', {key},
        h('a', {href: archivePath(key), 'aria-current': key === selected ? 'page' : undefined}, `${monthLabel(key)} (${months.get(key)})`)))))) : h('p', null, 'Archives appear when posts are published.'))
}
export function NewsPage({document: doc, articles = [], richText, downloadLinks}) {
  const media = [...(doc.mediaLinks || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const posts = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  return h('div', {className: 'wrap news-page'},
    h('div', {className: 'news-page-header'}, h('p', {className: 'eyebrow'}, doc.eyebrow || 'NEWS & EVENTS'),
      h('h1', {className: 'page-title'}, doc.pageHeading || 'News & Events'),
      h('p', {className: 'news-page-intro'}, doc.intro || doc.homeSummary || 'Follow the latest news, events and stories from RESILIACT.')),
    h('section', {className: 'news-page-block', 'aria-labelledby': 'events-heading'},
      h('h2', {id: 'events-heading'}, doc.eventsHeading || 'Events calendar'),
      h('p', null, doc.eventsIntro || 'Meet the RESILIACT community at project meetings, workshops and public events.'),
      h('a', {href: '/events/', className: 'button'}, doc.calendarButtonLabel || 'Go to the events calendar')),
    h('section', {className: 'news-page-block', 'aria-labelledby': 'media-heading'},
      h('h2', {id: 'media-heading'}, doc.newsHeading || 'News'), h('p', null, doc.newsIntro || 'RESILIACT in the news and across our partner networks.'),
      media.length ? h('ul', {className: 'media-news-list'}, ...media.map(item => h('li', {key: item._key},
        externalLink(item.title, item.url), item.date && h('span', null, ' — ', h('time', {dateTime: item.date}, displayDate(item.date))), item.source && h('span', null, ` (${item.source})`)))) :
        h('p', {className: 'news-empty'}, 'Media and partner news links will be added here.')),
    h('section', {className: 'news-page-block', 'aria-labelledby': 'blog-heading'},
      h('h2', {id: 'blog-heading'}, doc.blogHeading || 'Blog Posts'), h('p', null, doc.blogIntro || 'Project updates, reflections and stories from the RESILIACT partnership.'),
      h('div', {className: 'blog-layout'}, h(PostCards, {posts}), h(ArchiveLinks, {posts}))),
    h('div', {className: 'page-extra article-body'}, richText(doc.pageBody), downloadLinks({attachments: doc.pageAttachments})))
}
