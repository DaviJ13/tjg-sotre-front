import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "tjg-user"
        );

      return saved
        ? JSON.parse(saved)
        : null;
    });

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        "tjg-token"
      )
    );

  function login(authData) {
    const { token, tipoToken, ...userData } = authData;

    setUser(userData);
    setToken(token || null);

    localStorage.setItem(
      "tjg-user",
      JSON.stringify(userData)
    );

    if (token) {
      localStorage.setItem(
        "tjg-token",
        token
      );

      localStorage.setItem(
        "tjg-token-type",
        tipoToken || "Bearer"
      );
    }
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      "tjg-user"
    );

    localStorage.removeItem(
      "tjg-token"
    );

    localStorage.removeItem(
      "tjg-token-type"
    );
  }

  const isAdmin =
    user?.role === "ADMIN";

  const isAuthenticated =
    Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}   
