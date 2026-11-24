import {
  Banknote,
  BatteryCharging,
  BookOpen,
  Briefcase,
  Camera,
  Clock,
  Cpu,
  Feather,
  Footprints,
  GraduationCap,
  HardDrive,
  Heart,
  Monitor,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Wind,
  type LucideIcon,
} from 'lucide-react'

/* Shared SAW demo data for the decision workspace pages. */

export type SawCriterion = {
  id: string
  name: string
  type: 'cost' | 'benefit'
  weight: number
  desc: string
  icon: LucideIcon
  unit?: string
}

export type SawCandidate = {
  name: string
  brand: string
  price: number
  specs: { label: string; value: string }[]
  values: Record<string, number>
  highlight: string
  summary: string
}

export type SawResult = SawCandidate & {
  norm: Record<string, number>
  score: number
}

export type SawProfile = {
  key: string
  label: string
  chip: string
  prompt: string
  criteria: SawCriterion[]
}

export const sawProfiles: SawProfile[] = [
  {
    key: 'smartphone',
    label: 'Smartphone Flagship 2026',
    chip: 'Smartphone Flagship 2026',
    prompt: 'Flagship or upper mid-range 2026 phone for content creation and all-day battery life.',
    criteria: [
      {
        id: 'price',
        name: 'Purchase Price (OTR)',
        type: 'cost',
        weight: 25,
        desc: 'On-the-road device price including tax and base warranty.',
        icon: Banknote,
        unit: 'Rp',
      },
      {
        id: 'battery',
        name: 'Battery Endurance',
        type: 'benefit',
        weight: 20,
        desc: 'Minimum 5,000 mAh capacity with efficient screen-on time.',
        icon: BatteryCharging,
        unit: 'mAh',
      },
      {
        id: 'perf',
        name: 'Processor & RAM Performance',
        type: 'benefit',
        weight: 15,
        desc: 'Modern SOC benchmark plus active multitasking capability.',
        icon: Cpu,
        unit: 'pts',
      },
      {
        id: 'camera',
        name: 'Camera & Optics Quality',
        type: 'benefit',
        weight: 15,
        desc: 'Sensor size, optical stabilisation and 4K video capture.',
        icon: Camera,
        unit: 'DxO',
      },
      {
        id: 'storage',
        name: 'Storage Capacity',
        type: 'benefit',
        weight: 15,
        desc: 'Enough internal space for apps, photos and offline media.',
        icon: HardDrive,
        unit: 'GB',
      },
      {
        id: 'display',
        name: 'Display Quality & Refresh Rate',
        type: 'benefit',
        weight: 10,
        desc: 'Peak brightness and high refresh panel for outdoor use.',
        icon: Monitor,
        unit: 'nits',
      },
    ],
  },
  {
    key: 'laptop',
    label: 'Laptop AI Dev & Creator',
    chip: 'Laptop AI Dev & Creator',
    prompt: 'Portable laptop for AI development and design work with long battery life.',
    criteria: [
      {
        id: 'price',
        name: 'Purchase Price',
        type: 'cost',
        weight: 30,
        desc: 'Total purchase cost including warranty and basic accessories.',
        icon: Banknote,
        unit: 'Rp',
      },
      {
        id: 'perf',
        name: 'Compute Performance',
        type: 'benefit',
        weight: 25,
        desc: 'Multi-core CPU and GPU throughput for local AI workloads.',
        icon: Cpu,
        unit: 'pts',
      },
      {
        id: 'battery',
        name: 'Battery Endurance',
        type: 'benefit',
        weight: 20,
        desc: 'Hours of real mixed-use work away from a power outlet.',
        icon: BatteryCharging,
        unit: 'hours',
      },
      {
        id: 'display',
        name: 'Display Colour Accuracy',
        type: 'benefit',
        weight: 10,
        desc: 'Colour gamut and brightness for editing and design review.',
        icon: Monitor,
        unit: 'pts',
      },
      {
        id: 'storage',
        name: 'Storage & Expandability',
        type: 'benefit',
        weight: 10,
        desc: 'Fast internal SSD space and upgrade options.',
        icon: HardDrive,
        unit: 'GB',
      },
      {
        id: 'portability',
        name: 'Weight & Portability',
        type: 'cost',
        weight: 5,
        desc: 'Lighter machines are easier to carry every day.',
        icon: Feather,
        unit: 'kg',
      },
    ],
  },
  {
    key: 'education',
    label: 'Study Program & Campus',
    chip: 'Study Program & Campus',
    prompt: 'Undergraduate technology program with strong employment outcomes and fair tuition.',
    criteria: [
      {
        id: 'price',
        name: 'Tuition Fee',
        type: 'cost',
        weight: 30,
        desc: 'Annual tuition after standard scholarships are applied.',
        icon: Wallet,
        unit: 'Rp',
      },
      {
        id: 'employment',
        name: 'Graduate Employability',
        type: 'benefit',
        weight: 20,
        desc: 'Share of graduates hired within six months.',
        icon: Briefcase,
        unit: '%',
      },
      {
        id: 'curriculum',
        name: 'Curriculum Relevance',
        type: 'benefit',
        weight: 15,
        desc: 'How closely the syllabus matches current industry stacks.',
        icon: BookOpen,
        unit: 'pts',
      },
      {
        id: 'network',
        name: 'Industry Network',
        type: 'benefit',
        weight: 10,
        desc: 'Internship partners, alumni network and hiring events.',
        icon: Users,
        unit: 'pts',
      },
      {
        id: 'scholarship',
        name: 'Scholarship Availability',
        type: 'benefit',
        weight: 10,
        desc: 'Number and size of merit or need-based grants.',
        icon: GraduationCap,
        unit: 'pts',
      },
      {
        id: 'duration',
        name: 'Study Duration',
        type: 'cost',
        weight: 15,
        desc: 'Shorter programs get you into the workforce sooner.',
        icon: Clock,
        unit: 'semester',
      },
    ],
  },
  {
    key: 'footwear',
    label: 'Sneakers & Footwear',
    chip: 'Sneakers & Footwear',
    prompt: 'Everyday sneakers for commuting and light training under a sensible budget.',
    criteria: [
      {
        id: 'price',
        name: 'Retail Price',
        type: 'cost',
        weight: 25,
        desc: 'Street price for a standard size, taxes included.',
        icon: Banknote,
        unit: 'Rp',
      },
      {
        id: 'comfort',
        name: 'Comfort & Cushioning',
        type: 'benefit',
        weight: 25,
        desc: 'Midsole cushioning for long walking days.',
        icon: Heart,
        unit: 'pts',
      },
      {
        id: 'durability',
        name: 'Durability',
        type: 'benefit',
        weight: 20,
        desc: 'Outsole and upper lifespan under daily use.',
        icon: ShieldCheck,
        unit: 'pts',
      },
      {
        id: 'traction',
        name: 'Traction & Grip',
        type: 'benefit',
        weight: 15,
        desc: 'Wet-surface grip for city streets.',
        icon: Footprints,
        unit: 'pts',
      },
      {
        id: 'breathability',
        name: 'Breathability',
        type: 'benefit',
        weight: 10,
        desc: 'Airflow for tropical climates.',
        icon: Wind,
        unit: 'pts',
      },
      {
        id: 'style',
        name: 'Style Versatility',
        type: 'benefit',
        weight: 5,
        desc: 'How easily it pairs with everyday outfits.',
        icon: Sparkles,
        unit: 'pts',
      },
    ],
  },
]

