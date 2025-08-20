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

  // Check if already connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      const allowed = await isAllowed();

      if (connected && allowed) {
        // Use getAddress to get the public key
        const addressObj = await getAddress();
        const net = await getNetwork();

        if (addressObj.error) {
          console.error("Error getting address:", addressObj.error);
          return;
        }

        setPublicKey(addressObj.address);
        setNetwork(net.network);
        setIsWalletConnected(true);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Check if Freighter is installed
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

      setPublicKey(access.address); // requestAccess returns the address directly
      setNetwork(net.network);
      setIsWalletConnected(true);

      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(`Failed to connect wallet: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPublicKey("");
    setNetwork("");
    setIsWalletConnected(false);
  };

  const signTx = async (txXdr, networkPassphrase) => {
    try {
      const signedTx = await signTransaction(txXdr, {
        network: networkPassphrase,
        address: publicKey,
      });

      if (signedTx.error) {
        throw new Error(signedTx.error);
      }

      return signedTx.signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
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
