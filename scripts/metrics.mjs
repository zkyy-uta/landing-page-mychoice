#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve(process.cwd(), '.data/metrics.json')

let data = { events: {}, signups: [] }
try {
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
  data = { events: parsed.events ?? {}, signups: parsed.signups ?? [] }
} catch {
  console.log('No metrics recorded yet (.data/metrics.json not found).')
  process.exit(0)
}

const clickEvents = ['cta_click', 'hero_try_click', 'navbar_get_started_click']
const clicks = clickEvents.reduce((sum, name) => sum + (data.events[name] ?? 0), 0)
const signups = data.signups.length
const rate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : 'n/a'

console.log('MyChoice landing page metrics\n')
console.log(`CTA clicks        : ${clicks}`)
for (const name of clickEvents) {
  if (data.events[name]) console.log(`  ${name.padEnd(16)}: ${data.events[name]}`)
}
console.log(`Signups           : ${signups}`)
console.log(`Click -> signup   : ${rate}%`)

if (data.events && Object.keys(data.events).length > 0) {
  const other = Object.entries(data.events).filter(([name]) => !clickEvents.includes(name))
  if (other.length > 0) {
    console.log('\nOther events')
    for (const [name, count] of other) console.log(`  ${name.padEnd(16)}: ${count}`)
  }
}

if (signups > 0) {
  console.log('\nLatest signups')
  for (const s of data.signups.slice(-10).reverse()) {
    console.log(`  ${s.createdAt}  ${s.email}  (${s.source})`)
  }
}
