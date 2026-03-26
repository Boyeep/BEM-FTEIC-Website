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
      <AboutSection />
      <VisiMisiSection />
      <BirokrasiSection />
      <EventSection />
      <BlogSection />
      <LocationSection />
    </main>
  );
}
