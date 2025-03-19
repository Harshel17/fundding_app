"use client";

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Define Types for API Responses
type FundSummary = {
  total_funds: number;
  funds_count: number;
  average_fund: number;
};

type ProfitSummary = {
  estimated_profit: number;
};

type AnalysisData = {
  total_funds: number;
  funds_count: number;
  average_fund: number;
  recent_fund: {
    source: string;
    amount: number;
    received_date: string;
  };
};

export default function Dashboard() {
  const [fundSummary, setFundSummary] = useState<FundSummary | null>(null);
  const [profit, setProfit] = useState<ProfitSummary | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_BASE = "https://funddingbackend2-production.up.railway.app";

  // Function to fetch funds data
  const fetchFunds = async () => {
    try {
      const response = await fetch(`${API_BASE}/funds/summary`);
      if (!response.ok) throw new Error("Failed to fetch funds data");

      const data: FundSummary = await response.json();
      setFundSummary(data);
    } catch (error) {
      console.error("Error fetching funds:", error);
    }
  };

  // Function to fetch profit data
  const fetchProfit = async () => {
    try {
      const response = await fetch(`${API_BASE}/funds/profit`);
      if (!response.ok) throw new Error("Failed to fetch profit data");

      const data: ProfitSummary = await response.json();
      setProfit(data);
    } catch (error) {
      console.error("Error fetching profit:", error);
    }
  };

  // Function to fetch financial analysis data
  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE}/funds/generate_analysis`);
      if (!response.ok) throw new Error("Failed to fetch analysis data");

      const data: AnalysisData = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    }
  };

  // Fetch funds, profit, and analysis on page load
  useEffect(() => {
    fetchFunds();
    fetchProfit();
    fetchAnalysis();
  }, []);

  // Automatically refresh analysis data every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchAnalysis, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Date Filter Section */}
        <div className="flex gap-4 items-center mb-6">
          <label className="font-medium">Filter by Date:</label>
          <input
            type="date"
            className="border p-2 rounded text-gray-900 bg-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded text-gray-900 bg-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={fetchAnalysis}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Total Funds</h2>
            <p className="text-2xl font-bold text-blue-600">${fundSummary?.total_funds || 0}</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Estimated Profit</h2>
            <p className="text-2xl font-bold text-green-600">${profit?.estimated_profit || 0}</p>
          </div>

          {/* Generate Analysis Button */}
          <div className="p-6 bg-white rounded-lg shadow flex items-center justify-center">
            <button
              onClick={fetchAnalysis}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Generate Analysis
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fund Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: "Total Funds", value: fundSummary?.total_funds || 0 }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#007BFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Display Analysis Results if Available */}
        {analysisData && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Analysis</h2>
            <div className="text-gray-900">
              <p>
                <strong className="text-gray-800">Total Funds:</strong> 
                <span className="text-blue-700 font-semibold"> ${analysisData?.total_funds || "N/A"}</span>
              </p>

              <p>
                <strong className="text-gray-800">Funds Count:</strong> 
                <span className="text-purple-700 font-semibold">{analysisData?.funds_count || "N/A"}</span>
              </p>

              <p>
                <strong className="text-gray-800">Average Fund:</strong> 
                <span className="text-green-600 font-semibold">${analysisData?.average_fund || "N/A"}</span>
              </p>

              <h3 className="font-semibold text-lg mt-4 text-gray-900">Recent Fund</h3>

              <p>
                <strong className="text-gray-800">Source:</strong> 
                <span className="text-indigo-600 font-semibold">{analysisData?.recent_fund?.source || "N/A"}</span>
              </p>

              <p>
                <strong className="text-gray-800">Amount:</strong> 
                <span className="text-red-600 font-semibold">${analysisData?.recent_fund?.amount || "N/A"}</span>
              </p>

              <p>
                <strong className="text-gray-800">Received Date:</strong> 
                <span className="text-orange-600 font-semibold">{analysisData?.recent_fund?.received_date || "N/A"}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
