import { useState, useEffect } from "react";
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";

export const useWallet = () => {
  const [publicKey, setPublicKey] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      const allowed = await isAllowed();

      if (connected && allowed) {
        const addressObj = await getAddress();
        const net = await getNetwork();

        if (addressObj.error) {
          return;
        }

        if (net.network !== "TESTNET") {
          alert("Please switch Freighter to Testnet to use this app");
          return;
        }

        setPublicKey(addressObj.address);
        setNetwork(net.network);
        setIsWalletConnected(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const connected = await isConnected();
      if (!connected) {
        alert("Please install Freighter wallet extension");
        return false;
      }

      // Request access
      const access = await requestAccess();
      if (access.error) {
        throw new Error(access.error);
      }

      // Get user info
      const addressObj = await getAddress();
      const net = await getNetwork();

      if (addressObj.error) {
        throw new Error(addressObj.error);
      }

      if (net.network !== "TESTNET") {
        alert(
          `Wrong Network!\nFreighter is on: ${net.network}\nPlease switch to TESTNET`
        );
        return false;
      }

      setPublicKey(addressObj.address);
      setNetwork(net.network);
      setIsWalletConnected(true);

      return true;
    } catch (error) {
      alert(`Failed to connect wallet: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setPublicKey("");
      setNetwork("");
      setIsWalletConnected(false);

      const shouldShowInstructions = window.confirm(
        "Disconnected from dApp!\n\nNote: To fully revoke access, please:\n1. Click the Freighter extension icon\n2. Go to Settings → Connected Sites\n3. Remove this site\n\nClick OK to see detailed instructions, or Cancel to continue."
      );

      if (shouldShowInstructions) {
        alert(
          "To completely disconnect:\n\n" +
            "1. Click the Freighter wallet extension icon\n" +
            "2. Go to 'Settings'\n" +
            "3. Select 'Connected Sites'\n" +
            "4. Find this site and click 'Disconnect'\n\n" +
            "This will revoke all permissions for this site."
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const signTx = async (txXdr, networkPassphrase) => {
    try {
      const currentNet = await getNetwork();

      if (currentNet.network !== "TESTNET") {
        throw new Error(
          `Please switch Freighter to TESTNET. Current: ${currentNet.network}`
        );
      }

      const signedTx = await signTransaction(txXdr, {
        networkPassphrase: networkPassphrase,
        accountToSign: publicKey,
      });

      if (signedTx.error) {
        throw new Error(signedTx.error);
      }

      return signedTx;
    } catch (e) {
      throw e;
    }
  };

  return {
    publicKey,
    isConnected: isWalletConnected,
    isLoading,
    network,
    connectWallet,
    disconnectWallet,
    signTransaction: signTx,
  };
};
