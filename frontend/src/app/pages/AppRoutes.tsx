import { CadastroPage } from "@/app/pages/CadastroPage";
import { HomePage } from "@/app/pages/HomePage";
import { LoginPage } from "@/app/pages/LoginPage";
import { PerfilPage } from "@/app/pages/PerfilPage";
import { Route, Routes } from "react-router";
import { RotaAdmin } from "../routes/RotaAdmin";
import { RotaPrivada } from "../routes/RotaPrivada";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      <Route element={<RotaPrivada />}>
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route element={<RotaAdmin />}>
        <Route path="/admin" element={<div>Área administrativa</div>} />
      </Route>
    </Routes>
  );
}
