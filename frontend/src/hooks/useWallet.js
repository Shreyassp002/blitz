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

        // ✅ Check if on correct network (Testnet)
        console.log("🌐 Current Freighter Network:", net);
        if (net.network !== "TESTNET") {
          console.warn("⚠️ Freighter is not on Testnet! Current:", net.network);
          alert("Please switch Freighter to Testnet to use this app");
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

      // ✅ Check network before connecting
      console.log("🌐 Freighter Network Check:", net);
      if (net.network !== "TESTNET") {
        alert(
          `❌ Wrong Network!\nFreighter is on: ${net.network}\nPlease switch to TESTNET`
        );
        return false;
      }

      // ✅ Fixed: Use addressObj.address, not access.address
      setPublicKey(addressObj.address);
      setNetwork(net.network);
      setIsWalletConnected(true);

      console.log("✅ Wallet connected successfully on Testnet");
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
      // ✅ Double-check network before signing
      const currentNet = await getNetwork();
      console.log("🔐 Signing transaction on network:", currentNet);

      if (currentNet.network !== "TESTNET") {
        throw new Error(
          `Wrong network! Expected TESTNET, got ${currentNet.network}`
        );
      }

      if (networkPassphrase !== "Test SDF Network ; September 2015") {
        throw new Error(
          `Wrong passphrase! Expected Testnet passphrase, got: ${networkPassphrase}`
        );
      }

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
