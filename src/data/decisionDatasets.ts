/* Demo datasets per subcategory for the Decision Wizard (SAW).
   Every dataset has 4 criteria (1 cost + 3 benefit) and 4 candidates. */

export type IconKey =
  | 'money'
  | 'chip'
  | 'battery'
  | 'camera'
  | 'display'
  | 'star'
  | 'clock'
  | 'shield'
  | 'award'
  | 'gem'
  | 'layers'
  | 'zap'
  | 'gauge'
  | 'thermometer'
  | 'briefcase'
  | 'bag'
  | 'ruler'
  | 'footprints'
  | 'shirt'
  | 'book'
  | 'droplets'

export type Criterion = {
  id: string
  name: string
  type: 'cost' | 'benefit'
  desc: string
  icon: IconKey
  unit?: string
}

export type Candidate = {
  name: string
  brand: string
  price: number
  specs: { label: string; value: string }[]
  values: Record<string, number>
  tags: string[]
}

export type Dataset = {
  unit: string
  filters: string[]
  criteria: Criterion[]
  candidates: Candidate[]
}

const price = (desc: string): Criterion => ({
  id: 'price',
  name: 'Price',
  type: 'cost',
  desc,
  icon: 'money',
})

/* ── Technology ───────────────────────────────────────────────── */

const smartphone: Dataset = {
  unit: 'Smartphone',
  filters: ['Flagship', 'Best Camera', 'Long Battery', 'Value for Money'],
  criteria: [
    price('Purchase price — the lower the better.'),
    { id: 'perf', name: 'Performance', type: 'benefit', desc: 'Chipset benchmark score and everyday multitasking smoothness.', icon: 'chip', unit: 'pts' },
    { id: 'battery', name: 'Battery Life', type: 'benefit', desc: 'Battery endurance for a full day of use.', icon: 'battery', unit: 'hours' },
    { id: 'camera', name: 'Camera Quality', type: 'benefit', desc: 'Photo and video quality from the camera score.', icon: 'camera', unit: 'DxO' },
  ],
  candidates: [
    {
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 23999000,
      specs: [
        { label: 'Chipset', value: 'A17 Pro' },
        { label: 'Storage', value: '256 GB' },
        { label: 'Camera', value: '48 MP' },
      ],
      values: { price: 23999000, perf: 91, battery: 29, camera: 154 },
      tags: ['Flagship', 'Best Camera'],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 21999000,
      specs: [
        { label: 'Chipset', value: 'Snapdragon 8 Gen 3' },
        { label: 'Storage', value: '256 GB' },
        { label: 'Camera', value: '200 MP' },
      ],
      values: { price: 21999000, perf: 90, battery: 30, camera: 152 },
      tags: ['Flagship', 'Long Battery', 'Best Camera'],
    },
    {
      name: 'Xiaomi 14 Ultra',
      brand: 'Xiaomi',
      price: 18999000,
      specs: [
        { label: 'Chipset', value: 'Snapdragon 8 Gen 3' },
        { label: 'Storage', value: '512 GB' },
        { label: 'Camera', value: '50 MP Quad' },
      ],
      values: { price: 18999000, perf: 88, battery: 27, camera: 150 },
      tags: ['Flagship', 'Best Camera'],
    },
    {
      name: 'Google Pixel 8 Pro',
      brand: 'Google',
      price: 16500000,
      specs: [
        { label: 'Chipset', value: 'Tensor G3' },
        { label: 'Storage', value: '128 GB' },
        { label: 'Camera', value: '50 MP AI' },
      ],
      values: { price: 16500000, perf: 80, battery: 26, camera: 148 },
      tags: ['Value for Money', 'Best Camera'],
    },
  ],
}

const laptop: Dataset = {
  unit: 'Laptop',
  filters: ['Premium', 'Value for Money', 'Best Display', 'Long Battery'],
  criteria: [
    price('Purchase price — the lower the better.'),
    { id: 'perf', name: 'Performance', type: 'benefit', desc: 'CPU score and everyday multitasking smoothness.', icon: 'chip', unit: 'pts' },
    { id: 'battery', name: 'Battery Life', type: 'benefit', desc: 'Hours of use for a full day of mobile work.', icon: 'battery', unit: 'hours' },
    { id: 'display', name: 'Display Quality', type: 'benefit', desc: 'Colour accuracy, brightness and screen resolution.', icon: 'display', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'MacBook Air M3',
      brand: 'Apple',
      price: 19999000,
      specs: [
        { label: 'Chipset', value: 'Apple M3' },
        { label: 'RAM', value: '16 GB' },
        { label: 'Storage', value: '512 GB' },
      ],
      values: { price: 19999000, perf: 96, battery: 18, display: 92 },
      tags: ['Premium', 'Long Battery'],
    },
    {
      name: 'ThinkPad T14s Gen 4',
      brand: 'Lenovo',
      price: 17200000,
      specs: [
        { label: 'Chipset', value: 'Ryzen 7 PRO' },
        { label: 'RAM', value: '32 GB' },
        { label: 'Storage', value: '1 TB' },
      ],
      values: { price: 17200000, perf: 88, battery: 16, display: 78 },
      tags: ['Value for Money', 'Long Battery'],
    },
    {
      name: 'Dell XPS 13 Plus',
      brand: 'Dell',
      price: 19500000,
      specs: [
        { label: 'Chipset', value: 'Core i7-1360P' },
        { label: 'RAM', value: '16 GB' },
        { label: 'Storage', value: '512 GB' },
      ],
      values: { price: 19500000, perf: 86, battery: 12, display: 95 },
      tags: ['Premium', 'Best Display'],
    },
    {
      name: 'ASUS Zenbook 14 OLED',
      brand: 'ASUS',
      price: 15499000,
      specs: [
        { label: 'Chipset', value: 'Core Ultra 7' },
        { label: 'RAM', value: '16 GB' },
        { label: 'Storage', value: '512 GB' },
      ],
      values: { price: 15499000, perf: 84, battery: 14, display: 90 },
      tags: ['Value for Money', 'Best Display'],
    },
  ],
}

