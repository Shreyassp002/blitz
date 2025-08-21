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

  // ✅ FIXED: Correct Freighter signTransaction API usage
  const signTx = async (txXdr, networkPassphrase) => {
    try {
      const currentNet = await getNetwork();
      console.log("Freighter current net:", currentNet);

      if (currentNet.network !== "TESTNET") {
        throw new Error(
          `Please switch Freighter to TESTNET. Current: ${currentNet.network}`
        );
      }

      console.log("🔐 Signing transaction with XDR:", txXdr);
      console.log("🌐 Network passphrase:", networkPassphrase);

      // ✅ CRITICAL FIX: Correct Freighter API call
      // Freighter's signTransaction only takes XDR and options, not separate network params
      const signedTx = await signTransaction(txXdr, {
        networkPassphrase: networkPassphrase,
        accountToSign: publicKey, // Optional but recommended
      });

      console.log("✅ Transaction signed successfully:", signedTx);

      if (signedTx.error) {
        throw new Error(signedTx.error);
      }

      // ✅ CRITICAL FIX: Return the correct property
      // Freighter returns the signed XDR directly as a string, not in signedTxXdr property
      return signedTx;
    } catch (e) {
      console.error("❌ Error signing transaction:", e);
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
