export default function VisiMisiSection() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
        <div>
          <h3 className="text-4xl font-extrabold text-black md:text-5xl">
            VISI
          </h3>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/90 md:text-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            elementum massa, eu nunc dignissim, vel rhoncus.
          </p>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold text-black md:text-5xl">
            MISI
          </h3>
          <ul className="mt-6 list-disc space-y-2 pl-7 text-lg leading-relaxed text-black/90 md:text-2xl">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>
              Ut elementum massa tempus nec eu nunc dignissim, vel rhoncus justo
              semper dolor sit amet.
            </li>
            <li>Duis ante mauris, malesuada vitae ultrices, id non leo.</li>
            <li>
              Ut vel tortor quis enim tortor quis enim facilisis tempus nec
              ornare dolor elementum.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
