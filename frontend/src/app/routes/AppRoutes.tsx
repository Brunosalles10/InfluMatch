import { ColetaYoutubePage } from "@/app/features/admin/coleta-youtube/pages/ColetaYoutubePage";
import { VideosViraisPage } from "@/app/features/conteudos/pages/VideosViraisPage";
import { CriadoresPage } from "@/app/features/criadores/pages/CriadoresPage";
import { HomePage } from "@/app/features/home/pages/HomePage";
import { PrecosPage } from "@/app/features/precos/pages/PrecosPage";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { CadastroPage } from "@/app/pages/CadastroPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { PerfilPage } from "@/app/pages/PerfilPage";
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

        <Route path="/precos" element={<PrecosPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/cadastro" element={<CadastroPage />} />

      <Route element={<RotaPrivada />}>
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route element={<RotaAdmin />}>
        <Route path="/admin/coleta-youtube" element={<ColetaYoutubePage />} />
      </Route>
    </Routes>
  );
}
