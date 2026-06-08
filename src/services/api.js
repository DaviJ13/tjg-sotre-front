import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8081";

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
    const tokenType =
      localStorage.getItem("tjg-token-type") ||
      "Bearer";

    if (token) {
      config.headers.Authorization =
        `${tokenType} ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("tjg-user");
      localStorage.removeItem("tjg-token");
      localStorage.removeItem("tjg-token-type");
      window.location.assign("/login");
    }

    return Promise.reject(error);
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

  me: () =>
    api.get("/usuarios/me"),
};

export const carrinhoService = {
  obterCarrinho: (usuarioId) =>
    api.get(
      `/carrinho?usuarioId=${usuarioId}`
    ),

  obterMeuCarrinho: () =>
    api.get("/carrinho/meu"),

  adicionarItem: (
    usuarioId,
    item
  ) =>
    api.post(
      `/carrinho/itens?usuarioId=${usuarioId}`,
      item
    ),

  adicionarMeuItem: (item) =>
    api.post(
      "/carrinho/meu/itens",
      item
    ),

  atualizarItem: (
    usuarioId,
    itemId,
    produtoId,
    quantidade
  ) =>
    api.put(
      `/carrinho/itens/${itemId}?usuarioId=${usuarioId}`,
      {
        id_produto: produtoId,
        quantidade,
      }
    ),

  atualizarMeuItem: (
    itemId,
    produtoId,
    quantidade
  ) =>
    api.put(
      `/carrinho/meu/itens/${itemId}`,
      {
        id_produto: produtoId,
        quantidade,
      }
    ),

  removerItem: (
    usuarioId,
    itemId
  ) =>
    api.delete(
      `/carrinho/itens/${itemId}?usuarioId=${usuarioId}`
    ),

  removerMeuItem: (itemId) =>
    api.delete(
      `/carrinho/meu/itens/${itemId}`
    ),
};

export const pedidosService = {
  finalizar: (usuarioId) =>
    api.post(
      `/pedidos?usuarioId=${usuarioId}`
    ),

  finalizarMeu: () =>
    api.post("/pedidos/meus"),

  listar: (usuarioId) =>
    api.get(
      `/pedidos?usuarioId=${usuarioId}`
    ),

  listarMeus: () =>
    api.get("/pedidos/meus"),

  buscarPorId: (usuarioId, pedidoId) =>
    api.get(
      `/pedidos/${pedidoId}?usuarioId=${usuarioId}`
    ),

  buscarMeuPorId: (pedidoId) =>
    api.get(`/pedidos/meus/${pedidoId}`),
};
export const authService = {
  login: (dados) =>
    api.post(
      "/usuarios/login",
      dados
    ),
};

export default api;