const tablet: Dataset = {
  unit: 'Tablet',
  filters: ['Premium', 'Value for Money', 'Best Display', 'Long Battery'],
  criteria: [
    price('Purchase price — the lower the better.'),
    { id: 'perf', name: 'Performance', type: 'benefit', desc: 'Chipset score for apps and graphic design work.', icon: 'chip', unit: 'pts' },
    { id: 'battery', name: 'Battery Life', type: 'benefit', desc: 'Battery endurance for streaming and note-taking.', icon: 'battery', unit: 'hours' },
    { id: 'display', name: 'Display Quality', type: 'benefit', desc: 'Panel type, resolution and refresh rate.', icon: 'display', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'iPad Air M2',
      brand: 'Apple',
      price: 11499000,
      specs: [
        { label: 'Chipset', value: 'Apple M2' },
        { label: 'Storage', value: '128 GB' },
        { label: 'Display', value: '11" Liquid Retina' },
      ],
      values: { price: 11499000, perf: 94, battery: 14, display: 93 },
      tags: ['Premium', 'Best Display'],
    },
    {
      name: 'Galaxy Tab S9',
      brand: 'Samsung',
      price: 12999000,
      specs: [
        { label: 'Chipset', value: 'Snapdragon 8 Gen 2' },
        { label: 'Storage', value: '256 GB' },
        { label: 'Display', value: '11" AMOLED' },
      ],
      values: { price: 12999000, perf: 92, battery: 15, display: 95 },
      tags: ['Premium', 'Best Display'],
    },
    {
      name: 'Xiaomi Pad 6',
      brand: 'Xiaomi',
      price: 4999000,
      specs: [
        { label: 'Chipset', value: 'Snapdragon 870' },
        { label: 'Storage', value: '128 GB' },
        { label: 'Display', value: '11" 144Hz' },
      ],
      values: { price: 4999000, perf: 82, battery: 16, display: 88 },
      tags: ['Value for Money', 'Long Battery'],
    },
    {
      name: 'Lenovo Tab P12',
      brand: 'Lenovo',
      price: 5299000,
      specs: [
        { label: 'Chipset', value: 'Dimensity 7050' },
        { label: 'Storage', value: '128 GB' },
        { label: 'Display', value: '12.7" 3K' },
      ],
      values: { price: 5299000, perf: 74, battery: 18, display: 85 },
      tags: ['Value for Money', 'Long Battery'],
    },
  ],
}

const monitor: Dataset = {
  unit: 'Monitor',
  filters: ['Gaming', 'Creator', 'Value for Money', 'Colour Accurate'],
  criteria: [
    price('Purchase price — the lower the better.'),
    { id: 'refresh', name: 'Refresh Rate', type: 'benefit', desc: 'Higher Hz keeps fast motion smoother.', icon: 'gauge', unit: 'Hz' },
    { id: 'resolution', name: 'Resolution', type: 'benefit', desc: 'Vertical pixel count — higher is sharper.', icon: 'display', unit: 'p' },
    { id: 'color', name: 'Colour Accuracy', type: 'benefit', desc: 'Colour coverage and accuracy for visual work.', icon: 'star', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'LG UltraGear 27GR',
      brand: 'LG',
      price: 4599000,
      specs: [
        { label: 'Panel', value: 'Nano IPS' },
        { label: 'Resolution', value: 'QHD' },
        { label: 'Refresh', value: '165 Hz' },
      ],
      values: { price: 4599000, refresh: 165, resolution: 1440, color: 95 },
      tags: ['Gaming', 'Value for Money'],
    },
    {
      name: 'Samsung Odyssey G5',
      brand: 'Samsung',
      price: 4199000,
      specs: [
        { label: 'Panel', value: 'VA' },
        { label: 'Resolution', value: 'QHD' },
        { label: 'Refresh', value: '144 Hz' },
      ],
      values: { price: 4199000, refresh: 144, resolution: 1440, color: 88 },
      tags: ['Gaming', 'Value for Money'],
    },
    {
      name: 'Dell UltraSharp U2723QE',
      brand: 'Dell',
      price: 9899000,
      specs: [
        { label: 'Panel', value: 'IPS Black' },
        { label: 'Resolution', value: '4K' },
        { label: 'Refresh', value: '60 Hz' },
      ],
      values: { price: 9899000, refresh: 60, resolution: 2160, color: 98 },
      tags: ['Creator', 'Colour Accurate'],
    },
    {
      name: 'ASUS ProArt PA248',
      brand: 'ASUS',
      price: 5199000,
      specs: [
        { label: 'Panel', value: 'IPS' },
        { label: 'Resolution', value: 'FHD' },
        { label: 'Refresh', value: '75 Hz' },
      ],
      values: { price: 5199000, refresh: 75, resolution: 1920, color: 96 },
      tags: ['Creator', 'Colour Accurate'],
    },
  ],
}

