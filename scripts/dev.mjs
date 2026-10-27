import {spawn} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const studio = path.join(root, 'studio')
const envFile = path.join(studio, '.env.local')
const children = []
function start(script, args, cwd) {
  const child = spawn(process.execPath, [script, ...args], {cwd, stdio: 'inherit'})
  children.push(child)
  child.on('error', error => {console.error(error.message); stop(1)})
  child.on('exit', code => stop(code || 0))
}
let stopping = false
function stop(code) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  process.exitCode = code
}
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
const cli = path.join(studio, 'node_modules/sanity/bin/sanity')
const configured = existsSync(envFile) && /^SANITY_STUDIO_PROJECT_ID=[a-z0-9]+\s*$/m.test(readFileSync(envFile, 'utf8'))
if (!configured || !existsSync(cli)) {
  console.error('Connect Sanity first: npm.cmd run sanity:setup. For the example homepage alone, run npm.cmd run dev.')
  process.exitCode = 1
} else {
  start(path.join(root, 'node_modules/vite/bin/vite.js'), ['--host', '127.0.0.1', '--port', '5173', '--strictPort'], root)
  start(cli, ['dev', '--host', '127.0.0.1', '--port', '3333'], studio)
}
