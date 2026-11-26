import { useEffect, useState } from 'react'
import { AlertTriangle, Database, Download, RotateCcw, Save, Server, Settings2, ShieldCheck, Trash2 } from 'lucide-react'
import { fetchSettings, saveSettings } from '../api'
import { downloadFile, formatDate } from '../format'
import { useAsyncData } from '../useAsync'
import { DEFAULT_ENGINE_SETTINGS, type EngineSettings } from '../types'
import { Badge, Button, Card, ErrorNote, LoadingRow, PageHeader, Select, Toggle } from '../ui'

const tabs = [
  { key: 'engine', label: 'General & engine' },
  { key: 'security', label: 'Security & access' },
  { key: 'api', label: 'API & webhooks' },
  { key: 'backup', label: 'Backup & logs' },
] as const

type TabKey = (typeof tabs)[number]['key']

const NORMALIZATION_METHODS = [
  'Linear Max-Min (Standard SAW)',
  'Linear Sum (Proportional SAW)',
  'Vector Normalization (SAW)',
]

const PRECISIONS = ['2 Decimal Places (0.00)', '3 Decimal Places (0.000)', '4 Decimal Places (0.0000)']

const SESSION_TIMEOUTS = ['1 hour', '4 hours', '12 hours', '24 hours']

function Row({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[11px] border border-[#f2ecfa] bg-[#fdfbff] px-3.5 py-3">
      <div className="min-w-0">
        <p className="text-[11.5px] font-medium text-[#2b2138]">{title}</p>
        <p className="text-[10.5px] leading-relaxed text-[#9a90ac]">{description}</p>
      </div>
      {children}
    </div>
  )
}

export function AdminSettings() {
  const [tab, setTab] = useState<TabKey>('engine')
  const [settings, setSettings] = useState<EngineSettings>(DEFAULT_ENGINE_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const { data, error, loading, reload } = useAsyncData(() => fetchSettings(), [])

  useEffect(() => {
    if (data) setSettings(data)
  }, [data])

  const dirty = Boolean(data) && JSON.stringify(data) !== JSON.stringify(settings)

  function update(patch: Partial<EngineSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    setSaveError(null)
    try {
      await saveSettings(settings)
      setSaved(true)
      reload()
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  function resetDefaults() {
    if (!window.confirm('Reset engine settings to the defaults?')) return
    setSettings({ ...DEFAULT_ENGINE_SETTINGS })
    setSaved(false)
  }

  async function clearCache() {
    const next = { ...settings, cache_cleared_at: new Date().toISOString() }
    setSettings(next)
    try {
      await saveSettings(next)
      setSaved(true)
      reload()
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not clear the cache timestamp.')
    }
  }

  function exportJson() {
    downloadFile('mychoice-system-config.json', JSON.stringify(settings, null, 2), 'application/json')
  }

  return (
    <div>
      <PageHeader
        label={
          <>
            Platform configuration · Core &amp; engine
          </>
        }
        title="System Settings"
        description="Configure global SAW engine parameters, security policies, integrations, and maintenance."
        actions={
          <>
            <Button onClick={resetDefaults} disabled={loading}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset defaults
            </Button>
            <Button variant="primary" onClick={() => void save()} disabled={!dirty || saving}>
              <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-5">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}
      {saveError ? (
        <div className="mb-4">
          <ErrorNote>{saveError}</ErrorNote>
        </div>
      ) : null}

      <Card className="p-1.5">
        <div className="flex flex-wrap gap-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={
                tab === item.key
                  ? 'rounded-[9px] bg-[#f3ecfe] px-3.5 py-2 text-[11.5px] font-semibold text-[#5b21b6]'
                  : 'rounded-[9px] px-3.5 py-2 text-[11.5px] font-medium text-[#8d84a0] hover:bg-[#faf7ff]'
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card className="mt-4 px-5">
          <LoadingRow label="Loading settings…" />
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {tab === 'engine' ? (
            <>
              <Card className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f2eafe] text-[#6b28d9]">
                      <Settings2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-[13.5px] font-semibold text-[#171021]">SAW decision engine configuration</h2>
                      <p className="text-[11px] text-[#8d84a0]">
                        Control normalization, weight scaling, and criteria flexibility.
                      </p>
                    </div>
                  </div>
                  <Badge tone="green">Engine v2.4 active</Badge>
                </div>

                <div className="mt-4 space-y-2.5">
                  <Row
                    title="Auto-normalize criteria weights"
                    description="Automatically scale criteria weights so their sum equals 1.00 during calculation."
                  >
                    <Toggle
                      checked={settings.auto_normalize}
                      onChange={(next) => update({ auto_normalize: next })}
                      label="Auto-normalize criteria weights"
                    />
                  </Row>
                  <Row
                    title="Allow user custom criteria"
                    description="Permit users to suggest or temporarily add custom criteria to their workflows."
                  >
                    <Toggle
                      checked={settings.allow_custom_criteria}
                      onChange={(next) => update({ allow_custom_criteria: next })}
                      label="Allow user custom criteria"
                    />
                  </Row>
                </div>

                <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold text-[#5c5368]">
                      Default normalization method
                    </span>
                    <Select
                      value={settings.normalization_method}
                      onChange={(event) => update({ normalization_method: event.target.value })}
                    >
                      {NORMALIZATION_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold text-[#5c5368]">Decimal precision</span>
                    <Select
                      value={settings.decimal_precision}
                      onChange={(event) => update({ decimal_precision: event.target.value })}
                    >
                      {PRECISIONS.map((precision) => (
                        <option key={precision} value={precision}>
                          {precision}
                        </option>
                      ))}
                    </Select>
                  </label>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f2eafe] text-[#6b28d9]">
                    <Server className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-[13.5px] font-semibold text-[#171021]">Platform &amp; maintenance</h2>
                    <p className="text-[11px] text-[#8d84a0]">Manage client sync, availability, and cache state.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <Row
                    title="Real-time mobile sync"
                    description="Push catalogue and criteria updates immediately to mobile clients."
                  >
                    <Toggle
                      checked={settings.realtime_sync}
                      onChange={(next) => update({ realtime_sync: next })}
                      label="Real-time mobile sync"
                    />
                  </Row>
                  <Row
                    title="Maintenance mode"
                    description="Temporarily restrict public access while keeping the admin console available."
                  >
                    <Toggle
                      checked={settings.maintenance_mode}
                      onChange={(next) => update({ maintenance_mode: next })}
                      label="Maintenance mode"
                    />
                  </Row>
                  <Row
                    title="System cache & index"
                    description={
                      settings.cache_cleared_at
                        ? `Last cleared: ${formatDate(settings.cache_cleared_at)}`
                        : 'Not cleared since this console was connected.'
                    }
                  >
                    <Button size="sm" onClick={() => void clearCache()}>
                      <Trash2 className="h-3.5 w-3.5" /> Clear cache
                    </Button>
                  </Row>
                </div>
              </Card>
            </>
          ) : null}

          {tab === 'security' ? (
            <Card className="p-5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f2eafe] text-[#6b28d9]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-[13.5px] font-semibold text-[#171021]">Access policy</h2>
                  <p className="text-[11px] text-[#8d84a0]">
                    Console access is enforced by Supabase row-level security, not just UI checks.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <Row
                  title="Require two-factor authentication"
                  description="Recommended for every account with the admin role."
                >
                  <Toggle
                    checked={settings.require_2fa}
                    onChange={(next) => update({ require_2fa: next })}
                    label="Require two-factor authentication"
                  />
                </Row>
                <Row title="Admin session timeout" description="Automatically ends idle admin sessions.">
                  <Select
                    value={settings.session_timeout}
                    onChange={(event) => update({ session_timeout: event.target.value })}
                    className="h-9 w-[120px] text-[11.5px]"
                  >
                    {SESSION_TIMEOUTS.map((timeout) => (
                      <option key={timeout} value={timeout}>
                        {timeout}
                      </option>
                    ))}
                  </Select>
                </Row>
              </div>

              <div className="mt-4 rounded-[11px] border border-[#f2ecfa] bg-[#faf7ff] px-3.5 py-3 text-[10.5px] leading-relaxed text-[#79708a]">
                Only accounts whose <code className="rounded bg-white px-1">profiles.role</code> is{' '}
                <code className="rounded bg-white px-1">admin</code> can read or write admin data. Policies live in{' '}
                <code className="rounded bg-white px-1">supabase/schema.sql</code> — change them there, not in this
                screen.
              </div>
            </Card>
          ) : null}

          {tab === 'api' ? (
            <Card className="p-5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#f2eafe] text-[#6b28d9]">
                  <Database className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-[13.5px] font-semibold text-[#171021]">Data connection</h2>
                  <p className="text-[11px] text-[#8d84a0]">
                    This console talks directly to Supabase with the public anon key; access is limited by RLS.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-[11px] border border-[#f2ecfa] bg-[#fdfbff] px-3.5 py-3 text-[11px] text-[#5f5769]">
                <p className="flex items-center justify-between gap-3">
                  <span className="text-[#9a90ac]">Project URL</span>
                  <span className="truncate font-medium">
                    {(import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? 'Not configured'}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-[#9a90ac]">Tables</span>
                  <span className="font-medium">profiles · pengguna · kategori · sub_kategori · kriteria · pilihan_katalog · reviews · admin_settings</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-[#9a90ac]">Auth provider</span>
                  <span className="font-medium">Supabase Auth (email &amp; password)</span>
                </p>
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-[#a39aae]">
                Outgoing webhooks are not configured. Add an Edge Function if you need external notifications.
              </p>
            </Card>
          ) : null}

          {tab === 'backup' ? (
            <>
              <Card className="p-5">
                <h2 className="text-[13.5px] font-semibold text-[#171021]">Export configuration</h2>
                <p className="mt-0.5 text-[11px] text-[#8d84a0]">
                  Download a snapshot of the current engine weights, normalization rules, and platform flags.
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 rounded-[11px] border border-[#f2ecfa] bg-[#fdfbff] px-3.5 py-3">
                  <div>
                    <p className="text-[11.5px] font-medium text-[#2b2138]">Full system configuration (JSON)</p>
                    <p className="text-[10.5px] text-[#9a90ac]">Contains settings only — no user data.</p>
                  </div>
                  <Button size="sm" onClick={exportJson}>
                    <Download className="h-3.5 w-3.5" /> Export JSON
                  </Button>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fdeef0] text-[#bd2c45]">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-[13.5px] font-semibold text-[#171021]">Database backups</h2>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#8d84a0]">
                      Backups and point-in-time recovery are managed in the Supabase dashboard (Database → Backups). This
                      console cannot create or restore them.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {saved && !dirty ? (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#e4f8ee] px-3 py-1.5 text-[10.5px] font-semibold text-[#137a4c]">
          Settings saved
        </p>
      ) : null}
    </div>
  )
}
