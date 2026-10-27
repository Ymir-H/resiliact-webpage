import {spawn} from 'node:child_process'
import {existsSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const studio = path.join(root, 'studio')
if (!existsSync(path.join(studio, '.env.local'))) {
  console.error('Connect the project first: npm.cmd run sanity:setup')
  process.exitCode = 1
} else {
  const script = process.argv.includes('--hubs') ? 'initialize-hub-content.mjs' : 'import-example.mjs'
  const child = spawn(process.execPath, [path.join(studio, 'node_modules/sanity/bin/sanity'), 'exec', path.join(root, 'scripts', script), '--with-user-token'], {cwd: studio, stdio: 'inherit'})
  child.on('error', error => {console.error(error.message); process.exitCode = 1})
  child.on('exit', code => {process.exitCode = code || 0})
}
