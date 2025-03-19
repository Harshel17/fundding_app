"use client";

import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<
    { principal_amount: number; interest_rate: number; generated_interest: number; created_at: string }[]
  >([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  // Fetch general analysis data
  const fetchAnalysis = async () => {
    try {
      const response = await fetch("https://funddingbackend2-production.up.railway.app/funds/get_analysis");
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    }
  };

  // Fetch filtered analysis by date
  const fetchFilteredAnalysis = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    try {
      const response = await fetch(
        `https://funddingbackend2.up.railway.app/funds/get_analysis_by_date?start_date=${startDate}&end_date=${endDate}`
      );
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Error fetching filtered analysis:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Analysis</h1>

      {/* Date Filter Section */}
      <div className="flex gap-4 items-center mb-6">
        <label className="font-medium">Filter by Date:</label>
        <input
          type="date"
          className="border p-2 rounded text-gray-900"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded text-gray-900"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={fetchFilteredAnalysis}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>

      {/* Analysis Data */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Analysis Reports</h2>
        {analysisData.length === 0 ? (
          <p className="text-gray-500">No analysis records found.</p>
        ) : (
          <ul className="space-y-4">
            {analysisData.map((item, index) => (
              <li key={index} className="p-4 border rounded-md shadow">
                <p className="text-lg font-bold">Investment Report {index + 1}</p>
                <p className="text-gray-600">
                  <strong>Principal:</strong> ${item.principal_amount}
                </p>
                <p className="text-gray-600">
                  <strong>Interest Rate:</strong> {item.interest_rate}%
                </p>
                <p className="text-gray-600">
                  <strong>Generated Interest:</strong> ${item.generated_interest}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
