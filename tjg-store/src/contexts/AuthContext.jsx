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

  function login(userData) {
    setUser(userData);

    localStorage.setItem(
      "tjg-user",
      JSON.stringify(userData)
    );
  }

  function logout() {
    setUser(null);

    localStorage.removeItem(
      "tjg-user"
    );

    localStorage.removeItem(
      "tjg-token"
    );
  }

  const isAdmin =
    user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
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