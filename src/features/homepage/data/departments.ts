export const defaultDepartmentImage = "/images/Event-Rektorat-Image.png";

export type DepartmentProgram = {
  name: string;
  description: string;
  href: string;
  imageSrc?: string;
  titleClassName?: string;
};

export type Department = {
  name: string;
  description: string;
  href: string;
  imageSrc?: string;
  titleClassName?: string;
  programs?: DepartmentProgram[];
};

export const departments: Department[] = [
  {
    name: "Teknik Elektro",
    description:
      "Departemen dengan dua program studi sarjana yang bisa ditelusuri langsung dari kartu ini.",
    href: "https://www.its.ac.id/telektro/id/departemen-teknik-elektro-its/",
    imageSrc: "/images/event-departemen-image/Gedung-teknik-elektro.jpeg",
    programs: [
      {
        name: "Teknik Elektro",
        description:
          "Program studi sarjana yang berfokus pada sistem tenaga, elektronika, dan kontrol.",
        href: "https://www.its.ac.id/telektro/id/akademik/program-studi-sarjana/",
      },
      {
        name: "Teknik Telekomunikasi",
        description:
          "Program studi sarjana yang berfokus pada jaringan, sinyal, dan komunikasi digital.",
        href: "https://www.its.ac.id/telektro/id/akademik/prodi-telekomunikasi/",
      },
    ],
  },
  {
    name: "Teknik Informatika",
    description:
      "Departemen dengan tiga program studi sarjana yang bisa ditelusuri melalui animasi flip kartu.",
    href: "https://www.its.ac.id/informatika/id/departemen-teknik-informatika/",
    titleClassName: "text-[1.85rem] md:text-[28px]",
    imageSrc: "/images/event-departemen-image/Gedung-teknik-informatika.jpeg",
    programs: [
      {
        name: "Teknik Informatika",
        description:
          "Program studi sarjana yang berfokus pada fondasi ilmu komputer, algoritma, dan pengembangan sistem.",
        href: "https://www.its.ac.id/informatika/id/akademik/program-studi/program-studi-s1/",
      },
      {
        name: "Rekayasa Perangkat Lunak",
        description:
          "Program studi sarjana yang berfokus pada analisis, desain, dan pengembangan perangkat lunak modern.",
        href: "https://www.its.ac.id/informatika/id/akademik/program-studi/program-studi-sarjana-s1-rekayasa-perangkat-lunak/",
      },
      {
        name: "Rekayasa Kecerdasan Artifisial",
        description:
          "Program studi sarjana yang berfokus pada machine learning, data cerdas, dan sistem berbasis AI.",
        href: "https://www.its.ac.id/informatika/id/akademik/program-studi/program-studi-sarjana-s1-rekayasa-kecerdasan-artifisial/",
      },
    ],
  },
  {
    name: "Sistem Informasi",
    description:
      "Departemen dengan dua program studi sarjana yang bisa dijelajahi lewat flip card.",
    href: "https://www.its.ac.id/si/",
    imageSrc: "/images/event-departemen-image/Gedung-sistem-informasi.jpeg",
    programs: [
      {
        name: "Sistem Informasi",
        description:
          "Program studi sarjana yang berfokus pada integrasi teknologi, proses bisnis, dan kebutuhan organisasi.",
        href: "https://www.its.ac.id/si/program-studi-s1/",
      },
      {
        name: "Inovasi Digital",
        description:
          "Program studi sarjana yang berfokus pada pengembangan produk digital, strategi inovasi, dan transformasi bisnis.",
        href: "https://www.its.ac.id/si/program-studi-inovasi-digital/",
      },
    ],
  },
  {
    name: "Teknik Komputer",
    description:
      "Departemen yang berfokus pada integrasi perangkat lunak dan perangkat keras untuk teknologi masa depan.",
    href: "https://www.its.ac.id/komputer/id/departemen-teknik-komputer-its/",
    imageSrc: "/images/event-departemen-image/Gedung-teknik-komputer.jpeg",
  },
  {
    name: "Teknik Biomedik",
    description:
      "Departemen yang berfokus pada analisa dan sintesa yang kuat dalam bidang spesialisasi Instrumentasi Biomedik, Pengolahan  Sinyal Biomedik, Biomekanika, Kontrol Biomedik, Biomaterial.",
    href: "https://www.its.ac.id/tbiomedik/id/beranda/",
    imageSrc: "/images/event-departemen-image/Gedung-teknik-biomedik.jpeg",
  },
  {
    name: "Teknologi Informasi",
    description:
      "Departemen yang berfokus pada perencananan dan pengelolaan teknologi informasi yang aman, meliputi instalasi, integrasi, kastamisasi, dan pemeliharaan.",
    href: "https://www.its.ac.id/it/id/departemen-teknologi-informasi/",
    titleClassName: "text-[1.85rem] md:text-[28px]",
    imageSrc: "/images/event-departemen-image/Gedung-teknologi-informasi.jpeg",
  },
];
