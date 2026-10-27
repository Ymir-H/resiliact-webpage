import {h, displayDate, PostCards, ArchiveLinks} from './news-page.js'
import {archivePath, dateKey, monthLabel, postPath} from './news-routes.js'
import {safeUrl} from './content.js'
import {EventDetail} from './event-detail.js'

export function articleImage(item) {
  return safeUrl(item.imageUrl) ? h('figure', {className: 'post-hero-image'},
    h('img', {src: item.imageUrl, alt: item.heroImage?.alt || ''}), (item.heroImage?.caption || item.heroImage?.credit) && h('figcaption', null, item.heroImage.caption, item.heroImage.caption && item.heroImage.credit ? ' · ' : '', item.heroImage.credit)) : null
}
export function NewsDetail({route, content, richText, downloadLinks}) {
  const records = route.type === 'event' ? content.events || [] : content.news || []
  const item = records.find(record => record.slug === route.slug || record._id === route.slug)
  if (!item) return h('div', {className: 'wrap news-page'},
    h('h1', {className: 'page-title'}, content.status === 'loading' ? 'Loading content…' : content.status === 'error' ? 'Content is temporarily unavailable' : 'Content not found'),
    h('p', null, content.status === 'error' ? 'Please reload the page to try again.' : content.status === 'loading' ? 'Fetching the latest published content.' : 'This item is unavailable or has been unpublished.'),
    h('a', {href: route.type === 'event' ? '/events/' : '/news/', className: 'text-link'}, route.type === 'event' ? 'All Events' : 'Back to News & Events'))
  const event = route.type === 'event'
  if (event) return h(EventDetail, {item, events: content.events || [], richText, downloadLinks})
  const posts = [...(content.news || [])].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  const index = posts.findIndex(post => post._id === item._id)
  const month = dateKey(item.publishedAt).slice(0, 7)
  return h('div', {className: 'wrap news-page'},
    h('a', {href: '/news/', className: 'text-link'}, 'Back to News & Events'),
    h('article', {className: 'full-post'},
      h('h1', {className: 'page-title'}, item.title),
      h('p', {className: 'article-meta'}, `${displayDate(item.publishedAt)}${item.author ? ` · ${item.author}` : ''} · Category: ${item.category || 'Blog post'}`),
      item.tags?.length > 0 && h('p', {className: 'post-tags'}, 'Topics: ', item.tags.join(' · ')),
      articleImage(item), item.byline && h('p', {className: 'post-byline'}, item.byline), h('p', {className: 'article-summary'}, item.summary),
      h('div', {className: 'article-body'}, richText(item.body)), downloadLinks(item),
      h('div', {className: 'post-month-link'}, h('a', {href: archivePath(month), className: 'text-link'}, `More posts from ${monthLabel(month)}`))),
      h('nav', {className: 'post-navigation', 'aria-label': 'Other blog posts'},
        posts[index + 1] && h('a', {href: postPath(posts[index + 1])}, `← Older post: ${posts[index + 1].title}`),
        posts[index - 1] && h('a', {href: postPath(posts[index - 1])}, `Newer post: ${posts[index - 1].title} →`)))
}
export function BlogArchive({month, articles = []}) {
  const posts = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  const selected = posts.filter(post => dateKey(post.publishedAt).startsWith(month))
  return h('div', {className: 'wrap news-page'}, h('p', {className: 'eyebrow'}, 'BLOG ARCHIVE'),
    h('h1', {className: 'page-title'}, monthLabel(month)), h('p', {className: 'news-page-intro'}, `${selected.length} published ${selected.length === 1 ? 'post' : 'posts'}`),
    h('a', {href: '/news/', className: 'text-link'}, 'All blog posts'),
    h('div', {className: 'blog-layout archive-layout'}, h(PostCards, {posts: selected}), h(ArchiveLinks, {posts, selected: month})))
}
