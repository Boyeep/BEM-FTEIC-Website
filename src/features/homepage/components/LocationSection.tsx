"use client";

import { useState } from "react";

const departments = [
  {
    name: "Teknik Informatika",
    address: "PQCW+7WH, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117",
    mapsUrl:
      "https://www.google.com/maps/place/Departemen+Teknik+Informatika+ITS/data=!4m2!3m1!1s0x0:0x2b2bcdafc68c9a28?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "60%", y: "42%" },
  },
  {
    name: "Sistem Informasi",
    address: "Kampus ITS, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117",
    mapsUrl:
      "https://www.google.com/maps/place/Departemen+Sistem+Informasi+ITS/data=!4m2!3m1!1s0x0:0x83df57e6a93ef2c2?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "57%", y: "48%" },
  },
  {
    name: "Teknik Biomedik",
    address: "PQ8W+9M4, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117",
    mapsUrl:
      "https://www.google.com/maps/place/Departemen+Teknik+Biomedik+FTE+ITS/data=!4m2!3m1!1s0x0:0x60ffe474f4c725e6?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "58%", y: "68%" },
  },
  {
    name: "Teknik Komputer",
    address: "Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117",
    mapsUrl:
      "http://google.com/maps/place/Departemen+Teknik+Komputer/data=!4m2!3m1!1s0x0:0xfa255422237d84eb?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "58%", y: "72%" },
  },
  {
    name: "Teknik Elektro",
    address:
      "Gedung B, C & AJ Kampus Institut Teknologi Sepuluh Nopember, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60111",
    mapsUrl:
      "https://www.google.com/maps/place/Departemen+Teknik+Elektro/data=!4m2!3m1!1s0x0:0xced029db5d680974?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "56%", y: "74%" },
  },
  {
    name: "Teknologi Informasi",
    address:
      "Gedung Tower 2 ITS, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117",
    mapsUrl:
      "https://www.google.com/maps/place/Gedung+Tower+2+ITS/data=!4m2!3m1!1s0x0:0xd021ec310d46b640?sa=X&ved=1t:2428&ictx=111",
    marker: { x: "52%", y: "74%" },
  },
];

export default function LocationSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = departments[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? departments.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === departments.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#F3F3F3] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.25fr_0.9fr]">
        <div className="relative h-[540px] w-full overflow-hidden border border-[#C7D2FE] bg-[#E6E6E6] md:h-[700px]">
          <img
            src="/images/Homepage_Location-Section_Image.png"
            alt="ITS map"
            className="h-full w-full object-cover opacity-35"
          />

          {departments.map((department, index) => (
            <button
              type="button"
              key={department.name}
              onClick={() => setActiveIndex(index)}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#1D4ED8] bg-white transition-all"
              style={{
                left: department.marker.x,
                top: department.marker.y,
                transform: `translate(-50%, -50%) rotate(45deg) scale(${index === activeIndex ? 1.15 : 1})`,
                backgroundColor: index === activeIndex ? "#DBEAFE" : "#FFFFFF",
              }}
              aria-label={`Select ${department.name}`}
            />
          ))}
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {departments.map((department) => (
              <article key={department.name} className="w-full shrink-0">
                <div className="h-[310px] w-full overflow-hidden bg-white">
                  <img
                    src="/images/Event-Rektorat-Image.png"
                    alt={department.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-8 text-5xl font-extrabold text-[#1D4ED8]">
                  {department.name}
                </h3>
                <p className="mt-4 max-w-[95%] text-2xl leading-relaxed text-black/90">
                  {department.address}
                </p>
                <a
                  href={department.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block text-sm font-medium uppercase tracking-wide text-black/70 hover:text-black"
                >
                  View on Google Maps ↗
                </a>
              </article>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="text-5xl leading-none text-black transition-colors hover:text-[#1D4ED8]"
              aria-label="Previous department"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="text-5xl leading-none text-black transition-colors hover:text-[#1D4ED8]"
              aria-label="Next department"
            >
              ›
            </button>
          </div>

          <p className="mt-3 text-xs uppercase tracking-wider text-black/50">
            {activeIndex + 1}/{departments.length}
          </p>
        </div>
      </div>
    </section>
  );
}
