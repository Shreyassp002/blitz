import AuctionDisplay from "@/components/auction/AuctionDisplay";
import QRCodeDisplay from "@/components/auction/QRCodeDisplay";
import WinnerPreview from "@/components/auction/WinnerPreview";
import Header from "@/components/Home/Header";
import Background from "@/components/Home/Background";
import PageTransition from "@/components/Home/transitions/PageTransition";
import CryptoTicker from "@/components/CryptoTicker";
import { getCryptoData } from "@/lib/cryptoData";

export default async function Auction() {
  const initialCryptoData = await getCryptoData();

  return (
    <Background>
      {/* Header */}
      <PageTransition delay={150}>
        <Header currentPage="auction" />
      </PageTransition>

      {/* Crypto Price Ticker */}
      <div className="pt-20">
        <CryptoTicker initialData={initialCryptoData} />
      </div>

      {/* Main content */}
      <PageTransition delay={150}>
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-gray-400 text-center mt-2">
                Live bidding for QR code display rights
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <AuctionDisplay />
              <QRCodeDisplay />
            </div>

            {/* Winner Preview  */}
            <div className="w-full">
              <WinnerPreview />
            </div>
          </div>
        </div>
      </PageTransition>
    </Background>
  );
}
