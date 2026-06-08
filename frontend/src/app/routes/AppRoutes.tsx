import { CriadoresPage } from "@/app/features/criadores/pages/CriadoresPage";
import { HomePage } from "@/app/features/home/pages/HomePage";
import { PaginaTemporaria } from "@/app/features/home/pages/PaginaTemporaria";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { CadastroPage } from "@/app/pages/CadastroPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { PerfilPage } from "@/app/pages/PerfilPage";
import { VideosViraisPage } from "@/app/pages/VideosViraisPage";
import { Route, Routes } from "react-router";
import { RotaAdmin } from "./RotaAdmin";
import { RotaPrivada } from "./RotaPrivada";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/criadores" element={<CriadoresPage />} />

        <Route path="/videos-virais" element={<VideosViraisPage />} />

        <Route
          path="/precos"
          element={
            <PaginaTemporaria
              titulo="Planos e Preços"
              descricao="Página de preços planejada para a próxima fase visual do projeto."
            />
          }
        />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/cadastro" element={<CadastroPage />} />

      <Route element={<RotaPrivada />}>
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route element={<RotaAdmin />}>
        <Route
          path="/admin"
          element={
            <PaginaTemporaria
              titulo="Área Administrativa"
              descricao="Painel administrativo para coleta e gestão de dados."
            />
          }
        />
      </Route>
    </Routes>
  );
}
