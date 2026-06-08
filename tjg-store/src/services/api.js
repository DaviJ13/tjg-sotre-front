import axios from "axios";

const API_BASE = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("tjg-token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export const produtosService = {
  listar: () =>
    api.get("/produtos"),

  buscarPorId: (id) =>
    api.get(`/produtos/${id}`),

  criar: (dados) =>
    api.post("/produtos", dados),

  atualizar: (id, dados) =>
    api.put(
      `/produtos/${id}`,
      dados
    ),

  remover: (id) =>
    api.delete(`/produtos/${id}`),
};

export const usuariosService = {
  cadastrar: (dados) =>
    api.post("/usuarios", dados),
};

export const carrinhoService = {
  obterCarrinho: (usuarioId) =>
    api.get(
      `/carrinho?usuarioId=${usuarioId}`
    ),

  adicionarItem: (
    usuarioId,
    item
  ) =>
    api.post(
      `/carrinho/itens?usuarioId=${usuarioId}`,
      item
    ),

  atualizarItem: (
    usuarioId,
    itemId,
    quantidade
  ) =>
    api.put(
      `/carrinho/itens/${itemId}?usuarioId=${usuarioId}`,
      { quantidade }
    ),

  removerItem: (
    usuarioId,
    itemId
  ) =>
    api.delete(
      `/carrinho/itens/${itemId}?usuarioId=${usuarioId}`
    ),
};

export const pedidosService = {
  criarPedido: (dados) =>
    api.post("/pedidos", dados),
};
export const authService = {
  login: (dados) =>
    api.post(
      "/usuarios/login",
      dados
    ),
};

export default api;