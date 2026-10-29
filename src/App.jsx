import { Route, Routes } from "react-router-dom";
import Layout from "./componentes/Layout";
import Home from "./pages/Home";
import Detailhe from "./pages/Detailhe";
import Formulario from "./pages/Formulario";
import NotEncontrado from "./pages/NotEncontrado";
import "./App.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<Detailhe />} />
        <Route path="/novo" element={<Formulario />} />
        <Route path="/editar/:id" element={<Formulario />} />
        <Route path="*" element={<NotEncontrado />} />
      </Routes>
    </Layout>
  );
}

export default App;