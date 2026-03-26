import ScrollReveal from "@/components/ScrollReveal";
import AboutSection from "@/features/homepage/components/AboutSection";
import BirokrasiSection from "@/features/homepage/components/BirokrasiSection";
import BlogSection from "@/features/homepage/components/BlogSection";
import EventSection from "@/features/homepage/components/EventSection";
import HeroSection from "@/features/homepage/components/HeroSection";
import HeroToAboutGradient from "@/features/homepage/components/HeroToAboutGradient";
import LocationSection from "@/features/homepage/components/LocationSection";
import VisiMisiSection from "@/features/homepage/components/VisiMisiSection";

export default function HomePageContent() {
  return (
    <main className="overflow-x-hidden bg-black">
      <HeroSection />
      <HeroToAboutGradient />
      <ScrollReveal delay={40}>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal delay={70}>
        <VisiMisiSection />
      </ScrollReveal>
      <ScrollReveal delay={90}>
        <BirokrasiSection />
      </ScrollReveal>
      <ScrollReveal delay={110}>
        <EventSection />
      </ScrollReveal>
      <ScrollReveal delay={130}>
        <BlogSection />
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <LocationSection />
      </ScrollReveal>
    </main>
  );
}
