export const pageRoutes = [
  {key: 'project', path: '/project/', selector: '#about', label: 'About RESILIACT'},
  {key: 'platform', path: '/platform/', selector: '#platform', label: 'Platform', dedicated: false, movedTo: '/outcomes/#resiliact-platform'},
  {key: 'hubs', path: '/innovation-hubs/', selector: '#regions', label: 'RESILIACT Hubs', pageTitle: 'RESILIACT hubs'},
  {key: 'outcomes', path: '/outcomes/', selector: '#outcomes', label: 'Outcomes'},
  {key: 'consortium', path: '/consortium/', selector: '#consortium', label: 'Consortium', dedicated: false, movedTo: '/project/#project-consortium'},
  {key: 'news', path: '/news/', selector: '#updates', label: 'News & Events'},
  {key: 'contact', path: '/#contact', selector: '#contact', label: 'Contact', dedicated: false},
]
export function pageLink(value) {
  if (value === '#project-platform' || /^\/project(?:\/|\/index\.html)?#project-platform$/.test(value || '')) return '/outcomes/#resiliact-platform'
  if (/^\/contact(?:\/|\/index\.html)?(?:[?#].*)?$/.test(value || '')) return '/#contact'
  const moved = pageRoutes.find(route => route.movedTo && (route.selector === value || route.path.replace(/\/$/, '') === (value || '').split(/[?#]/)[0].replace(/\/index\.html$/, '').replace(/\/$/, '')))
  if (moved) return moved.movedTo
  return pageRoutes.find(route => route.selector === value)?.path || (value === '#home' ? '/' : value)
}
