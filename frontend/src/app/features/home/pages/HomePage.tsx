import { PageContainer } from "@/app/components/layout/PageContainer";
import { ConteudosViraisSection } from "../components/ConteudosViraisSection";
import { CriadoresEmAltaSection } from "../components/CriadoresEmAltaSection";
import { HeroSection } from "../components/HeroSection";
import { PorQueEscolherSection } from "../components/PorQueEscolherSection";
import { StatsSection } from "../components/StatsSection";

export function HomePage() {
  return (
    <PageContainer className="space-y-24 pb-24">
      <HeroSection />
      <StatsSection />
      <CriadoresEmAltaSection />
      <ConteudosViraisSection />
      <PorQueEscolherSection />
    </PageContainer>
  );
}
