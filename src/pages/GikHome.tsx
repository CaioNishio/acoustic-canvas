import GikTopBar from "@/components/gik/GikTopBar";
import GikHeader from "@/components/gik/GikHeader";
import GikHero from "@/components/gik/GikHero";
import GikBestSellers from "@/components/gik/GikBestSellers";
import GikProductSpotlight from "@/components/gik/GikProductSpotlight";
import GikEnvironments from "@/components/gik/GikEnvironments";
import GikTrustedBy from "@/components/gik/GikTrustedBy";
import GikFabrics from "@/components/gik/GikFabrics";
import GikTestimonial from "@/components/gik/GikTestimonial";
import GikPlanYourSpace from "@/components/gik/GikPlanYourSpace";
import GikKnowledgeBase from "@/components/gik/GikKnowledgeBase";
import GikFeaturesBar from "@/components/gik/GikFeaturesBar";
import GikFooter from "@/components/gik/GikFooter";

const GikHome = () => (
  <div className="bg-[#FDFEFE] text-[#0B0E11] font-['Lexend']">
    <GikTopBar />
    <GikHeader />
    <main>
      <GikHero />
      <GikBestSellers />
      <GikProductSpotlight />
      <GikEnvironments />
      <GikTrustedBy />
      <GikFabrics />
      <GikTestimonial />
      <GikPlanYourSpace />
      <GikKnowledgeBase />
      <GikFeaturesBar />
    </main>
    <GikFooter />
  </div>
);

export default GikHome;