const gamingPc: Dataset = {
  unit: 'Custom PC',
  filters: ['Gaming', 'Creator', 'Value for Money', 'Beginner'],
  criteria: [
    price('Build cost — the lower the better.'),
    { id: 'perf', name: 'Gaming Performance', type: 'benefit', desc: 'Average FPS in AAA games at 1080p high.', icon: 'zap', unit: 'FPS' },
    { id: 'ram', name: 'RAM Capacity', type: 'benefit', desc: 'Memory capacity for multitasking and rendering.', icon: 'layers', unit: 'GB' },
    { id: 'storage', name: 'Storage', type: 'benefit', desc: 'Space for games and projects.', icon: 'chip', unit: 'GB' },
  ],
  candidates: [
    {
      name: 'Nebula RTX 4070',
      brand: 'Custom Build',
      price: 21500000,
      specs: [
        { label: 'CPU', value: 'Ryzen 5 7600' },
        { label: 'GPU', value: 'RTX 4070' },
        { label: 'RAM', value: '32 GB' },
      ],
      values: { price: 21500000, perf: 118, ram: 32, storage: 1000 },
      tags: ['Gaming', 'Value for Money'],
    },
    {
      name: 'Aurora RTX 4080',
      brand: 'Custom Build',
      price: 32999000,
      specs: [
        { label: 'CPU', value: 'Core i7-14700F' },
        { label: 'GPU', value: 'RTX 4080' },
        { label: 'RAM', value: '32 GB' },
      ],
      values: { price: 32999000, perf: 165, ram: 32, storage: 2000 },
      tags: ['Gaming', 'Creator'],
    },
    {
      name: 'Starter RX 7600',
      brand: 'Custom Build',
      price: 11500000,
      specs: [
        { label: 'CPU', value: 'Ryzen 5 5600' },
        { label: 'GPU', value: 'RX 7600' },
        { label: 'RAM', value: '16 GB' },
      ],
      values: { price: 11500000, perf: 78, ram: 16, storage: 500 },
      tags: ['Beginner', 'Value for Money'],
    },
    {
      name: 'Creator RTX 4070 Ti',
      brand: 'Custom Build',
      price: 27500000,
      specs: [
        { label: 'CPU', value: 'Core i7-14700' },
        { label: 'GPU', value: 'RTX 4070 Ti' },
        { label: 'RAM', value: '64 GB' },
      ],
      values: { price: 27500000, perf: 142, ram: 64, storage: 2000 },
      tags: ['Creator', 'Gaming'],
    },
  ],
}

const processor: Dataset = {
  unit: 'Processor',
  filters: ['Gaming', 'Multitasking', 'Value for Money', 'Power Efficient'],
  criteria: [
    price('Processor price — the lower the better.'),
    { id: 'bench', name: 'Benchmark Score', type: 'benefit', desc: 'Multi-core score for work and gaming.', icon: 'chip', unit: 'pts' },
    { id: 'cores', name: 'Core Count', type: 'benefit', desc: 'More cores help rendering and multitasking.', icon: 'layers', unit: 'core' },
    { id: 'power', name: 'Power Draw', type: 'cost', desc: 'TDP power consumption — lower is more efficient.', icon: 'zap', unit: 'W' },
  ],
  candidates: [
    {
      name: 'Ryzen 7 7800X3D',
      brand: 'AMD',
      price: 6200000,
      specs: [
        { label: 'Core', value: '8C/16T' },
        { label: 'Clock', value: '5.0 GHz' },
        { label: 'TDP', value: '120 W' },
      ],
      values: { price: 6200000, bench: 96, cores: 8, power: 120 },
      tags: ['Gaming', 'Power Efficient'],
    },
    {
      name: 'Core i5-14600K',
      brand: 'Intel',
      price: 4300000,
      specs: [
        { label: 'Core', value: '14C/20T' },
        { label: 'Clock', value: '5.3 GHz' },
        { label: 'TDP', value: '181 W' },
      ],
      values: { price: 4300000, bench: 92, cores: 14, power: 181 },
      tags: ['Value for Money', 'Multitasking'],
    },
    {
      name: 'Ryzen 5 7600',
      brand: 'AMD',
      price: 3100000,
      specs: [
        { label: 'Core', value: '6C/12T' },
        { label: 'Clock', value: '5.1 GHz' },
        { label: 'TDP', value: '105 W' },
      ],
      values: { price: 3100000, bench: 82, cores: 6, power: 105 },
      tags: ['Value for Money', 'Power Efficient'],
    },
    {
      name: 'Core i7-14700K',
      brand: 'Intel',
      price: 6900000,
      specs: [
        { label: 'Core', value: '20C/28T' },
        { label: 'Clock', value: '5.6 GHz' },
        { label: 'TDP', value: '253 W' },
      ],
      values: { price: 6900000, bench: 99, cores: 20, power: 253 },
      tags: ['Multitasking', 'Gaming'],
    },
  ],
}

const gpu: Dataset = {
  unit: 'Graphics Card',
  filters: ['Gaming', 'Power Efficient', 'Value for Money', 'Ray Tracing'],
  criteria: [
    price('Graphics card price — the lower the better.'),
    { id: 'bench', name: 'Benchmark Score', type: 'benefit', desc: 'Average FPS at 1440p resolution.', icon: 'gauge', unit: 'FPS' },
    { id: 'vram', name: 'VRAM', type: 'benefit', desc: 'Memory for textures and render workloads.', icon: 'layers', unit: 'GB' },
    { id: 'power', name: 'Power Draw', type: 'cost', desc: 'Power consumption — lower is more efficient.', icon: 'zap', unit: 'W' },
  ],
  candidates: [
    {
      name: 'GeForce RTX 4070 Super',
      brand: 'NVIDIA',
      price: 10500000,
      specs: [
        { label: 'VRAM', value: '12 GB' },
        { label: 'TDP', value: '220 W' },
        { label: 'Connector', value: '12VHPWR' },
      ],
      values: { price: 10500000, bench: 96, vram: 12, power: 220 },
      tags: ['Gaming', 'Ray Tracing'],
    },
    {
      name: 'Radeon RX 7800 XT',
      brand: 'AMD',
      price: 8900000,
      specs: [
        { label: 'VRAM', value: '16 GB' },
        { label: 'TDP', value: '263 W' },
        { label: 'Connector', value: '2× 8-pin' },
      ],
      values: { price: 8900000, bench: 92, vram: 16, power: 263 },
      tags: ['Value for Money', 'Gaming'],
    },
    {
      name: 'GeForce RTX 4060 Ti',
      brand: 'NVIDIA',
      price: 7200000,
      specs: [
        { label: 'VRAM', value: '8 GB' },
        { label: 'TDP', value: '160 W' },
        { label: 'Connector', value: '8-pin' },
      ],
      values: { price: 7200000, bench: 78, vram: 8, power: 160 },
      tags: ['Value for Money', 'Power Efficient'],
    },
    {
      name: 'Radeon RX 7900 GRE',
      brand: 'AMD',
      price: 11800000,
      specs: [
        { label: 'VRAM', value: '16 GB' },
        { label: 'TDP', value: '260 W' },
        { label: 'Connector', value: '2× 8-pin' },
      ],
      values: { price: 11800000, bench: 104, vram: 16, power: 260 },
      tags: ['Gaming', 'Value for Money'],
    },
  ],
}

