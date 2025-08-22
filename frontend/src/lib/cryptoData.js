export async function getCryptoData() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar,usd-coin,aquarius&vs_currencies=usd&include_24hr_change=true",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch crypto data");
    }

    const data = await response.json();

    const cryptoData = Object.entries(data).map(([id, info]) => ({
      id,
      name: getCryptoName(id),
      symbol: getCryptoSymbol(id),
      price: info.usd,
      change24h: info.usd_24h_change,
      isStellarRelated: true,
    }));

    cryptoData.sort((a, b) => {
      if (a.id === "stellar") return -1;
      if (b.id === "stellar") return 1;
      return 0;
    });

    return cryptoData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
}

function getCryptoName(id) {
  const names = {
    stellar: "Stellar",
    "usd-coin": "USD Coin",
    aquarius: "Aquarius",
  };
  return names[id] || id;
}

function getCryptoSymbol(id) {
  const symbols = {
    stellar: "XLM",
    "usd-coin": "USDC",
    aquarius: "AQUA",
  };
  return symbols[id] || id.toUpperCase();
}
