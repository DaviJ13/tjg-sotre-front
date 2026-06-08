import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Produto from "../pages/Produto/Produto";
import Carrinho from "../pages/Carrinho/Carrinho";
import Checkout from "../pages/Checkout/Checkout";
import ProtectedRoute from "../components/ProtectedRoute";
import Admin from "../pages/Admin/Admin";
import AdminRoute from "../components/AdminRoute";


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/produto/:id" element={<Produto />} />

        <Route path="/carrinho" element={<Carrinho />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route
            path="/admin"
            element={
                <AdminRoute>
                <Admin />
                </AdminRoute>
            }
            />
      </Routes>
    </BrowserRouter>
  );
}