/* ── Education ────────────────────────────────────────────────── */

const onlineCourse: Dataset = {
  unit: 'Online Course',
  filters: ['Popular', 'Beginner', 'Certificate', 'Value for Money'],
  criteria: [
    price('Course price — the lower the better.'),
    { id: 'rating', name: 'Rating', type: 'benefit', desc: 'Learner ratings of the course quality.', icon: 'star', unit: '/5' },
    { id: 'content', name: 'Course Hours', type: 'benefit', desc: 'Total duration of video lessons and materials.', icon: 'clock', unit: 'hours' },
    { id: 'support', name: 'Job Support', type: 'benefit', desc: 'Career coaching, portfolio review and certificate.', icon: 'briefcase', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Data Analytics Career Track',
      brand: 'Coursera',
      price: 1200000,
      specs: [
        { label: 'Platform', value: 'Coursera' },
        { label: 'Level', value: 'Beginner' },
        { label: 'Duration', value: '6 months' },
      ],
      values: { price: 1200000, rating: 4.8, content: 120, support: 90 },
      tags: ['Popular', 'Certificate'],
    },
    {
      name: 'Fullstack Web Development',
      brand: 'Udemy',
      price: 349000,
      specs: [
        { label: 'Platform', value: 'Udemy' },
        { label: 'Level', value: 'All level' },
        { label: 'Duration', value: '62 hours' },
      ],
      values: { price: 349000, rating: 4.6, content: 62, support: 55 },
      tags: ['Value for Money', 'Beginner'],
    },
    {
      name: 'Machine Learning Path',
      brand: 'Dicoding',
      price: 1000000,
      specs: [
        { label: 'Platform', value: 'Dicoding' },
        { label: 'Level', value: 'Intermediate' },
        { label: 'Duration', value: '90 hours' },
      ],
      values: { price: 1000000, rating: 4.9, content: 90, support: 85 },
      tags: ['Certificate', 'Popular'],
    },
    {
      name: 'CS50 Introduction',
      brand: 'edX',
      price: 500000,
      specs: [
        { label: 'Platform', value: 'edX' },
        { label: 'Level', value: 'Beginner' },
        { label: 'Duration', value: '80 hours' },
      ],
      values: { price: 500000, rating: 4.7, content: 80, support: 70 },
      tags: ['Beginner', 'Value for Money'],
    },
  ],
}

const bootcamp: Dataset = {
  unit: 'Bootcamp',
  filters: ['Full-time', 'Part-time', 'Job Guarantee', 'Value for Money'],
  criteria: [
    price('Bootcamp tuition — the lower the better.'),
    { id: 'rating', name: 'Alumni Rating', type: 'benefit', desc: 'Alumni satisfaction with the curriculum and mentors.', icon: 'star', unit: '/5' },
    { id: 'placement', name: 'Job Placement', type: 'benefit', desc: 'Share of alumni hired after graduating.', icon: 'briefcase', unit: '%' },
    { id: 'duration', name: 'Duration', type: 'cost', desc: 'Programme length — shorter is more efficient.', icon: 'clock', unit: 'weeks' },
  ],
  candidates: [
    {
      name: 'Hacktiv8 Fullstack',
      brand: 'Hacktiv8',
      price: 18000000,
      specs: [
        { label: 'Duration', value: '12 weeks' },
        { label: 'Format', value: 'Full-time' },
        { label: 'Job Guarantee', value: 'Yes' },
      ],
      values: { price: 18000000, rating: 4.8, placement: 92, duration: 12 },
      tags: ['Full-time', 'Job Guarantee'],
    },
    {
      name: 'Purwadhika Data Science',
      brand: 'Purwadhika',
      price: 16000000,
      specs: [
        { label: 'Duration', value: '12 weeks' },
        { label: 'Format', value: 'Full-time' },
        { label: 'Job Guarantee', value: 'Yes' },
      ],
      values: { price: 16000000, rating: 4.7, placement: 88, duration: 12 },
      tags: ['Full-time', 'Job Guarantee'],
    },
    {
      name: 'Binar Academy UI/UX',
      brand: 'Binar',
      price: 9500000,
      specs: [
        { label: 'Duration', value: '16 weeks' },
        { label: 'Format', value: 'Part-time' },
        { label: 'Job Guarantee', value: 'No' },
      ],
      values: { price: 9500000, rating: 4.5, placement: 74, duration: 16 },
      tags: ['Part-time', 'Value for Money'],
    },
    {
      name: 'Dibimbing Data Analytics',
      brand: 'Dibimbing',
      price: 12500000,
      specs: [
        { label: 'Duration', value: '14 weeks' },
        { label: 'Format', value: 'Part-time' },
        { label: 'Job Guarantee', value: 'Yes' },
      ],
      values: { price: 12500000, rating: 4.6, placement: 82, duration: 14 },
      tags: ['Part-time', 'Job Guarantee'],
    },
  ],
}

