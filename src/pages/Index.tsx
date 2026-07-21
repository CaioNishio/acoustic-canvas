import Layout from "@/components/layout/Layout";

import Hero from "@/components/sonar/Hero";
import AcousticComparator from "@/components/sonar/AcousticComparator";
import TrustBar from "@/components/sonar/TrustBar";
import CategoryShowcase from "@/components/sonar/CategoryShowcase";
import EnvironmentGrid from "@/components/sonar/EnvironmentGrid";
import ProblemNavigator from "@/components/sonar/ProblemNavigator";
import AcousticTools from "@/components/sonar/AcousticTools";
import FeaturedProducts from "@/components/sonar/FeaturedProducts";
import ProjectGallery from "@/components/sonar/ProjectGallery";
import ProcessLine from "@/components/sonar/ProcessLine";
import TechnicalContent from "@/components/sonar/TechnicalContent";
import ProofAndCTA from "@/components/sonar/ProofAndCTA";

/**
 * Homepage Sonar.
 *
 * A composição não replica um concorrente isolado: combina a organização
 * modular por categoria e ferramenta, a clareza comercial direta e a
 * autoridade técnica com prova institucional. O diferencial está em
 * transformar o comportamento do som em experiência visual — o comparador
 * antes/depois e a navegação por problema acústico vêm antes do catálogo.
 */
const HomePage = () => (
  <Layout>
    <div className="snr-home bg-snr-white">
      <Hero />
      <TrustBar />
      <AcousticComparator />
      <CategoryShowcase />
      <EnvironmentGrid />
      <ProblemNavigator />
      <AcousticTools />
      <FeaturedProducts />
      <ProjectGallery />
      <ProcessLine />
      <TechnicalContent />
      <ProofAndCTA />
    </div>
  </Layout>
);

export default HomePage;
