import { AboutSection } from "@/components/landing/about-section";
import { EventsSection } from "@/components/landing/events-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PathsSection } from "@/components/landing/paths-section";
import { VisionMissionSection } from "@/components/landing/vision-mission-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VisionMissionSection />
      <PathsSection />
      <EventsSection />
    </>
  );
}