const university: Dataset = {
  unit: 'University',
  filters: ['Public', 'Private', 'Top Accredited', 'Industry Network'],
  criteria: [
    price('Annual tuition — the lower the better.'),
    { id: 'accreditation', name: 'Accreditation', type: 'benefit', desc: 'Accreditation grade of the study programme.', icon: 'award', unit: 'pts' },
    { id: 'ratio', name: 'Faculty Ratio', type: 'benefit', desc: 'Quality of academic supervision for students.', icon: 'book', unit: 'pts' },
    { id: 'employment', name: 'Employment Rate', type: 'benefit', desc: 'Graduates employed within 6 months of graduation.', icon: 'briefcase', unit: '%' },
  ],
  candidates: [
    {
      name: 'Informatics ITB',
      brand: 'ITB',
      price: 12500000,
      specs: [
        { label: 'Programme', value: 'BSc Informatics' },
        { label: 'Accreditation', value: 'Excellent' },
        { label: 'Location', value: 'Bandung' },
      ],
      values: { price: 12500000, accreditation: 100, ratio: 92, employment: 95 },
      tags: ['Public', 'Top Accredited'],
    },
    {
      name: 'Computer Science UI',
      brand: 'UI',
      price: 11000000,
      specs: [
        { label: 'Programme', value: 'BSc Computer Science' },
        { label: 'Accreditation', value: 'Excellent' },
        { label: 'Location', value: 'Depok' },
      ],
      values: { price: 11000000, accreditation: 100, ratio: 90, employment: 93 },
      tags: ['Public', 'Top Accredited'],
    },
    {
      name: 'Informatics Engineering UGM',
      brand: 'UGM',
      price: 9500000,
      specs: [
        { label: 'Programme', value: 'BSc Informatics Engineering' },
        { label: 'Accreditation', value: 'Excellent' },
        { label: 'Location', value: 'Yogyakarta' },
      ],
      values: { price: 9500000, accreditation: 98, ratio: 88, employment: 90 },
      tags: ['Public', 'Top Accredited'],
    },
    {
      name: 'Computer Science Binus',
      brand: 'Binus',
      price: 32000000,
      specs: [
        { label: 'Programme', value: 'BSc Computer Science' },
        { label: 'Accreditation', value: 'Excellent' },
        { label: 'Location', value: 'Jakarta' },
      ],
      values: { price: 32000000, accreditation: 96, ratio: 84, employment: 94 },
      tags: ['Private', 'Industry Network'],
    },
  ],
}

const certification: Dataset = {
  unit: 'Certification',
  filters: ['Cloud', 'Data', 'Management', 'Beginner'],
  criteria: [
    price('Exam fee — the lower the better.'),
    { id: 'recognition', name: 'Industry Recognition', type: 'benefit', desc: 'How well the industry recognises the certificate.', icon: 'award', unit: 'pts' },
    { id: 'validity', name: 'Validity Period', type: 'benefit', desc: 'How long the certificate stays valid before renewal.', icon: 'clock', unit: 'years' },
    { id: 'passRate', name: 'Pass Rate', type: 'benefit', desc: 'Chance of passing on the first attempt.', icon: 'shield', unit: '%' },
  ],
  candidates: [
    {
      name: 'AWS Solutions Architect',
      brand: 'Amazon Web Services',
      price: 2250000,
      specs: [
        { label: 'Provider', value: 'AWS' },
        { label: 'Level', value: 'Associate' },
        { label: 'Validity', value: '3 years' },
      ],
      values: { price: 2250000, recognition: 96, validity: 3, passRate: 72 },
      tags: ['Cloud'],
    },
    {
      name: 'Google Data Analytics',
      brand: 'Google',
      price: 1500000,
      specs: [
        { label: 'Provider', value: 'Google' },
        { label: 'Level', value: 'Beginner' },
        { label: 'Validity', value: '3 years' },
      ],
      values: { price: 1500000, recognition: 90, validity: 3, passRate: 80 },
      tags: ['Data', 'Beginner'],
    },
    {
      name: 'Project Management Professional',
      brand: 'PMI',
      price: 8500000,
      specs: [
        { label: 'Provider', value: 'PMI' },
        { label: 'Level', value: 'Professional' },
        { label: 'Validity', value: '3 years' },
      ],
      values: { price: 8500000, recognition: 94, validity: 3, passRate: 60 },
      tags: ['Management'],
    },
    {
      name: 'Cisco CCNA',
      brand: 'Cisco',
      price: 4500000,
      specs: [
        { label: 'Provider', value: 'Cisco' },
        { label: 'Level', value: 'Associate' },
        { label: 'Validity', value: '3 years' },
      ],
      values: { price: 4500000, recognition: 92, validity: 3, passRate: 65 },
      tags: ['Cloud'],
    },
  ],
}

