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
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    
    // Set up periodic checking for wallet connection changes
    const intervalId = setInterval(() => {
      // Don't check if we're currently in the process of connecting
      if (!isConnecting) {
        checkConnection();
      }
    }, 1000); // Check more frequently (every 1 second instead of 2)
    
    // Listen for storage events (when wallet state changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'freighter:connected' || e.key === 'freighter:allowed') {
        if (!isConnecting) {
          checkConnection();
        }
      }
    };
    
    // Listen for focus events (when user returns to the tab)
    const handleFocus = () => {
      if (!isConnecting) {
        checkConnection();
      }
    };
    
    // Listen for visibility change events
    const handleVisibilityChange = () => {
      if (!document.hidden && !isConnecting) {
        checkConnection();
      }
    };

    // Listen for window blur/focus events (when user switches between apps)
    const handleWindowBlur = () => {
      // Check connection when window loses focus (user might have disconnected wallet)
      setTimeout(() => {
        if (!isConnecting) {
          checkConnection();
        }
      }, 500);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnecting]);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      const allowed = await isAllowed();

      if (connected && allowed) {
        const addressObj = await getAddress();
        const net = await getNetwork();

        if (addressObj.error) {
          // If there's an error getting address, reset connection state
          setPublicKey("");
          setNetwork("");
          setIsWalletConnected(false);
          return;
        }

        if (net.network !== "TESTNET") {
          // Don't alert here, just reset state
          setPublicKey("");
          setNetwork("");
          setIsWalletConnected(false);
          return;
        }

        // Only update if values have actually changed
        if (publicKey !== addressObj.address || network !== net.network || !isWalletConnected) {
          setPublicKey(addressObj.address);
          setNetwork(net.network);
          setIsWalletConnected(true);
        }
      } else {
        // Wallet is not connected or not allowed - reset state
        setPublicKey("");
        setNetwork("");
        setIsWalletConnected(false);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      // Reset state on error
      setPublicKey("");
      setNetwork("");
      setIsWalletConnected(false);
    }
  };

  const connectWallet = async () => {
    if (isConnecting) {
      return false; // Already connecting
    }
    
    setIsConnecting(true);
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
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Reset all state immediately
      setPublicKey("");
      setNetwork("");
      setIsWalletConnected(false);
      setIsConnecting(false);
      setIsLoading(false);

      // Force a connection check to ensure state is properly updated
      setTimeout(() => {
        checkConnection();
      }, 100);

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
      console.error("Error disconnecting wallet:", error);
      // Even if there's an error, reset the state
      setPublicKey("");
      setNetwork("");
      setIsWalletConnected(false);
      setIsConnecting(false);
      setIsLoading(false);
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
