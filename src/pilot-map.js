import './pilot-map.css'

// Navigation works entirely with the bundled SVG, including when offline.
export function createPilotMapNavigation(svg) {
  const panel = svg.closest('.map-panel')
  const width = 900, height = 760
  let view = {x: 0, y: 0, width, height}
  let drag = null
  let dragged = false
  const controls = document.createElement('div')
  controls.className = 'map-controls'
  controls.setAttribute('role', 'group')
  controls.setAttribute('aria-label', 'Map navigation')
  const status = document.createElement('span')
  status.className = 'map-zoom-status'
  status.setAttribute('aria-live', 'polite')
  const addButton = (label, symbol, action) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.title = label
    button.setAttribute('aria-label', label)
    button.textContent = symbol
    button.addEventListener('click', action)
    controls.append(button)
    return button
  }
  const draw = (announce = false) => {
    view.x = Math.max(0, Math.min(width - view.width, view.x))
    view.y = Math.max(0, Math.min(height - view.height, view.y))
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.width} ${view.height}`)
    zoomIn.disabled = view.width <= width / 4 + 0.1
    zoomOut.disabled = view.width >= width - 0.1
    panel.classList.toggle('map-is-zoomed', view.width < width)
    if (announce) status.textContent = `Map zoom ${Math.round(width / view.width * 100)} percent`
  }
  const zoom = factor => {
    const nextWidth = Math.max(width / 4, Math.min(width, view.width / factor))
    const nextHeight = nextWidth * height / width
    view = {x: view.x + (view.width - nextWidth) / 2, y: view.y + (view.height - nextHeight) / 2, width: nextWidth, height: nextHeight}
    draw(true)
  }
  const zoomIn = addButton('Zoom in', '+', () => zoom(1.5))
  const zoomOut = addButton('Zoom out', '−', () => zoom(1 / 1.5))
  addButton('Show all pilot locations', '↺', () => {view = {x: 0, y: 0, width, height}; draw(true)})
  if (document.fullscreenEnabled) {
    const expand = addButton('Expand map', '⛶', async () => {
      try {
        if (document.fullscreenElement === panel) await document.exitFullscreen()
        else await panel.requestFullscreen()
      } catch {status.textContent = 'Full screen is unavailable in this browser.'}
    })
    document.addEventListener('fullscreenchange', () => {
      const label = document.fullscreenElement === panel ? 'Exit full screen' : 'Expand map'
      expand.title = label
      expand.setAttribute('aria-label', label)
    })
  }
  controls.append(status)
  panel.prepend(controls)
  const caption = document.createElement('div')
  caption.className = 'map-caption'
  const hint = document.createElement('span')
  hint.textContent = 'Select a location · Zoom in to explore'
  const attribution = document.createElement('a')
  attribution.href = 'https://www.naturalearthdata.com/'
  attribution.target = '_blank'
  attribution.rel = 'noopener noreferrer'
  attribution.textContent = 'Map: Natural Earth'
  caption.append(hint, attribution)
  panel.append(caption)
  svg.setAttribute('tabindex', '0')
  svg.addEventListener('keydown', event => {
    if (event.target !== svg) return
    const arrows = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}
    if (arrows[event.key]) {
      event.preventDefault()
      const [dx, dy] = arrows[event.key]
      view.x += dx * view.width / 6
      view.y += dy * view.height / 6
      draw()
    } else if (['+', '=', '-'].includes(event.key)) {
      event.preventDefault(); zoom(event.key === '-' ? 1 / 1.5 : 1.5)
    } else if (event.key === 'Home') {
      event.preventDefault(); view = {x: 0, y: 0, width, height}; draw(true)
    }
  })
  svg.addEventListener('pointerdown', event => {
    // Preserve touch scrolling; touch users have explicit zoom controls.
    if (event.pointerType === 'touch' || event.button !== 0 || view.width === width) return
    drag = {x: event.clientX, y: event.clientY, view: {...view}, pointerId: event.pointerId}
    dragged = false
  })
  svg.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y
    if (!dragged && Math.hypot(dx, dy) < 5) return
    dragged = true
    svg.setPointerCapture(event.pointerId)
    const matrix = svg.getScreenCTM()
    view.x = drag.view.x - dx / matrix.a
    view.y = drag.view.y - dy / matrix.d
    draw()
  })
  const stopDrag = () => {drag = null}
  svg.addEventListener('pointerup', stopDrag)
  svg.addEventListener('pointercancel', stopDrag)
  svg.addEventListener('lostpointercapture', stopDrag)
  svg.addEventListener('click', event => {
    if (dragged) {event.preventDefault(); event.stopImmediatePropagation(); dragged = false}
  }, true)
  draw()
  return {
    reveal(marker) {
      if (!marker || view.width === width) return
      const dot = marker.querySelector('.map-dot,.replica-dot')
      const x = Number(dot.getAttribute('cx')), y = Number(dot.getAttribute('cy'))
      if (x < view.x + 30 || x > view.x + view.width - 30 || y < view.y + 30 || y > view.y + view.height - 30) {
        view.x = x - view.width / 2; view.y = y - view.height / 2; draw()
      }
    },
  }
}