const trainingProgram: Dataset = {
  unit: 'Training Program',
  filters: ['Online', 'Hybrid', 'Beginner', 'Value for Money'],
  criteria: [
    price('Programme fee — the lower the better.'),
    { id: 'rating', name: 'Participant Rating', type: 'benefit', desc: 'Participant ratings of the material and trainers.', icon: 'star', unit: '/5' },
    { id: 'duration', name: 'Duration', type: 'cost', desc: 'Programme length — shorter is more efficient.', icon: 'clock', unit: 'weeks' },
    { id: 'certificate', name: 'Certificate', type: 'benefit', desc: 'Value of the certificate for portfolio and career.', icon: 'award', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Digital Marketing Intensive',
      brand: 'MySkill',
      price: 1500000,
      specs: [
        { label: 'Duration', value: '4 weeks' },
        { label: 'Mode', value: 'Online' },
        { label: 'Level', value: 'Beginner' },
      ],
      values: { price: 1500000, rating: 4.7, duration: 4, certificate: 90 },
      tags: ['Online', 'Beginner'],
    },
    {
      name: 'UI/UX Design Sprint',
      brand: 'Skilvul',
      price: 2400000,
      specs: [
        { label: 'Duration', value: '8 weeks' },
        { label: 'Mode', value: 'Online' },
        { label: 'Level', value: 'Intermediate' },
      ],
      values: { price: 2400000, rating: 4.8, duration: 8, certificate: 95 },
      tags: ['Online'],
    },
    {
      name: 'Public Speaking Bootcamp',
      brand: 'SpeakUp',
      price: 1200000,
      specs: [
        { label: 'Duration', value: '3 weeks' },
        { label: 'Mode', value: 'Hybrid' },
        { label: 'Level', value: 'Beginner' },
      ],
      values: { price: 1200000, rating: 4.5, duration: 3, certificate: 70 },
      tags: ['Hybrid', 'Beginner'],
    },
    {
      name: 'Excel for Business',
      brand: 'MySkill',
      price: 750000,
      specs: [
        { label: 'Duration', value: '2 weeks' },
        { label: 'Mode', value: 'Online' },
        { label: 'Level', value: 'Beginner' },
      ],
      values: { price: 750000, rating: 4.6, duration: 2, certificate: 75 },
      tags: ['Online', 'Value for Money'],
    },
  ],
}

/* ── Fashion ──────────────────────────────────────────────────── */

const fashionCriteria = (qualityDesc: string): Criterion[] => [
  price('Purchase price — the lower the better.'),
  { id: 'quality', name: 'Material Quality', type: 'benefit', desc: qualityDesc, icon: 'layers', unit: 'pts' },
  { id: 'comfort', name: 'Fit & Comfort', type: 'benefit', desc: 'How comfortable the cut feels during a full day of wear.', icon: 'shirt', unit: 'pts' },
  { id: 'durability', name: 'Durability', type: 'benefit', desc: 'How well the fabric holds up after repeated washing.', icon: 'shield', unit: 'pts' },
]

