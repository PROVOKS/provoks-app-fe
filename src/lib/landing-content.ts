export type LandingNavItem = {
  label: string;
  href: string;
};

export const landingNav: LandingNavItem[] = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#about" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Path", href: "#path" },
  { label: "Event", href: "#event" },
];

export const heroContent = {
  title: "PROVOKS",
  tagline: "Programmer Vokasi · Universitas Brawijaya",
  subtitle:
    "UKM Vokasi untuk mengasah kemampuan pemrograman lewat proyek nyata, mentoring sebaya, dan kurikulum yang selaras industri.",
  primaryCta: { label: "Mulai Belajar", href: "/login" },
  secondaryCta: { label: "Lihat Path", href: "#path" },
  proofs: ["Project-based", "Peer-to-peer + mentor", "Industry-aligned"],
  image: "/images/pengurus-provoks.jpeg",
};

export const aboutContent = {
  title: "Apa itu Provoks?",
  definition: "PROVOKS = Programmer Vokasi",
  image: "/images/fotopanitia.jpeg",
  description: [
    "UKM Vokasi bagi para programmer Vokasi di Universitas Brawijaya untuk mengasah, mengembangkan, dan mengeksplorasi dunia pemrograman.",
  ],
  pillars: [
    {
      title: "Project-based",
      description:
        "Belajar lewat proyek nyata, bukan teori yang membosankan.",
    },
    {
      title: "Peer-to-peer + mentor",
      description:
        "Tumbuh bersama teman sebaya dan dibimbing langsung oleh mentor.",
    },
    {
      title: "Industry-aligned",
      description:
        "Kurikulum dan materi mengikuti tren serta standar industri masa kini.",
    },
  ],
};

export const visionMissionContent = {
  vision:
    "Menjadi wadah terdepan dalam melahirkan talenta digital yang kompeten, kreatif, dan berdaya saing.",
  image: "/images/design-C-PROVOKS.png",
  mission: [
    {
      title: "Code",
      description:
        "Membangun kemampuan teknis dan pola pikir problem-solving melalui pembelajaran serta praktik teknologi.",
    },
    {
      title: "Create",
      description:
        "Mendorong anggota untuk menciptakan karya dan solusi teknologi yang inovatif dan berdampak.",
    },
    {
      title: "Conquer",
      description:
        "Menyiapkan anggota untuk berkompetisi dan berkontribusi di industri teknologi.",
    },
  ],
};

export type LandingPathKey = "web" | "mobile" | "iot" | "uiux" | "game";

export type LandingPath = {
  key: LandingPathKey;
  name: string;
  tagline: string;
  image?: string;
};

export const pathsContent: LandingPath[] = [
  {
    key: "web",
    name: "Web Development",
    tagline: "Frontend & Backend",
    image: "/images/path/web.png",
  },
  {
    key: "mobile",
    name: "Mobile Development",
    tagline: "Android & iOS",
    image: "/images/path/mobile.png",
  },
  {
    key: "iot",
    name: "Internet of Things",
    tagline: "Hardware & Firmware",
    image: "/images/path/iot.png",
  },
  {
    key: "uiux",
    name: "UI/UX & PM",
    tagline: "Design & Product",
    image: "/images/path/uiux-pm.png",
  },
  {
    key: "game",
    name: "Game Development",
    tagline: "Game Design & Build",
    image: "/images/path/game.png",
  },
];

export type LandingEvent = {
  title: string;
  description: string;
  images: string[];
};

export const eventsContent: LandingEvent[] = [
  {
    title: "Pameran Karya",
    description:
      "Panggung bagi anggota untuk memamerkan proyek terbaik mereka dan menerima masukan langsung dari praktisi.",
    images: ["/images/panitia-pameran.jpeg"],
  },
  {
    title: "OLIVIA",
    description:
      "Olimpiade Vokasi Indonesia (OLIVIA) adalah kompetisi tahunan nasional bagi mahasiswa vokasi Indonesia untuk mengasah keterampilan teknis, berkompetisi, dan menampilkan karya inovatif.",
    images: [
      "/images/events/olivia.svg",
      "/images/olivia-ub.jpeg",
      "/images/olivia-surabaya.jpeg",
    ],
  },
  {
    title: "Company Visit",
    description:
      "Kunjungan industri untuk melihat langsung budaya kerja, proses produk, dan peluang karier di perusahaan teknologi.",
    images: [
      "/images/events/comvit-v2.jpeg",
      "/images/events/comvit-biznet.jpeg",
    ],
  },
];

export const closingCtaContent = {
  title: "Siap jadi Programmer Vokasi?",
  description:
    "Mulai perjalananmu lewat path terstruktur, mentoring, dan proyek nyata yang siap masuk portofolio.",
  primaryCta: { label: "Mulai Belajar", href: "/login" },
  secondaryCta: { label: "Lihat Path", href: "#path" },
};

export const footerContent = {
  description:
    "PROVOKS (Programmer Vokasi) adalah UKM Vokasi Universitas Brawijaya untuk talenta digital yang siap berkarya.",
  tagline: "Programmer Vokasi · Universitas Brawijaya",
  links: [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang", href: "#about" },
    { label: "Visi & Misi", href: "#visi-misi" },
    { label: "Path", href: "#path" },
    { label: "Event", href: "#event" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Github", href: "#" },
  ],
  contact: "halo@provoks.id",
  copyright: "© 2026 Provoks. All rights reserved.",
};
