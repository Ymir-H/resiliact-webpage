import {spawn} from 'node:child_process'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createInterface} from 'node:readline/promises'

const root = fileURLToPath(new URL('../', import.meta.url))
const studio = path.join(root, 'studio')
const cli = path.join(studio, 'node_modules/sanity/bin/sanity')
const readline = createInterface({input: process.stdin, output: process.stdout})
async function run(args, {capture = false} = {}) {
  let output = ''
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {cwd: studio, stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit'})
    if (capture) child.stdout.on('data', chunk => {output += chunk; process.stdout.write(chunk)})
    child.on('error', reject)
    child.on('exit', resolve)
  })
  if (code !== 0) throw new Error(`Sanity command failed (${code}). No further setup steps were run.`)
  return output
}
function replaceEnvironment(file, values) {
  let source = existsSync(file) ? readFileSync(file, 'utf8') : ''
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`^${key}=.*$`, 'm')
    source = pattern.test(source) ? source.replace(pattern, `${key}=${value}`) : `${source.trimEnd()}\n${key}=${value}\n`
  }
  writeFileSync(file, source.trimStart())
}
try {
  if (!existsSync(cli)) throw new Error('Install Studio dependencies first: npm.cmd --prefix studio install')
  const existing = process.argv.indexOf('--project')
  let projectId = existing >= 0 ? process.argv[existing + 1] : ''
  const savedEnvironment = path.join(studio, '.env.local')
  if (!projectId && existsSync(savedEnvironment)) projectId = /^SANITY_STUDIO_PROJECT_ID=([a-z0-9]+)\s*$/m.exec(readFileSync(savedEnvironment, 'utf8'))?.[1] || ''
  if (!projectId) {
    console.log('Sanity requires browser sign-in and an organisation to own the new project. New projects start with a no-charge Growth trial and return to Free unless you explicitly upgrade. No payment setup is included.')
    await run(['login'])
    await run(['organizations', 'list'])
    const orgFlag = process.argv.indexOf('--organization')
    let organizationId = orgFlag >= 0 ? process.argv[orgFlag + 1] : (await readline.question('Organisation ID to use, or press Enter to create RESILIACT prototype: ')).trim()
    if (!organizationId) {
      const created = await run(['organizations', 'create', '--name', 'RESILIACT prototype'], {capture: true})
      organizationId = /^ID:\s+(\S+)/m.exec(created)?.[1]
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(organizationId || '')) throw new Error('Could not determine the organisation ID. Inspect sanity organizations list before retrying.')
    await run(['init', '--bare', '--project-name', 'RESILIACT', '--organization', organizationId, '--dataset', 'production', '--visibility', 'public'])
    projectId = (await readline.question('Paste the project ID printed above (also shown at https://www.sanity.io/manage): ')).trim()
  }
  if (!/^[a-z0-9]+$/.test(projectId)) throw new Error('Project IDs contain only lowercase letters and numbers. Run setup again with --project YOUR_ID; do not create another project.')
  replaceEnvironment(path.join(root, '.env.local'), {VITE_SANITY_PROJECT_ID: projectId, VITE_SANITY_DATASET: 'production', VITE_SANITY_STUDIO_URL: 'http://localhost:3333'})
  replaceEnvironment(path.join(studio, '.env.local'), {SANITY_STUDIO_PROJECT_ID: projectId, SANITY_STUDIO_DATASET: 'production'})
  console.log('Local frontend and Studio configuration saved. Adding the local browser origins…')
  const currentOrigins = await run(['cors', 'list'], {capture: true})
  for (const [origin, credentials] of [
    ['http://localhost:5173', false], ['http://127.0.0.1:5173', false],
    ['http://localhost:4173', false], ['http://127.0.0.1:4173', false],
    ['http://localhost:3333', true], ['http://127.0.0.1:3333', true],
  ]) {
    if (currentOrigins.split(/\r?\n/).some(line => line.trim() === origin)) continue
    await run(['cors', 'add', origin, credentials ? '--credentials' : '--no-credentials'])
  }
  console.log('Setup complete. Run npm.cmd run sanity:seed to import the example content, then npm.cmd run dev:all. Invite administrators at https://www.sanity.io/manage.')
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {readline.close()}
