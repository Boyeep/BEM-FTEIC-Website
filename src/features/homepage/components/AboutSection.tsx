import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-black pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        <div className="relative h-[280px] w-full md:h-[360px]">
          <Image
            src="/images/Homepage-About-Image.png"
            alt="Homepage about"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-white">
          <h2 className="text-4xl font-extrabold md:text-5xl">ELECTICS</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            elementum massa eu nunc dignissim, vel rhoncus justo semper. Duis
            ante mauris, ipsum dolor sit amet malesuada vitae ultrices.
          </p>
        </div>
      </div>
    </section>
  );
}
