"use client";

import { useEffect, useState } from "react";

export default function Reports() {
  const [analysisReports, setAnalysisReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch("http://fundding-backend2.up.railway.app/funds/get_analysis");
      const data = await response.json();
      setAnalysisReports(data);
    }

    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          {analysisReports.length === 0 ? (
            <p className="text-gray-600 text-center">No analysis records found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {analysisReports.map((report, index) => (
                <li key={index} className="py-4">
                  <p className="text-lg font-semibold text-gray-900">{report.description}</p>
                  <p className="text-gray-700">Interest Generated: <span className="font-bold text-green-600">${report.generated_interest}</span></p>
                  <p className="text-sm text-gray-500">Date: {new Date(report.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
