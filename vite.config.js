import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {pageRoutes} from './src/page-routes.js'
import {hubKeys} from './scripts/hub-content.mjs'
import {replicationDefaults} from './scripts/replication-content.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'section-pages',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = new URL(request.url, 'http://localhost').pathname
        const moved = pageRoutes.find(route => route.movedTo && [route.path, route.path.replace(/\/$/, ''), `${route.path}index.html`].includes(path))
        if (moved) {response.writeHead(302, {Location: moved.movedTo}); response.end(); return}
        if (!['/contact', '/contact/', '/contact/index.html'].includes(path)) return next()
        response.writeHead(302, {Location: '/#contact'})
        response.end()
      })
    },
    generateBundle(options, bundle) {
      const homepage = bundle['index.html']
      for (const route of pageRoutes.filter(route => route.dedicated !== false)) this.emitFile({type: 'asset', fileName: `${route.path.slice(1)}index.html`, source: homepage.source})
      for (const route of pageRoutes.filter(route => route.movedTo)) this.emitFile({type: 'asset', fileName: `${route.path.slice(1)}index.html`, source: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${route.label} | RESILIACT</title><meta http-equiv="refresh" content="0;url=${route.movedTo}"><script>location.replace(${JSON.stringify(route.movedTo)})</script></head><body><a href="${route.movedTo}">Continue to ${route.movedTo.startsWith('/outcomes/') ? 'Outcomes' : 'About RESILIACT'}</a></body></html>`})
      this.emitFile({type: 'asset', fileName: 'events/index.html', source: homepage.source})
      for (const key of [...hubKeys, ...replicationDefaults.map(site => site.siteKey)]) {
        this.emitFile({type: 'asset', fileName: `innovation-hubs/${key}/index.html`, source: homepage.source})
      }
      // Keep old bookmarks working without serving a separate Contact page.
      this.emitFile({type: 'asset', fileName: 'contact/index.html', source: '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact | RESILIACT</title><meta http-equiv="refresh" content="0;url=/#contact"><script>location.replace("/#contact")</script></head><body><a href="/#contact">Continue to Let’s connect on the homepage</a></body></html>'})
    },
  }],
})
