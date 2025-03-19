"use client";

import { useEffect, useState } from "react";

// ✅ Define the Type for Analysis Reports
interface Report {
  description: string;
  principal_amount: number;
  interest_rate: number;
  generated_interest: number;
  created_at: string;
}

export default function Reports() {
  const [analysisReports, setAnalysisReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch Reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://funddingbackend2-production.up.railway.app/funds/get_analysis");
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data: Report[] = await response.json();
      setAnalysisReports(data);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setError("Failed to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Reports</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          {/* ✅ Display Loading State */}
          {loading && <p className="text-gray-600 text-center">Loading reports...</p>}

          {/* ✅ Display Error Message */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* ✅ Display Reports */}
          {!loading && !error && analysisReports.length === 0 ? (
            <p className="text-gray-600 text-center">No analysis records found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {analysisReports.map((report, index) => (
                <li key={index} className="py-4">
                  <p className="text-lg font-semibold text-gray-900">{report.description}</p>
                  <p className="text-gray-700">
                    <strong>Principal:</strong> ${report.principal_amount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Interest Rate:</strong> {report.interest_rate}%
                  </p>
                  <p className="text-gray-700">
                    <strong>Generated Interest:</strong> <span className="font-bold text-green-600">${report.generated_interest}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong> {new Date(report.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
