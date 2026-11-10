export type LandingNavItem = {
  label: string;
  href: string;
};

export const landingNav: LandingNavItem[] = [
  { label: "Beranda", href: "#beranda" },
  { label: "About", href: "#about" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Path", href: "#path" },
  { label: "Event", href: "#event" },
];

export const heroContent = {
  title: "PROVOKS",
  subtitle:
    "Wadah pengembangan talenta digital yang membekali mahasiswa dengan skill praktis, proyek nyata, dan portofolio siap industri.",
  primaryCta: { label: "Mulai Belajar", href: "/login" },
  image: "/images/team/pengurus.svg",
};

export const aboutContent = {
  title: "Apa itu Provoks?",
  description: [
    "PROVOKS atau Programmer Vokasi adalah UKM Vokasi bagi para programmer Vokasi di Universitas Brawijaya untuk mengasah, mengembangkan, dan mengeksplorasi dunia pemrograman melalui pendekatan project-based yang meninggalkan teori membosankan, peer-to-peer untuk belajar dan berkembang bersama teman sebaya serta mentor, serta industry-aligned dengan kurikulum dan materi yang selalu disesuaikan dengan kebutuhan tren teknologi dan standar industri masa kini.",
  ],
  image: "/images/team/pengurus.svg",
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
        "Membangun kemampuan teknis dan pola pikir problem-solving melalui pembelajaran serta praktik teknologi.",
    },
  ],
};

export type LandingPathKey = "web" | "mobile" | "iot" | "uiux" | "game";

export type LandingPath = {
  key: LandingPathKey;
  name: string;
};

export const pathsContent: LandingPath[] = [
  { key: "web", name: "Web Development" },
  { key: "mobile", name: "Mobile Development"},
  { key: "iot", name: "Internet of Things" },
  { key: "uiux", name: "UI/UX & PM" },
  { key: "game", name: "Game Development" },
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
      "Program kolaboratif yang mendorong anggota belajar, berkompetisi, dan berkarya bersama dalam satu tujuan.",
    images: [
      "/images/events/olivia.svg",
      "/images/events/olivia.svg",
      "/images/events/olivia.svg",
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

export const footerContent = {
  description:
    "Wadah pengembangan talenta digital untuk mahasiswa yang siap berkarya di industri teknologi.",
  links: [
    { label: "Beranda", href: "#beranda" },
    { label: "About", href: "#about" },
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