const dress: Dataset = {
  unit: 'Dress',
  filters: ['Formal', 'Casual', 'Party', 'Budget'],
  criteria: fashionCriteria('Fabric quality, stitching and finishing of the dress.'),
  candidates: [
    {
      name: 'Satin Midi Dress',
      brand: 'Zara',
      price: 799000,
      specs: [
        { label: 'Material', value: 'Satin' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Color', value: 'Champagne' },
      ],
      values: { price: 799000, quality: 88, comfort: 82, durability: 74 },
      tags: ['Formal', 'Party'],
    },
    {
      name: 'Linen Wrap Dress',
      brand: 'H&M',
      price: 549000,
      specs: [
        { label: 'Material', value: 'Linen blend' },
        { label: 'Size', value: 'XS–XL' },
        { label: 'Color', value: 'Sage' },
      ],
      values: { price: 549000, quality: 84, comfort: 90, durability: 80 },
      tags: ['Casual', 'Budget'],
    },
    {
      name: 'Pleated Midi Dress',
      brand: 'Uniqlo',
      price: 499000,
      specs: [
        { label: 'Material', value: 'Polyester' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Color', value: 'Navy' },
      ],
      values: { price: 499000, quality: 80, comfort: 88, durability: 86 },
      tags: ['Casual', 'Budget'],
    },
    {
      name: 'Sequin Party Dress',
      brand: 'Mango',
      price: 1299000,
      specs: [
        { label: 'Material', value: 'Sequin' },
        { label: 'Size', value: 'XS–L' },
        { label: 'Color', value: 'Silver' },
      ],
      values: { price: 1299000, quality: 92, comfort: 74, durability: 70 },
      tags: ['Party', 'Formal'],
    },
  ],
}

const shoes: Dataset = {
  unit: 'Shoes',
  filters: ['Casual', 'Comfort', 'Trending', 'Value for Money'],
  criteria: [
    price('Shoe price — the lower the better.'),
    { id: 'comfort', name: 'Comfort', type: 'benefit', desc: 'Cushioning and comfort for long wear.', icon: 'footprints', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Outsole and upper durability.', icon: 'shield', unit: 'pts' },
    { id: 'style', name: 'Style Versatility', type: 'benefit', desc: 'Easy to pair with different outfits.', icon: 'star', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Samba OG',
      brand: 'Adidas',
      price: 1899000,
      specs: [
        { label: 'Material', value: 'Suede & leather' },
        { label: 'Size', value: '36–45' },
        { label: 'Color', value: 'White/Black' },
      ],
      values: { price: 1899000, comfort: 86, durability: 88, style: 95 },
      tags: ['Trending', 'Casual'],
    },
    {
      name: "Air Force 1 '07",
      brand: 'Nike',
      price: 1549000,
      specs: [
        { label: 'Material', value: 'Synthetic leather' },
        { label: 'Size', value: '36–45' },
        { label: 'Color', value: 'Triple White' },
      ],
      values: { price: 1549000, comfort: 92, durability: 90, style: 90 },
      tags: ['Casual', 'Comfort'],
    },
    {
      name: '574 Core',
      brand: 'New Balance',
      price: 1349000,
      specs: [
        { label: 'Material', value: 'Mesh & suede' },
        { label: 'Size', value: '36–45' },
        { label: 'Color', value: 'Grey' },
      ],
      values: { price: 1349000, comfort: 95, durability: 84, style: 86 },
      tags: ['Comfort', 'Value for Money'],
    },
    {
      name: 'Chuck 70 High',
      brand: 'Converse',
      price: 1099000,
      specs: [
        { label: 'Material', value: 'Canvas' },
        { label: 'Size', value: '36–45' },
        { label: 'Color', value: 'Black' },
      ],
      values: { price: 1099000, comfort: 78, durability: 82, style: 88 },
      tags: ['Casual', 'Value for Money'],
    },
  ],
}

const accessories: Dataset = {
  unit: 'Accessories',
  filters: ['Leather', 'Daily', 'Budget', 'Patterned'],
  criteria: [
    price('Accessory price — the lower the better.'),
    { id: 'material', name: 'Material', type: 'benefit', desc: 'Quality of the material and hardware.', icon: 'gem', unit: 'pts' },
    { id: 'versatility', name: 'Versatility', type: 'benefit', desc: 'Works across many styles and occasions.', icon: 'bag', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Resistance to daily wear and tear.', icon: 'shield', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Leather Tote Bag',
      brand: 'Fossil',
      price: 1299000,
      specs: [
        { label: 'Material', value: 'Cow leather' },
        { label: 'Size', value: 'Medium' },
        { label: 'Color', value: 'Brown' },
      ],
      values: { price: 1299000, material: 90, versatility: 92, durability: 88 },
      tags: ['Leather', 'Daily'],
    },
    {
      name: 'Classic Leather Belt',
      brand: 'Levi’s',
      price: 649000,
      specs: [
        { label: 'Material', value: 'Leather' },
        { label: 'Size', value: 'M–XL' },
        { label: 'Color', value: 'Black' },
      ],
      values: { price: 649000, material: 84, versatility: 95, durability: 86 },
      tags: ['Leather', 'Daily'],
    },
    {
      name: 'Silk Scarf',
      brand: 'Uniqlo',
      price: 299000,
      specs: [
        { label: 'Material', value: 'Silk blend' },
        { label: 'Size', value: '90×90 cm' },
        { label: 'Color', value: 'Patterned' },
      ],
      values: { price: 299000, material: 86, versatility: 80, durability: 70 },
      tags: ['Budget', 'Patterned'],
    },
    {
      name: 'Baseball Cap',
      brand: 'New Era',
      price: 459000,
      specs: [
        { label: 'Material', value: 'Cotton' },
        { label: 'Size', value: 'All size' },
        { label: 'Color', value: 'Navy' },
      ],
      values: { price: 459000, material: 78, versatility: 84, durability: 82 },
      tags: ['Daily', 'Budget'],
    },
  ],
}

const jewelry: Dataset = {
  unit: 'Jewelry',
  filters: ['Gold', 'Silver', 'Daily', 'Budget'],
  criteria: [
    price('Jewelry price — the lower the better.'),
    { id: 'material', name: 'Material', type: 'benefit', desc: 'Purity of the metal and stones used.', icon: 'gem', unit: 'pts' },
    { id: 'design', name: 'Design', type: 'benefit', desc: 'Originality of the design and finishing neatness.', icon: 'star', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Resistance to scratches and tarnishing.', icon: 'shield', unit: 'pts' },
  ],
  candidates: [
    {
      name: '18K Gold Bracelet',
      brand: 'Antam',
      price: 4800000,
      specs: [
        { label: 'Material', value: '18K gold' },
        { label: 'Size', value: '16 cm' },
        { label: 'Certificate', value: 'Yes' },
      ],
      values: { price: 4800000, material: 96, design: 86, durability: 95 },
      tags: ['Gold', 'Daily'],
    },
    {
      name: '925 Silver Necklace',
      brand: 'Lorina',
      price: 1250000,
      specs: [
        { label: 'Material', value: '925 silver' },
        { label: 'Size', value: '45 cm' },
        { label: 'Certificate', value: 'Yes' },
      ],
      values: { price: 1250000, material: 86, design: 90, durability: 82 },
      tags: ['Silver', 'Daily'],
    },
    {
      name: 'Titanium Ring',
      brand: 'Velora',
      price: 890000,
      specs: [
        { label: 'Material', value: 'Titanium' },
        { label: 'Size', value: '12–20' },
        { label: 'Certificate', value: 'No' },
      ],
      values: { price: 890000, material: 82, design: 84, durability: 96 },
      tags: ['Daily', 'Budget'],
    },
    {
      name: 'Zirconia Earrings',
      brand: 'Orori',
      price: 650000,
      specs: [
        { label: 'Material', value: 'Silver + zirconia' },
        { label: 'Size', value: 'One size' },
        { label: 'Certificate', value: 'No' },
      ],
      values: { price: 650000, material: 74, design: 88, durability: 70 },
      tags: ['Budget', 'Silver'],
    },
  ],
}

const outerwear: Dataset = {
  unit: 'Outerwear',
  filters: ['Daily', 'Premium', 'Outdoor', 'Streetwear'],
  criteria: [
    price('Outerwear price — the lower the better.'),
    { id: 'warmth', name: 'Warmth', type: 'benefit', desc: 'Ability to block cold and wind.', icon: 'thermometer', unit: 'pts' },
    { id: 'water', name: 'Water Resistance', type: 'benefit', desc: 'Resistance to rain and humidity.', icon: 'droplets', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Stitching and outer fabric durability.', icon: 'shield', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Trucker Jacket',
      brand: 'Levi’s',
      price: 1299000,
      specs: [
        { label: 'Material', value: 'Denim' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Season', value: 'All season' },
      ],
      values: { price: 1299000, warmth: 70, water: 60, durability: 94 },
      tags: ['Daily', 'Streetwear'],
    },
    {
      name: 'Trench Coat',
      brand: 'Uniqlo',
      price: 999000,
      specs: [
        { label: 'Material', value: 'Cotton blend' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Season', value: 'Rainy' },
      ],
      values: { price: 999000, warmth: 74, water: 82, durability: 80 },
      tags: ['Daily', 'Premium'],
    },
    {
      name: 'Bomber MA-1',
      brand: 'Alpha Industries',
      price: 1899000,
      specs: [
        { label: 'Material', value: 'Nylon' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Season', value: 'Cold' },
      ],
      values: { price: 1899000, warmth: 88, water: 84, durability: 88 },
      tags: ['Streetwear', 'Premium'],
    },
    {
      name: 'Waterproof Parka',
      brand: 'The North Face',
      price: 3299000,
      specs: [
        { label: 'Material', value: 'DryVent' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Season', value: 'Cold' },
      ],
      values: { price: 3299000, warmth: 96, water: 96, durability: 92 },
      tags: ['Outdoor', 'Premium'],
    },
  ],
}

const tops: Dataset = {
  unit: 'Tops',
  filters: ['Daily', 'Work', 'Budget', 'Premium'],
  criteria: [
    price('Top price — the lower the better.'),
    { id: 'fabric', name: 'Fabric Quality', type: 'benefit', desc: 'Fabric quality, breathability and stitching.', icon: 'layers', unit: 'pts' },
    { id: 'fit', name: 'Fit', type: 'benefit', desc: 'A cut that feels comfortable on the body.', icon: 'ruler', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Shape and colour retention after washing.', icon: 'shield', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Supima Tee',
      brand: 'Uniqlo',
      price: 199000,
      specs: [
        { label: 'Material', value: 'Supima cotton' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Fit', value: 'Regular' },
      ],
      values: { price: 199000, fabric: 86, fit: 88, durability: 82 },
      tags: ['Daily', 'Budget'],
    },
    {
      name: 'Linen Shirt',
      brand: 'Zara',
      price: 499000,
      specs: [
        { label: 'Material', value: 'Linen' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Fit', value: 'Relaxed' },
      ],
      values: { price: 499000, fabric: 90, fit: 84, durability: 80 },
      tags: ['Daily', 'Premium'],
    },
    {
      name: 'Satin Blouse',
      brand: 'H&M',
      price: 399000,
      specs: [
        { label: 'Material', value: 'Satin' },
        { label: 'Size', value: 'XS–XL' },
        { label: 'Fit', value: 'Loose' },
      ],
      values: { price: 399000, fabric: 82, fit: 86, durability: 74 },
      tags: ['Work', 'Budget'],
    },
    {
      name: 'Pique Polo',
      brand: 'Lacoste',
      price: 1299000,
      specs: [
        { label: 'Material', value: 'Pique cotton' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Fit', value: 'Slim' },
      ],
      values: { price: 1299000, fabric: 94, fit: 90, durability: 90 },
      tags: ['Work', 'Premium'],
    },
  ],
}

const bottoms: Dataset = {
  unit: 'Bottoms',
  filters: ['Daily', 'Work', 'Budget', 'Premium'],
  criteria: [
    price('Bottoms price — the lower the better.'),
    { id: 'fabric', name: 'Fabric Quality', type: 'benefit', desc: 'Fabric quality and wearing comfort.', icon: 'layers', unit: 'pts' },
    { id: 'fit', name: 'Fit', type: 'benefit', desc: 'A cut and length that sit well on the body.', icon: 'ruler', unit: 'pts' },
    { id: 'durability', name: 'Durability', type: 'benefit', desc: 'Colour and shape retention after washing.', icon: 'shield', unit: 'pts' },
  ],
  candidates: [
    {
      name: 'Slim Chino',
      brand: 'Uniqlo',
      price: 399000,
      specs: [
        { label: 'Material', value: 'Cotton twill' },
        { label: 'Size', value: '28–38' },
        { label: 'Fit', value: 'Slim' },
      ],
      values: { price: 399000, fabric: 82, fit: 86, durability: 84 },
      tags: ['Work', 'Budget'],
    },
    {
      name: 'Jeans 501 Straight',
      brand: 'Levi’s',
      price: 1099000,
      specs: [
        { label: 'Material', value: 'Denim' },
        { label: 'Size', value: '28–40' },
        { label: 'Fit', value: 'Straight' },
      ],
      values: { price: 1099000, fabric: 94, fit: 88, durability: 96 },
      tags: ['Daily', 'Premium'],
    },
    {
      name: 'Linen Trousers',
      brand: 'Zara',
      price: 599000,
      specs: [
        { label: 'Material', value: 'Linen' },
        { label: 'Size', value: 'S–XL' },
        { label: 'Fit', value: 'Relaxed' },
      ],
      values: { price: 599000, fabric: 88, fit: 82, durability: 76 },
      tags: ['Daily', 'Premium'],
    },
    {
      name: 'Pleated Skirt',
      brand: 'H&M',
      price: 349000,
      specs: [
        { label: 'Material', value: 'Polyester' },
        { label: 'Size', value: 'XS–XL' },
        { label: 'Fit', value: 'Midi' },
      ],
      values: { price: 349000, fabric: 78, fit: 84, durability: 80 },
      tags: ['Work', 'Budget'],
    },
  ],
}

/* ── Registry ─────────────────────────────────────────────────── */

export const datasets: Record<string, Dataset> = {
  Smartphone: smartphone,
  Laptop: laptop,
  Tablet: tablet,
  Monitor: monitor,
  'Gaming PC': gamingPc,
  Processor: processor,
  'Graphics Card': gpu,
  'Online Course': onlineCourse,
  Bootcamp: bootcamp,
  University: university,
  Certification: certification,
  'Training Program': trainingProgram,
  Dress: dress,
  Shoes: shoes,
  Accessories: accessories,
  Jewelry: jewelry,
  Outerwear: outerwear,
  Tops: tops,
  Bottoms: bottoms,
}

export function datasetFor(subcategory: string): Dataset {
  return datasets[subcategory] ?? smartphone
}
