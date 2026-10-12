import { Benefits } from "@/features/marketing/benefits";
import { CategoriesSection } from "@/features/marketing/categories-section";
import { Faq } from "@/features/marketing/faq";
import { FeaturedServices } from "@/features/marketing/featured-services";
import { FinalCta } from "@/features/marketing/final-cta";
import { Hero } from "@/features/marketing/hero";
import { HowItWorks } from "@/features/marketing/how-it-works";
import { PlatformPreview } from "@/features/marketing/platform-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <CategoriesSection />
      <HowItWorks />
      <Benefits />
      <PlatformPreview />
      <Faq />
      <FinalCta />
    </>
  );
}
