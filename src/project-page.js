import React, {useEffect, useState} from 'react'
import {projectDetails} from '../scripts/project-content.mjs'
import {safeUrl} from './content.js'
import researchAssets from '../scripts/research-assets.json'
import {ConsortiumPage} from './consortium-page.js'

const h = React.createElement
function Timeline({data}) {
  const steps = data.milestones || []
  const [selected, setSelected] = useState(steps[0]?._key)
  const [playing, setPlaying] = useState(false)
  const index = Math.max(0, steps.findIndex(step => step._key === selected))
  const step = steps[index]
  useEffect(() => {
    if (!playing || steps.length < 2) return
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') setSelected(steps[(index + 1) % steps.length]._key)
    }, 3500)
    return () => clearInterval(timer)
  }, [playing, index, steps])
  if (!step) return h('p', null, 'Project milestones will be added here.')
  const select = next => {setSelected(steps[next]._key); setPlaying(false)}
  return h('div', {className: 'project-timeline'},
    h('div', {className: 'timeline-track', style: {'--timeline-progress': `${steps.length > 1 ? index / (steps.length - 1) * 100 : 0}%`}},
      h('div', {className: 'timeline-tabs', role: 'tablist', 'aria-label': 'Project phases'}, ...steps.map((item, i) => h('button', {
        key: item._key, id: `phase-${item._key}`, type: 'button', role: 'tab', 'aria-selected': i === index,
        'aria-controls': 'phase-panel', tabIndex: i === index ? 0 : -1,
        className: `timeline-tab${i === index ? ' active' : ''}${i < index ? ' complete' : ''}`,
        onClick: () => select(i), onKeyDown: event => {
          let next
          if (event.key === 'ArrowRight') next = (i + 1) % steps.length
          if (event.key === 'ArrowLeft') next = (i - 1 + steps.length) % steps.length
          if (event.key === 'Home') next = 0
          if (event.key === 'End') next = steps.length - 1
          if (next == null) return
          event.preventDefault(); select(next)
          event.currentTarget.parentElement.children[next].focus()
        },
      }, h('span', {className: 'timeline-dot'}, String(i + 1).padStart(2, '0')), h('span', null, item.label))))),
    h('div', {id: 'phase-panel', className: 'timeline-panel', role: 'tabpanel', 'aria-labelledby': `phase-${step._key}`, tabIndex: 0},
      h('div', {key: step._key, className: 'timeline-panel-copy', 'aria-live': 'polite'},
        h('p', {className: 'eyebrow'}, step.dateLabel), h('h3', null, step.title), h('p', null, step.description))),
    h('div', {className: 'timeline-controls'},
      h('button', {type: 'button', onClick: () => select(Math.max(0, index - 1)), disabled: index === 0}, 'Previous phase'),
      h('button', {type: 'button', onClick: () => setPlaying(!playing), disabled: steps.length < 2, 'aria-pressed': playing}, playing ? 'Pause animation' : 'Play timeline'),
      h('button', {type: 'button', onClick: () => select(Math.min(steps.length - 1, index + 1)), disabled: index === steps.length - 1}, 'Next phase')))
}
export function ProjectPage({document, consortium, richText, downloadLinks}) {
  const data = {...projectDetails, ...document.projectDetails}
  const image = safeUrl(document.projectFigureUrl)
  return h(React.Fragment, null,
    h('section', {className: 'project-about', 'aria-labelledby': 'project-about-title'},
      h('p', {className: 'eyebrow'}, 'THE PROJECT'), h('h1', {id: 'project-about-title', className: 'page-title'}, data.aboutHeading),
      data.aboutIntro && h('p', {className: 'project-about-intro'}, data.aboutIntro),
      h('div', {className: 'project-about-grid'},
      h('figure', {className: `project-figure${image ? '' : ' is-placeholder'}`},
        image ? h('img', {src: image, alt: data.figure?.alt || '', loading: 'lazy'}) : h('div', {className: 'figure-placeholder', role: 'img', 'aria-label': 'Placeholder for the project objectives and expected results figure'},
          h('span', {className: 'figure-placeholder-symbol', 'aria-hidden': true}, '↗'), h('strong', null, 'Project overview figure'), h('span', null, 'Objectives → Research → Results')),
        h('figcaption', null, data.figureCaption,
          image && h('a', {className: 'text-link project-figure-fullsize', href: image, target: '_blank', rel: 'noopener noreferrer'}, 'View full-size figure'))))),
    h('section', {className: 'project-timeline-section', 'aria-labelledby': 'project-timeline-title'},
      h('p', {className: 'eyebrow'}, 'FROM RESEARCH TO PRACTICE'), h('h2', {id: 'project-timeline-title'}, data.timelineHeading),
      h('p', {className: 'project-section-intro'}, data.timelineIntro), h(Timeline, {data})),
    h(ConsortiumPage, {document: consortium, richText, downloadLinks, embedded: true}),
    h('section', {className: 'project-community', 'aria-labelledby': 'project-community-title'},
      h('p', {className: 'eyebrow'}, 'CONNECTED RESEARCH'), h('h2', {id: 'project-community-title'}, data.communityHeading),
      h('p', {className: 'project-section-intro'}, data.communityIntro),
      h('div', {className: 'sister-projects'}, ...(data.sisterProjects || []).map(item => {
        const url = /^https?:/.test(item.website || '') ? safeUrl(item.website) : null
        const defaults = researchAssets.find(asset => asset.website === item.website || asset.name.toLowerCase() === item.name?.toLowerCase())
        const logo = safeUrl(item.logoUrl) || defaults?.logoPath
        const logoClass = `sister-project-logo${defaults?.logoBackground === 'dark' ? ' sister-project-logo-dark' : ''}`
        const logoImage = logo && h('img', {src: logo, alt: item.logo?.alt || `${item.name} logo`, loading: 'lazy'})
        return h('article', {key: item._key, className: item.placeholder ? 'sister-placeholder' : ''},
          logoImage && (url ? h('a', {className: logoClass, href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${item.name} website (opens in a new tab)`}, logoImage) : h('div', {className: logoClass}, logoImage)),
          h('span', {className: 'eyebrow'}, item.placeholder ? 'PLACEHOLDER' : item.category), h('h3', null, item.name), h('p', null, item.description),
          url ? h('a', {className: 'text-link', href: url, target: '_blank', rel: 'noopener noreferrer'}, `Visit ${item.name}`) : h('span', {className: 'sister-pending'}, 'Website to be added'))
      }))),
    h('div', {className: 'page-extra article-body'}, richText(document.pageBody), downloadLinks({attachments: document.pageAttachments})))
}
