import { EmptyState } from "@/app/components/feedback/EmptyState";
import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Avatar } from "@/app/components/ui/Avatar/Index";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { StatCard } from "@/app/components/ui/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table/Index";
import { Search, Trophy } from "lucide-react";

export default function App() {
  return (
    <PageContainer>
      <section className="mb-14 text-center">
        <Badge variante="success">+2.5M criadores analisados</Badge>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">
          Encontre Criadores de{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Alto Engajamento
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          Descubra os melhores influenciadores para sua marca com análises de
          engajamento, audiência e performance.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3 rounded-2xl border border-border bg-surface/80 p-3 shadow-card sm:grid-cols-[1fr_220px_auto]">
          <Input
            placeholder="Buscar por nome, nicho ou @username..."
            iconeEsquerda={<Search className="h-5 w-5" />}
          />

          <Select
            placeholder="Todos os nichos"
            opcoes={[
              { label: "Games", value: "games" },
              { label: "Fitness", value: "fitness" },
              { label: "Tech", value: "tech" },
            ]}
          />

          <Button>Buscar</Button>
        </div>
      </section>

      <section className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard titulo="Criadores" valor="2.5M+" />
        <StatCard titulo="Nichos" valor="150+" />
        <StatCard titulo="Precisão" valor="98%" />
        <StatCard titulo="Atualização" valor="24h" />
      </section>

      <section className="mb-14">
        <SectionHeader
          icone="🏆"
          titulo="Ranking de Criadores"
          descricao="Os melhores influenciadores por engajamento e crescimento"
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Criador</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Seguidores</TableHead>
              <TableHead>Engajamento</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar nome="Rafael Ferreira" />
                  <div>
                    <p className="font-semibold">Rafael Ferreira</p>
                    <p className="text-sm text-text-muted">@rafaferreira</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variante="secondary">Games</Badge>
              </TableCell>
              <TableCell>3.2M</TableCell>
              <TableCell className="font-semibold text-success">
                15.2%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="mb-14 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Análises em Tempo Real</CardTitle>
            <CardDescription>
              Dados atualizados com métricas detalhadas de engajamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Trophy className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <EmptyState />

        <ErrorState />
      </section>
    </PageContainer>
  );
}
