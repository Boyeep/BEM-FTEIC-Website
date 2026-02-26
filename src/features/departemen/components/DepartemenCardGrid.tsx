import Image from "next/image";

const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  date: "1/2/2026 - 28/2/2026",
  title: "Morbi Rutrum",
  description:
    "Etiam non enim rutrum, consequat arcu quis, venenatis nibh. Quisque porttitor nunc quis neque molestie maximus. Aenean eget tempus mauris.",
}));

export default function DepartemenCardGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="grid grid-cols-[180px_1fr] gap-4">
          <div className="relative h-48 w-full overflow-hidden bg-white">
            <Image
              src="/images/Departemen-Rektorat-Image.png"
              alt="Departemen Rektorat"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-[#1D4ED8]">{item.date}</p>
            <h2 className="mt-2 text-4xl font-bold leading-tight text-black">
              {item.title}
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-black/90">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
