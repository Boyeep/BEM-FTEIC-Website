import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh]">
      <Image
        src="/images/Homepage-Hero-Image.png"
        alt="Homepage hero"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-black via-black/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black via-black/85 to-transparent" />
      <div className="relative flex min-h-[100svh] items-center justify-center px-6 text-center">
        <p className="max-w-5xl text-3xl font-bold leading-tight text-white md:text-5xl">
          Bringing Humanized Intelligent Technology for Society
        </p>
      </div>
    </section>
  );
}
