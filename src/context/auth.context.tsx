import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  account: null as string | null,
  chainId: null as string | null,
  setAccount: (account: string | null) => {},
  setChainId: (chainId: string | null) => {},
  handleAuthUpdate: (account: string | null, chainId: string | null) => {},
});

export const UserProvider = AuthContext.Provider;

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const handleAuthUpdate = (account: string | null, chainId: string | null) => {
    setAccount(account);
    setChainId(chainId);
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        chainId,
        setAccount,
        setChainId,
        handleAuthUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
