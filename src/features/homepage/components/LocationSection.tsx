export default function LocationSection() {
  return (
    <section className="flex min-h-[100svh] items-center bg-[#F3F3F3] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="relative h-[420px] w-full overflow-hidden bg-[#E6E6E6] md:h-[560px]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,78,216,0.08)_1px,transparent_1px),linear-gradient(rgba(29,78,216,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute left-[58%] top-[38%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#1D4ED8] bg-white" />
          <div className="absolute left-[64%] top-[50%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#1D4ED8] bg-white" />
          <div className="absolute left-[56%] top-[66%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#1D4ED8] bg-white" />
          <div className="absolute left-[70%] top-[74%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#1D4ED8] bg-white" />
        </div>

        <div>
          <h3 className="text-4xl font-extrabold text-black md:text-5xl">
            Lorem Ipsum
          </h3>
          <p className="mt-6 max-w-md text-xl leading-relaxed text-black/90 md:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            elementum massa eu nunc dignissim, vel rhoncus justo semper. Duis
            ante mauris, malesuada vitae ultrices id, lobortis non leo.
            infografis
          </p>
        </div>
      </div>
    </section>
  );
}
