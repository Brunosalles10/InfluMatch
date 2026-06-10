import { PLANOS_PRECOS } from "../data/precos.constantes";
import { PlanoPrecoCard } from "./PlanoPrecoCard";

export function PlanosPrecosSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {PLANOS_PRECOS.map((plano) => (
        <PlanoPrecoCard key={plano.id} plano={plano} />
      ))}
    </section>
  );
}
