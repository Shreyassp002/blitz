// App.js or your main component
import AuctionDisplay from "@/components/auction/AuctionDisplay";
import QRCodeDisplay from "@/components/auction/QRCodeDisplay";
import WinnerPreview from "@/components/auction/WinnerPreview";
import WalletConnect from "@/components/WalletConnect";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">⚡ Blitz Auction</h1>
          <WalletConnect />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AuctionDisplay />
          <QRCodeDisplay />
        </div>

        {/* Winner Preview - Full Width Below Main Grid */}
        <div className="w-full">
          <WinnerPreview />
        </div>
      </div>
    </div>
  );
}
