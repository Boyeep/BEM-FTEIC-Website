import { KabinetDivision } from "@/features/kabinet/data";

interface KabinetDivisionPageContentProps {
  division: KabinetDivision;
}

export default function KabinetDivisionPageContent({
  division,
}: KabinetDivisionPageContentProps) {
  return (
    <main className="bg-[#F3F3F3] pt-12 md:pt-14">
      <section className="w-full">
        <div className="bg-[#E8B95A] px-4 py-6 md:px-8 md:py-7">
          <h1 className="text-4xl font-extrabold text-black md:text-6xl">
            {division.title}
          </h1>
          <p className="mt-4 max-w-6xl text-lg leading-relaxed text-black md:text-2xl">
            {division.description}
          </p>
        </div>

        <div className="bg-[#3F69D9] px-4 py-12 md:px-8 md:py-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
            {division.members.map((member, idx) => (
              <article
                key={`kabinet-member-${idx}`}
                className="flex items-center gap-2 sm:gap-3 md:gap-4"
              >
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden bg-gradient-to-b from-white/15 to-white/45 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-40 lg:w-40">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/45 sm:h-10 sm:w-10 md:h-14 md:w-14 lg:h-20 lg:w-20" />
                  )}
                </div>
                <div>
                  <p className="text-base leading-tight font-semibold text-white sm:text-lg md:text-xl lg:text-2xl">
                    {member.name}
                  </p>
                  <p className="text-xs font-medium text-[#FCD704] sm:text-sm md:text-base lg:text-xl">
                    {member.position}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