export const smartphoneCriteria = sawProfiles[0].criteria

export const studioCandidates: SawCandidate[] = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 21999000,
    specs: [
      { label: 'Memory', value: '12GB / 512GB' },
      { label: 'Camera', value: 'Quad 200MP Setup' },
      { label: 'Display', value: '6.8" AMOLED 2X' },
      { label: 'Battery', value: '5,000 mAh · 45W' },
    ],
    values: { price: 21999000, battery: 5000, perf: 2790, camera: 152, storage: 512, display: 3000 },
    highlight: 'Brighter display · 6x optical zoom',
    summary:
      'Lowest normalised price among the flagships plus the brightest panel and the highest optical zoom range.',
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    price: 23999000,
    specs: [
      { label: 'Memory', value: '8GB / 256GB' },
      { label: 'Camera', value: 'Triple 48MP Setup' },
      { label: 'Display', value: '6.7" Super Retina' },
      { label: 'Battery', value: '4,422 mAh · 27W' },
    ],
    values: { price: 23999000, battery: 4422, perf: 2860, camera: 154, storage: 256, display: 2000 },
    highlight: 'Fastest SOC · ProRes video',
    summary:
      'Strongest raw performance and the best camera pipeline, but the smallest battery and storage per rupiah.',
  },
  {
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 18999000,
    specs: [
      { label: 'Memory', value: '16GB / 512GB' },
      { label: 'Camera', value: 'Quad 50MP Leica' },
      { label: 'Display', value: '6.73" AMOLED LTPO' },
      { label: 'Battery', value: '5,000 mAh · 90W' },
    ],
    values: { price: 18999000, battery: 5000, perf: 2710, camera: 138, storage: 512, display: 2600 },
    highlight: 'Best price · 90W charging',
    summary:
      'The most aggressive price-to-hardware ratio with the largest memory tier and the fastest charging.',
  },
]

const rupiah = (value: number) => `Rp ${value.toLocaleString('en-US')}`

export const formatSawValue = (criterion: SawCriterion, value: number) => {
  if (criterion.id === 'price') return rupiah(value)
  const base = Number.isInteger(value) ? value.toLocaleString('en-US') : String(value)
  return criterion.unit ? `${base} ${criterion.unit}` : base
}

/** Normalised SAW: cost = min/value, benefit = value/max, then weighted sum. */
export function runSaw(
  criteria: SawCriterion[],
  candidates: SawCandidate[],
  weights?: Record<string, number>
): SawResult[] {
  if (candidates.length === 0) return []
  const weightOf = (criterion: SawCriterion) => weights?.[criterion.id] ?? criterion.weight
  const divisor = criteria.reduce((sum, criterion) => sum + weightOf(criterion), 0) || 1

  const range: Record<string, { min: number; max: number }> = {}
  criteria.forEach((criterion) => {
    const values = candidates.map((candidate) => candidate.values[criterion.id] ?? 0)
    range[criterion.id] = { min: Math.min(...values), max: Math.max(...values) }
  })

  return candidates
    .map((candidate) => {
      const norm: Record<string, number> = {}
      criteria.forEach((criterion) => {
        const value = candidate.values[criterion.id] ?? 0
        const { min, max } = range[criterion.id]
        norm[criterion.id] =
          criterion.type === 'cost'
            ? value > 0
              ? min / value
              : 1
            : max > 0
              ? value / max
              : 0
      })
      const score =
        criteria.reduce((sum, criterion) => sum + norm[criterion.id] * weightOf(criterion), 0) / divisor
      return { ...candidate, norm, score }
    })
    .sort((a, b) => b.score - a.score)
}
