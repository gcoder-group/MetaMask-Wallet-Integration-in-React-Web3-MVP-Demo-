import metamaskIcon from "@/assets/metamask-icon.png";
import { motion, AnimatePresence } from "framer-motion";
import { createEVMClient, getInfuraRpcUrls } from "@metamask/connect-evm";
import { environment } from "@/config";
import { useState } from "react";
import { handleError } from "@/utils/Metamask.util";
import { useAuth } from "@/context/auth.context";

const { APP_NAME, APP_URL, INFURA_API_KEY } = environment;

const client = await createEVMClient({
  dapp: {
    name: `My MetaMask Connect ${APP_NAME}`,
    url: APP_URL,
  },
  api: {
    supportedNetworks: {
      ...getInfuraRpcUrls({
        infuraApiKey: INFURA_API_KEY,
        chainIds: ["0x1", "0xaa36a7"],
      }),
      "0xe705": "https://linea-sepolia.infura.io/v3/" + INFURA_API_KEY,
      "0x14a34": "https://base-sepolia.infura.io/v3/" + INFURA_API_KEY,
    },
  },
  ui: {
    headless: false,
    preferExtension: true,
  },
});

export default function Metamask({
  loadingBtn,
  handleLoadingBtn,
  onClose,
}: {
  loadingBtn: string | null;
  handleLoadingBtn: (message: string | null) => void;
  onClose: () => void;
}) {
  const { handleAuthUpdate } = useAuth();
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const wallet = {
    name: "MetaMask",
    icon: metamaskIcon,
    description: "Connect with MetaMask wallet",
  };

  const handleWalletConnect = async (walletName: string) => {
    handleLoadingBtn("connect");
    try {
      const { accounts, chainId } = await client.connect({
        chainIds: ["0xaa36a7", "0xe705", "0x14a34"],
      });

      setAccount(accounts[0]);
      setChainId(chainId);
      handleAuthUpdate(accounts[0], chainId);
      onClose();

      // showConnected(accounts[0], chainId);
    } catch (error) {
      handleError(error);
    } finally {
      handleLoadingBtn(null);
    }
  };

  return (
    <motion.button
      key={wallet.name}
      onClick={() => handleWalletConnect(wallet.name)}
      className={`w-full bg-muted/50 hover:bg-muted border border-primary/10 hover:border-primary/30 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 ${
        loadingBtn ? "!opacity-50 pointer-events-none" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loadingBtn === "connect"}
    >
      <img
        src={wallet.icon}
        alt={wallet.name}
        className="w-12 h-12 object-contain"
      />
      <div className="text-left flex-1">
        <div className="font-semibold text-foreground">{wallet.name}</div>
        <div className="text-sm text-muted-foreground">
          {loadingBtn === "connect" ? "Pending..." : wallet.description}
        </div>
      </div>
    </motion.button>
  );
}
