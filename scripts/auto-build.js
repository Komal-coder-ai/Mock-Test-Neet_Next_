const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf-8', ...opts })
  return res
}

function log(msg) {
  process.stdout.write(msg + '\n')
}

const logFile = path.join(process.cwd(), '.auto-build.log')
fs.writeFileSync(logFile, `Auto-build started: ${new Date().toISOString()}\n\n`)

function appendLog(name, res) {
  fs.appendFileSync(logFile, `===== ${name} (exit ${res.status}) =====\n`)
  fs.appendFileSync(logFile, res.stdout || '')
  fs.appendFileSync(logFile, res.stderr || '')
  fs.appendFileSync(logFile, '\n\n')
}

log('Running `npm run build`...')
let res = run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'])
appendLog('npm run build', res)

if (res.status === 0) {
  log('Build succeeded.')
  process.exit(0)
}

log('Build failed. Attempting automatic fixes: eslint --fix and prettier --write (if available)')

// Try eslint --fix via npx
log('Running `npx eslint . --ext .js,.jsx,.ts,.tsx --fix` (may install eslint via npx)')
let tryEslint = run('npx', ['eslint', '.', '--ext', '.js,.jsx,.ts,.tsx', '--fix'])
appendLog('npx eslint --fix', tryEslint)

log('Running `npx prettier --write .`')
let tryPrettier = run('npx', ['prettier', '--write', '.'])
appendLog('npx prettier --write', tryPrettier)

log('Retrying `npm run build`...')
res = run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'])
appendLog('npm run build (retry)', res)

if (res.status === 0) {
  log('Build succeeded after lint/format fixes.')
  process.exit(0)
}

log('Build still failing. Gathering TypeScript errors (if tsc available)')
let tsc = run('npx', ['tsc', '--noEmit'])
appendLog('npx tsc --noEmit', tsc)

log('Auto-build finished. See .auto-build.log for details.')
process.exit(res.status || 1)
