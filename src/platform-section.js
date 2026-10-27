import React, {useEffect, useState} from 'react'

const h = React.createElement
export function PlatformSection({document: doc, richText, downloadLinks}) {
  useEffect(() => {
    if (location.hash !== '#resiliact-platform') return
    const frame = requestAnimationFrame(() => document.getElementById('resiliact-platform')?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [])
  const components = doc.components || []
  const [selectedCode, setSelectedCode] = useState(components[0]?.code)
  const index = Math.max(0, components.findIndex(item => item.code === selectedCode))
  const selected = components[index]
  const headingColor = ['#ffffff', '#76dfe8', '#d5e6ed'].includes(doc.headingColor) ? doc.headingColor : '#ffffff'
  return h('section', {id: 'resiliact-platform', className: 'platform project-platform', 'aria-labelledby': 'resiliact-platform-title', style: {'--platform-heading-color': headingColor}},
    h('div', {className: 'section-top'},
      h('div', null, h('p', {className: 'eyebrow'}, doc.eyebrow), h('h2', {id: 'resiliact-platform-title', className: 'cms-heading'}, doc.heading)),
      h('p', null, doc.intro)),
    h('div', {className: 'platform-explorer'},
      h('div', {className: 'component-list', 'aria-label': 'Explore platform components'}, ...components.map((item, i) =>
        h('button', {key: item._key || item.code, type: 'button', className: `component${i === index ? ' active' : ''}`, 'aria-pressed': i === index, onClick: () => setSelectedCode(item.code)},
          h('span', null, String(i + 1).padStart(2, '0')), item.label, h('small', null, item.code)))),
      selected && h('div', {className: 'component-detail', 'aria-live': 'polite'},
        h('p', {className: 'eyebrow'}, selected.code), h('h3', null, selected.title), h('p', null, selected.description),
        h('div', {className: 'component-outcome'}, h('span', null, 'What this enables'), h('p', null, selected.outcome)),
        h('p', {className: 'development-note'}, doc.developmentNote))),
    h('div', {className: 'page-extra article-body'}, richText(doc.pageBody), downloadLinks({attachments: doc.pageAttachments})))
}
