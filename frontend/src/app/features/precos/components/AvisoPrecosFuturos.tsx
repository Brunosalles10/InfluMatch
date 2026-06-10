import { Card } from "@/app/components/ui/Card";
import { Info } from "lucide-react";

export function AvisoPrecosFuturos() {
  return (
    <Card className="border-primary/30 bg-primary/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Info className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Página demonstrativa
          </h2>

          <p className="mt-2 leading-7 text-text-secondary">
            O InfluMatch ainda não possui módulo de pagamentos, assinaturas ou
            planos comerciais implementados no backend. Esta tela existe para
            demonstrar uma possibilidade de evolução do produto e manter
            coerência com o protótipo da aplicação.
          </p>
        </div>
      </div>
    </Card>
  );
}
