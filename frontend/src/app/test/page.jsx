"use client";
import { useState } from "react";
import { AuctionContractClient } from "../../lib/contractClient";

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testContract = async () => {
    setLoading(true);
    try {
      const client = new AuctionContractClient();
      const summary = await client.getAuctionSummary();
      setResult(JSON.stringify(summary, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contract Test</h1>
      <button
        onClick={testContract}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Test Contract"}
      </button>
      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto">
          {result}
        </pre>
      )}
    </div>
  );
}
