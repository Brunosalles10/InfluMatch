import { PageContainer } from "@/app/components/layout/PageContainer";
import { AvisoPrecosFuturos } from "../components/AvisoPrecosFuturos";
import { PlanosPrecosSection } from "../components/PlanosPrecosSection";
import { PrecosHeroSection } from "../components/PrecosHeroSection";

export function PrecosPage() {
  return (
    <PageContainer className="space-y-16 pb-24">
      <PrecosHeroSection />
      <PlanosPrecosSection />
      <AvisoPrecosFuturos />
    </PageContainer>
  );
}
