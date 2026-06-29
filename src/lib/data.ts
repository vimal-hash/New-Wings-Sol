// Single source of truth. Each section gets its own accent color.

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Process', href: '#process' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const STATS = [
  { value: '6+', label: 'Years of Excellence', sub: 'since 2019' },
  { value: '120+', label: 'Theatres Transformed', sub: 'and counting' },
  { value: '15+', label: 'Premium Brand Partners', sub: 'global leaders' },
  { value: '99%', label: 'Client Satisfaction', sub: 'verified' },
];

export const BRANDS = [
  { name: 'Galalite', tagline: 'Screens of Tomorrow' },
  { name: 'Christie', tagline: 'Projection Excellence' },
  { name: 'Leonis', tagline: '3D Systems' },
  { name: 'USHIO', tagline: 'Lamp Technology' },
  { name: 'Dolby', tagline: 'Immersive Audio' },
  { name: 'Barco', tagline: 'Visual Solutions' },
  { name: 'JBL', tagline: 'Cinema Sound' },
  { name: 'Harkness', tagline: 'Screen Innovation' },
];

// accent: cobalt | coral | emerald | lavender
export const PRODUCTS = [
  {
    id: 'galalite',
    name: 'Galalite Screens',
    tagline: "World's Highest Gain Cinema Screens",
    description:
      'PRISM 3D 4 with LENSRAY technology. The screen of tomorrow, engineered for unmatched brightness, clarity, and 3D performance.',
    features: ["World's highest gain", 'PRISM 3D technology', 'LENSRAY engineered', 'Premium silver finish'],
    accent: 'cobalt',
    icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  },
  {
    id: 'christie',
    name: 'Christie Projectors',
    tagline: 'Bring Your Vision to Life',
    description:
      'Industry-leading 4K laser projection systems. Hollywood-grade colour accuracy, deep contrast, and reliability trusted by premium cinemas worldwide.',
    features: ['4K RGB pure laser', 'HDR ready', '20,000+ hr lifespan', 'DCI compliant'],
    accent: 'coral',
    icon: 'Projector',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80',
  },
  {
    id: 'leonis',
    name: 'Leonis Systems',
    tagline: 'Light & Sound 3D Engineering',
    description:
      'LLAS-300 light and sound solutions plus TX-Filter and LX-Filter modules. The complete 3D upgrade system for modern theatres.',
    features: ['3D filter wheels', 'Light optimisation', 'Modular install', 'Energy efficient'],
    accent: 'lavender',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&q=80',
  },
  {
    id: 'ushio',
    name: 'USHIO Lamps',
    tagline: 'Extraordinary Performance, Extreme Lifetime',
    description:
      'Japanese-engineered xenon and specialty lamps that deliver consistent brightness over an exceptionally long lifespan, lowering total cost of ownership.',
    features: ['Xenon & specialty', 'Long lifetime', 'Stable colour temp', 'Eco friendly'],
    accent: 'emerald',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
  {
    id: 'sound',
    name: 'Premium Audio Systems',
    tagline: 'Sound that Moves You',
    description:
      'Dolby Atmos and immersive surround systems. End-to-end design, supply, and tuning by certified acousticians for a true theatrical experience.',
    features: ['Dolby Atmos', 'Acoustic tuning', 'Custom design', 'Full calibration'],
    accent: 'coral',
    icon: 'Volume2',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
  },
  {
    id: 'seating',
    name: 'Luxury Recliner Seating',
    tagline: 'Comfort Reimagined',
    description:
      'Power recliners, premium fabrics, cup holders, and integrated controls. Built for the modern premium-class cinema audience.',
    features: ['Power recliners', 'Italian leather', 'Heated options', '10-yr warranty'],
    accent: 'cobalt',
    icon: 'Armchair',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Consultation & Site Audit',
    desc: 'Our engineers visit your theatre, measure acoustics, sightlines, and existing infrastructure to map every detail.',
    accent: 'cobalt',
  },
  {
    step: '02',
    title: 'Concept & 3D Design',
    desc: 'Architects craft a tailored interior concept with 3D renders, material palettes, and seating layouts for approval.',
    accent: 'lavender',
  },
  {
    step: '03',
    title: 'Equipment Curation',
    desc: 'We hand-pick screens, projectors, audio, and seating from our global partners to match your budget and vision.',
    accent: 'coral',
  },
  {
    step: '04',
    title: 'Installation & Calibration',
    desc: 'Our certified technicians install, align, and calibrate every system for cinema-grade picture and sound performance.',
    accent: 'emerald',
  },
  {
    step: '05',
    title: 'Handover & Support',
    desc: 'Staff training, documentation, and a dedicated AMC team to keep your auditorium running flawlessly for years.',
    accent: 'cobalt',
  },
];

export const SHOWCASE_PROJECTS = [
  { title: 'Royal Palace Cinemas', location: 'Chennai, India', category: 'Full Renovation', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80', accent: 'cobalt' },
  { title: 'Aurora Multiplex', location: 'Mumbai, India', category: 'Audio + Projection', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=900&q=80', accent: 'coral' },
  { title: 'Skyline Premium', location: 'Bengaluru, India', category: 'Premium Seating', image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=900&q=80', accent: 'lavender' },
  { title: 'Cinematic Arts House', location: 'Hyderabad, India', category: 'Screen Upgrade', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80', accent: 'emerald' },
  { title: 'Grand Vista Theatre', location: 'Pune, India', category: 'Interior Design', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=900&q=80', accent: 'lavender' },
  { title: 'Imperial Cinema', location: 'Kochi, India', category: 'Complete Build', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&q=80', accent: 'coral' },
];

export const SERVICES = [
  { title: 'Theatre Interior Design', desc: 'End-to-end interior architecture: ceilings, acoustic panels, wall finishes, lobby design, and lighting tailored to your brand.', icon: 'Palette', accent: 'cobalt' },
  { title: 'Cinema Screen Supply', desc: 'Authorized dealership for Galalite & Harkness screens. From standard white to high-gain 3D silver, sized for every auditorium.', icon: 'Monitor', accent: 'lavender' },
  { title: 'Projection Systems', desc: 'Christie & Barco DCI-compliant 4K laser projectors with full integration, calibration, and ongoing support.', icon: 'Projector', accent: 'coral' },
  { title: 'Immersive Audio', desc: 'Dolby Atmos design, JBL speaker installation, amplification, and room tuning by certified acoustic engineers.', icon: 'Volume2', accent: 'emerald' },
  { title: 'Premium Seating', desc: 'Luxury recliners, power seats, and traditional cinema chairs from world-class manufacturers, fully installed.', icon: 'Armchair', accent: 'coral' },
  { title: 'AMC & Support', desc: 'Annual maintenance contracts, lamp replacements, parts supply, and 24/7 emergency technical support pan-India.', icon: 'Wrench', accent: 'cobalt' },
];

export const TESTIMONIALS = [
  { quote: 'New Wings transformed our 25-year-old theatre into a premium destination. The Galalite screen and Christie projector combination is breathtaking. Our footfall has nearly doubled.', author: 'Rajesh Kumar', role: 'Owner, Royal Palace Cinemas', rating: 5, accent: 'cobalt' },
  { quote: 'Professional, punctual, and genuinely passionate about cinema. They handled our four-screen multiplex renovation from concept to commissioning without a single hiccup.', author: 'Priya Menon', role: 'CEO, Aurora Multiplex Group', rating: 5, accent: 'coral' },
  { quote: 'The Leonis 3D system and USHIO lamp upgrade has been flawless for over two years. Their service team responds within hours — best in the industry.', author: 'Mohammed Faraz', role: 'Operations Head, Skyline Premium', rating: 5, accent: 'lavender' },
  { quote: 'We compared three vendors. New Wings delivered the best design, the best brands, and the best price. Our patrons constantly compliment the sound and comfort.', author: 'Anita Desai', role: 'Director, Cinematic Arts House', rating: 5, accent: 'emerald' },
];

export const FAQS = [
  { q: 'What is the typical timeline for a complete theatre renovation?', a: 'A standard single-screen renovation takes 6–10 weeks from concept to handover. Larger multiplex projects with multiple screens typically run 12–20 weeks. We provide a detailed phased timeline after the site audit so you can plan minimum downtime.' },
  { q: 'Do you serve cinemas outside India?', a: 'Yes. We work with exhibitors across Asia, the Middle East, and select projects in Europe and North America. Our partnerships with global brands like Christie, Galalite, and Dolby allow us to deliver internationally with full warranty support.' },
  { q: 'Which brands are you officially authorized to sell?', a: 'We are authorized partners for Galalite Screens, Christie Projectors, Leonis 3D Systems, USHIO Lamps, and several premium audio and seating brands. All products come with full manufacturer warranty and original certification.' },
  { q: 'Can you upgrade just one part of our cinema instead of a full renovation?', a: 'Absolutely. Many clients start with a single upgrade — screens, projection, audio, or seating — and add more later. We design every project to be modular and future-ready.' },
  { q: 'Do you offer financing or staged payment options?', a: 'Yes. We work with major leasing partners and offer flexible payment structures aligned with project milestones. Equipment financing for 24–60 months is available on most premium product lines.' },
  { q: 'What kind of after-sales support do you provide?', a: 'Every project includes a one-year complimentary AMC. Beyond that, we offer tiered AMC packages, on-site engineer visits, parts inventory, and 24/7 phone/online support. Most issues are resolved within 24 hours nationwide.' },
];

export const CONTACT = {
  phone: '+91 9444546390',
  // Single primary inbox. Website enquiries are also emailed here automatically.
  email: 'wingsent07@gmail.com',
  address: 'Chennai, Tamil Nadu, India',
};

// Helper: map accent name to color values
export const ACCENT_MAP = {
  cobalt: {
    bg: 'bg-cobalt-500',
    text: 'text-cobalt-500',
    border: 'border-cobalt-500',
    bgSoft: 'bg-cobalt-50 dark:bg-cobalt-900/20',
    glow: 'glow-cobalt',
    grad: 'text-grad-cobalt',
    hex: '#3B5BFF',
  },
  coral: {
    bg: 'bg-coral-500',
    text: 'text-coral-500',
    border: 'border-coral-500',
    bgSoft: 'bg-coral-50 dark:bg-coral-900/20',
    glow: 'glow-coral',
    grad: 'text-grad-coral',
    hex: '#FF5A38',
  },
  emerald: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    border: 'border-emerald-500',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-900/20',
    glow: 'glow-emerald',
    grad: 'text-grad-emerald',
    hex: '#16A35C',
  },
  lavender: {
    bg: 'bg-lavender-500',
    text: 'text-lavender-500',
    border: 'border-lavender-500',
    bgSoft: 'bg-lavender-50 dark:bg-lavender-900/20',
    glow: 'glow-lavender',
    grad: 'text-grad-lavender',
    hex: '#7E54E9',
  },
} as const;

export type AccentKey = keyof typeof ACCENT_MAP;
