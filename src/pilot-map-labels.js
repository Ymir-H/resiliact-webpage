export const hubMapLabels = [
  ['DRMIH-1 Oslo, Norway'],
  ['DRMIH-2 Reykjavík, Iceland'],
  ['DRMIH-3 Stockholm, Sweden'],
  ['DRMIH-4 Copenhagen, Denmark'],
  ['DRMIH-5 Helsinki, Finland'],
]

export const replicationMapLabels = {
  brussels: ['RS-1 City of Brussels, Belgium', '(Central Europe)'],
  attica: ['RS-2 Region of Attica, Greece', '(South Europe)'],
  bratislava: ['RS-3 Bratislave, Slovakia', '(East Europe)'],
  algiers: ['RS-4 Algiers, Algeria', '(Beyond Europe)'],
  lisbon: ['RS-5 Lisbon, Portugal', '(West Europe)'],
  essex: ['RS-6 Essex, UK', '(West Europe)'],
}

export const replicationMapOffsets = {
  brussels: [-16, 35, 'end'], attica: [-16, -30, 'end'],
  bratislava: [16, -14, 'start'], lisbon: [-16, -30, 'end'],
  essex: [-16, -25, 'end'], algiers: [16, 23, 'start'],
}

export function setMapLabel(text, lines) {
  text.replaceChildren(...lines.map((line, index) => {
    const span = document.createElementNS(text.namespaceURI, 'tspan')
    span.setAttribute('x', text.getAttribute('x'))
    span.setAttribute('dy', index ? '18' : '0')
    span.textContent = line + (index < lines.length - 1 ? ' ' : '')
    return span
  }))
}
