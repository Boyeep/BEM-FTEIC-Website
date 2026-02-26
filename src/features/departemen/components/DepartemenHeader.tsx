import Image from "next/image";

export default function DepartemenHeader() {
  return (
    <header>
      <h1 className="text-5xl font-extrabold text-black">DEPARTEMEN</h1>
      <div className="mt-6 flex items-center gap-4">
        <Image
          src="/images/Departemen-Logo-ITS-Image.png"
          alt="Logo ITS"
          width={46}
          height={46}
        />
        <p className="text-3xl text-black">Etiam Augue</p>
      </div>
    </header>
  );
}
