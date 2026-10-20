import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./services/api.js";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import FormPage from "./pages/FormPage.jsx";
import NotEncontrado from "./pages/NotEncontrado.jsx";

function App() {
  const [dono, setDono] = useState("Carregando...");

  useEffect(() => {
    async function loadDono() {
      try {
        const response = await api.get("/eu");
        const data = response.data || {};
        setDono(data.nome || data.name || "Perfil conectado");
      } catch (error) {
        setDono("Perfil não carregado");
      }
    }

    loadDono();
  }, []);

  return (
    <Routes>
      <Route element={<Layout dono={dono} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/novo" element={<FormPage mode="create" />} />
        <Route path="/editar/:id" element={<FormPage mode="edit" />} />
        <Route path="/item/:id" element={<DetailPage />} />
        <Route path="*" element={<NotEncontrado />} />
      </Route>
    </Routes>
  );
}

export default  App;