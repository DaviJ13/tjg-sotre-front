import { createContext, useContext, useEffect, useState } from "react";
import { carrinhoService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("tjg-cart");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "tjg-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  async function buscarItemBackend(produtoId) {
    const response = await carrinhoService.obterMeuCarrinho();
    const itens = response.data.itens || [];

    return itens.find((item) => item.produtoId === produtoId);
  }

  function addToCart(produto) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === produto.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade:
                  item.quantidade + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...produto,
          quantidade: 1,
        },
      ];
    });

    if (isAuthenticated) {
      carrinhoService.adicionarMeuItem({
        id_produto: produto.id,
        quantidade: 1,
      }).catch((error) => {
        console.error("Erro ao sincronizar carrinho", error);
      });
    }
  }

  function removeFromCart(id) {
    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );

    if (isAuthenticated) {
      buscarItemBackend(id)
        .then((item) => {
          if (item) {
            return carrinhoService.removerMeuItem(item.id);
          }

          return null;
        })
        .catch((error) => {
          console.error("Erro ao remover item do carrinho", error);
        });
    }
  }

  function updateQuantity(
    id,
    quantidade
  ) {
    if (quantidade <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantidade }
          : item
      )
    );

    if (isAuthenticated) {
      buscarItemBackend(id)
        .then((item) => {
          if (item) {
            return carrinhoService.atualizarMeuItem(
              item.id,
              id,
              quantidade
            );
          }

          return null;
        })
        .catch((error) => {
          console.error("Erro ao atualizar item do carrinho", error);
        });
    }
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce(
    (acc, item) =>
      acc +
      item.preco * item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
