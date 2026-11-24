import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

type Signup = {
  email: string
  source: string
  path: string
  createdAt: string
}

type MetricsFile = {
  events: Record<string, number>
  signups: Signup[]
}

const DATA_DIR = path.resolve(__dirname, '.data')
const DATA_FILE = path.join(DATA_DIR, 'metrics.json')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function readMetrics(): MetricsFile {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as Partial<MetricsFile>
    return { events: parsed.events ?? {}, signups: parsed.signups ?? [] }
  } catch {
    return { events: {}, signups: [] }
  }
}

function writeMetrics(data: MetricsFile) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function readJsonBody(req: import('http').IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 10_000) req.destroy()
    })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(raw || '{}')
        resolve(parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

function sendJson(res: import('http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

/**
 * Local-only API used by the landing page while developing:
 * - POST /api/track   -> increments a named event counter (e.g. cta_click)
 * - POST /api/signup  -> stores a waitlist signup (deduplicated by email)
 * - GET  /api/metrics -> totals for events + signups
 * Data lives in .data/metrics.json; `npm run metrics` prints a summary.
 */
function localMetricsApi(): Plugin {
  return {
    name: 'mychoice-local-metrics-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const route = url.pathname.replace(/\/+$/, '') || '/'

        if (route === '/metrics' && req.method === 'GET') {
          const data = readMetrics()
          sendJson(res, 200, {
            events: data.events,
            signupCount: data.signups.length,
            signups: data.signups.map((s) => ({
              email: s.email,
              source: s.source,
              createdAt: s.createdAt,
            })),
          })
          return
        }

        if (route === '/track' && req.method === 'POST') {
          const body = await readJsonBody(req)
          const name = typeof body.name === 'string' ? body.name.slice(0, 64) : ''
          if (!name) {
            sendJson(res, 400, { error: 'Missing event name.' })
            return
          }
          const data = readMetrics()
          data.events[name] = (data.events[name] ?? 0) + 1
          writeMetrics(data)
          sendJson(res, 200, { ok: true })
          return
        }

        if (route === '/signup' && req.method === 'POST') {
          const body = await readJsonBody(req)
          const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
          const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'landing-cta'
          const page = typeof body.path === 'string' ? body.path.slice(0, 200) : '/'

          if (!EMAIL_RE.test(email)) {
            sendJson(res, 400, { error: 'Please enter a valid email address.' })
            return
          }

          const data = readMetrics()
          if (data.signups.some((s) => s.email === email)) {
            sendJson(res, 200, { ok: true, duplicate: true })
            return
          }

          data.signups.push({
            email,
            source,
            path: page,
            createdAt: new Date().toISOString(),
          })
          writeMetrics(data)
          sendJson(res, 201, { ok: true })
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localMetricsApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
