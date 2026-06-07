import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
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

  function addToCart(produto) {
    const existing = cart.find(
      (item) => item.id === produto.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade:
                  item.quantidade + 1,
              }
            : item
        )
      );

      return;
    }

    setCart([
      ...cart,
      {
        ...produto,
        quantidade: 1,
      },
    ]);
  }

  function removeFromCart(id) {
    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );
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