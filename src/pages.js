import React from 'react'
import {createRoot} from 'react-dom/client'
import {getSection} from './sections.js'
import {pageRoutes, pageLink} from './page-routes.js'
import {ProjectPage} from './project-page.js'
import {NewsPage} from './news-page.js'
import {ConsortiumPage} from './consortium-page.js'
import {EventsPage} from './events-page.js'
import {BlogArchive, NewsDetail} from './news-detail.js'
import {newsRoute, postPath} from './news-routes.js'
import {pilotGroups, pilotRoute} from './pilot-routes.js'
import {PilotCards, PilotDetail} from './pilot-pages.js'
import {PlatformSection} from './platform-section.js'

const main = document.getElementById('main')
const summaries = document.createElement('div')
summaries.className = 'home-summaries'
main.append(summaries)
const breadcrumb = document.createElement('nav')
breadcrumb.className = 'wrap page-breadcrumb'
breadcrumb.setAttribute('aria-label', 'Breadcrumb')
main.prepend(breadcrumb)
const notFound = document.createElement('div')
notFound.className = 'wrap page-not-found'
main.append(notFound)
const extraRoots = new Map()
const projectPage = document.createElement('div')
projectPage.id = 'project-detail'
projectPage.className = 'wrap project-detail'
main.insertBefore(projectPage, summaries)
const projectRoot = createRoot(projectPage)
const newsPage = document.createElement('div')
newsPage.id = 'news-detail'
main.insertBefore(newsPage, summaries)
const newsRoot = createRoot(newsPage)
const consortiumPage = document.createElement('div')
consortiumPage.id = 'consortium-detail'
main.insertBefore(consortiumPage, summaries)
const consortiumRoot = createRoot(consortiumPage)
const pilotPage = document.createElement('div')
pilotPage.id = 'pilot-detail'
main.insertBefore(pilotPage, summaries)
const pilotRoot = createRoot(pilotPage)
const pilotCards = document.createElement('div')
pilotCards.id = 'pilot-cards'
document.getElementById('regions').append(pilotCards)
const cardsRoot = createRoot(pilotCards)
const outcomesPlatform = document.createElement('div')
outcomesPlatform.id = 'outcomes-platform'
document.querySelector('#outcomes > .wrap > .outcome-grid').after(outcomesPlatform)
const platformRoot = createRoot(outcomesPlatform)
let contactAnchorStage = 0
const element = (tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}
function anchor(label, href, className = 'text-link') {
  const link = element('a', className, label)
  link.href = href
  return link
}
function excerpt(doc) {
  if (doc.projectDetails?.aboutText?.length) return doc.projectDetails.aboutText[0]
  return doc.homeSummary || doc.lead || doc.intro || (doc._type === 'newsPage' ? 'Follow the latest project news, events and milestones from the RESILIACT partnership.' : '')
}
export function renderPages(content, richText, downloadLinks) {
  const moved = pageRoutes.find(route => route.movedTo && route.path.replace(/\/$/, '') === location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, ''))
  if (moved) history.replaceState(null, '', moved.movedTo)
  const path = location.pathname.replace(/\/+$/, '') || '/'
  if (['/project', '/project/index.html'].includes(path) && location.hash === '#project-platform') {
    location.replace('/outcomes/#resiliact-platform')
    return
  }
  const detailRoute = newsRoute(path)
  const siteRoute = pilotRoute(path)
  const current = siteRoute ? pageRoutes.find(route => route.key === 'hubs') : detailRoute ? pageRoutes.find(route => route.key === 'news') : pageRoutes.find(route => route.dedicated !== false && route.path.replace(/\/$/, '') === path)
  const home = path === '/' || path === '/index.html'
  document.body.classList.toggle('section-page', !home)
  document.querySelector('#home').hidden = !home
  document.querySelector('.project-facts').hidden = !home
  summaries.hidden = !home
  breadcrumb.hidden = home
  notFound.hidden = home || Boolean(current)
  const records = content.sections || []
  const groups = pilotGroups(content, getSection(records, 'hubs'))
  const site = siteRoute && groups.flatMap(group => group.items).find(item => item.slug === siteRoute.slug || item.hubKey === siteRoute.slug)
  const hubsOverview = current?.key === 'hubs' && !siteRoute
  document.body.classList.toggle('hubs-overview-page', hubsOverview)
  pilotPage.hidden = !siteRoute
  pilotRoot.render(siteRoute ? React.createElement(PilotDetail, {item: site, content, richText, downloadLinks}) : null)
  pilotCards.hidden = !hubsOverview
  cardsRoot.render(hubsOverview ? React.createElement(PilotCards, {groups}) : null)
  const sharedHomeSections = new Set(['hubs', 'news', 'contact'])
  // Home and the dedicated pages use the same published sections.
  if (!home) for (const route of pageRoutes.filter(route => sharedHomeSections.has(route.key))) {
    const section = document.querySelector(route.selector)
    if (summaries.contains(section)) main.insertBefore(section, projectPage)
  }
  const project = getSection(records, 'project')
  const homeProject = getSection(records, 'home').projectOverview || (project.lead ? project : getSection([], 'project'))
  projectPage.hidden = current?.key !== 'project'
  projectRoot.render(current?.key === 'project' ? React.createElement(ProjectPage, {document: getSection(records, 'project'), consortium: getSection(records, 'consortium'), richText, downloadLinks}) : null)
  platformRoot.render(current?.key === 'outcomes' ? React.createElement(PlatformSection, {document: getSection(records, 'platform'), richText, downloadLinks}) : null)
  newsPage.hidden = current?.key !== 'news'
  consortiumPage.hidden = current?.key !== 'consortium'
  consortiumRoot.render(current?.key === 'consortium' ? React.createElement(ConsortiumPage, {document: getSection(records, 'consortium'), richText, downloadLinks}) : null)
  const newsProps = {document: getSection(records, 'news'), articles: content.news, events: content.events, content, richText, downloadLinks}
  newsRoot.render(current?.key !== 'news' ? null : detailRoute?.type === 'events' ? React.createElement(EventsPage, newsProps) :
    detailRoute?.type === 'archive' ? React.createElement(BlogArchive, {...newsProps, month: detailRoute.month}) :
    detailRoute ? React.createElement(NewsDetail, {...newsProps, route: detailRoute}) : React.createElement(NewsPage, newsProps))
  for (const container of document.querySelectorAll('#navigation')) {
    for (const link of container.querySelectorAll('a')) {
      const route = pageRoutes.find(item => item.path === pageLink(link.getAttribute('href')))
      if (route) {link.href = route.path; link.textContent = getSection(records, route.key).navigationLabel}
      if ((home && link.getAttribute('href') === '/') || (current && route === current)) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    }
  }
  document.querySelector('.brand').href = '/'
  document.querySelector('.footer-bottom a[href="#home"]')?.setAttribute('href', '/')
  // Convert old section anchors to the corresponding page, including CMS action buttons.
  for (const link of document.querySelectorAll('a[href^="#"], a[href^="/contact"], a[href^="/platform"], a[href^="/consortium"]')) {
    const href = link.getAttribute('href')
    const mapped = pageLink(href)
    if (mapped !== href) link.setAttribute('href', mapped)
  }
  summaries.replaceChildren(...pageRoutes.filter(route => !['platform', 'outcomes', 'consortium'].includes(route.key)).map(route => {
    if (sharedHomeSections.has(route.key) && home) {
      const section = document.querySelector(route.selector)
      const className = `${route.key}-page-link`
      if (route.key !== 'contact' && !section.querySelector(`.${className}`)) section.append(anchor(route.key === 'hubs' ? 'Explore RESILIACT Hubs' : 'Visit News and Events', route.path, `text-link ${className}`))
      return section
    }
    if (route.key === 'project') {
      const overview = document.getElementById('about')
      let link = overview.querySelector('.project-page-link')
      if (!link) {link = anchor('About the project, timeline and research community', '/project/', 'text-link project-page-link'); overview.querySelector('.about-content').append(link)}
      return overview
    }
    const doc = getSection(records, route.key)
    const section = element('section', `home-summary summary-${route.key}`)
    const wrap = element('div', 'wrap summary-layout')
    const title = element('div')
    title.append(element('p', 'eyebrow', doc.eyebrow), element('h2', 'cms-heading', doc.heading))
    const copy = element('div')
    copy.append(element('p', '', excerpt(doc)), anchor(`Explore ${doc.navigationLabel}`, route.path))
    if (route.key === 'news' && content.news?.length) {
      const latest = content.news[0]
      copy.append(anchor(latest.title, postPath(latest), 'summary-latest'))
    }
    wrap.append(title, copy)
    section.append(wrap)
    return section
  }))
  for (const route of pageRoutes) {
    const section = document.querySelector(route.selector)
    section.hidden = route.key === 'project' ? !home : sharedHomeSections.has(route.key) ? !(home || route === current) : route !== current
    if (route.key === 'hubs' && siteRoute) section.hidden = true
    if (route.key === 'news') section.hidden = !home
    if (route.key === 'consortium') section.hidden = true
    if (route === current && route.key !== 'project' && !section.querySelector('.page-title')) {
      const heading = section.querySelector('h2')
      const title = element('h1', 'page-title cms-heading', route.pageTitle || heading.textContent)
      heading.replaceWith(title)
    }
    if (route === current && route.pageTitle) section.querySelector('.page-title').textContent = route.pageTitle
    const doc = getSection(records, route.key)
    if (route.key === 'platform') section.style.setProperty('--platform-heading-color', ['#ffffff', '#76dfe8', '#d5e6ed'].includes(doc.headingColor) ? doc.headingColor : '#ffffff')
    if (!extraRoots.has(route.key)) {
      const extra = element('div', route.key === 'contact' ? 'wrap page-extra article-body' : 'page-extra article-body')
      const parent = route.key === 'contact' ? section : section.querySelector(':scope > .wrap') || section
      parent.append(extra)
      extraRoots.set(route.key, createRoot(extra))
    }
    const extraDoc = route.key === 'project' ? homeProject : doc
    extraRoots.get(route.key).render(React.createElement(React.Fragment, null, richText(extraDoc.pageBody), downloadLinks({attachments: extraDoc.pageAttachments})))
  }
  if (home) {
    const stage = records.length ? 2 : 1
    if (location.hash === '#contact' && stage > contactAnchorStage) {
      contactAnchorStage = stage
      requestAnimationFrame(() => document.getElementById('contact').scrollIntoView())
    }
    return
  }
  if (!current) {
    breadcrumb.replaceChildren(anchor('Home', '/'), element('span', '', 'Page not found'))
    notFound.replaceChildren(element('h1', '', 'Page not found'), anchor('Return to the homepage', '/'))
    document.title = 'Page not found | RESILIACT'
    return
  }
  const doc = getSection(records, current.key)
  if (current.key === 'project' && location.hash === '#project-consortium') {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView())
  }
  const pageTitle = siteRoute ? site?.title || (content.status === 'loading' ? 'Loading site…' : content.status === 'error' ? 'Site unavailable' : 'Site not found') : current.pageTitle || doc.navigationLabel
  breadcrumb.replaceChildren(anchor('Home', '/', ''), element('span', '', '/'), element('span', '', pageTitle))
  if (siteRoute) breadcrumb.replaceChildren(anchor('Home', '/', ''), element('span', '', '/'), anchor('RESILIACT hubs', '/innovation-hubs/', ''), element('span', '', '/'), element('span', '', pageTitle))
  const detailItem = detailRoute && (detailRoute.type === 'event' ? content.events || [] : content.news || []).find(item => item.slug === detailRoute.slug || item._id === detailRoute.slug)
  if (detailRoute) breadcrumb.replaceChildren(anchor('Home', '/', ''), element('span', '', '/'), anchor('News & Events', '/news/', ''),
    element('span', '', '/'), ...(detailRoute.type === 'event' ? [anchor('Events', '/events/', ''), element('span', '', '/')] : []), element('span', '', detailItem?.title || detailRoute.label))
  document.title = `${detailItem?.title || detailRoute?.label || pageTitle} | RESILIACT`
  document.querySelector('meta[name="description"]').content = site?.summary || detailItem?.summary || excerpt(doc)
}
