"use client";
import { useState } from "react";

export default function EntryForm() {
  const [formData, setFormData] = useState({
    description: "",
    principal_amount: "",
    interest_rate: "",
    time_period: "",
    compounded: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Function to refresh the analysis data after new entry
  const fetchAnalysis = async () => {
    try {
      const response = await fetch("http://funddingbackend2-production.up.railway.app/funds/generate_analysis");
      const data = await response.json();
      console.log("Updated Analysis Data:", data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Convert number fields to integers/floats
    const formattedData = {
      ...formData,
      principal_amount: parseFloat(formData.principal_amount),
      interest_rate: parseFloat(formData.interest_rate),
      time_period: parseInt(formData.time_period),
    };

    const response = await fetch("http://funddingbackend2-production.up.railway.app/funds/add_entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (response.ok) {
      alert("✅ Investment added successfully!");
      
      // ✅ Reset the form after successful submission
      setFormData({
        description: "",
        principal_amount: "",
        interest_rate: "",
        time_period: "",
        compounded: false,
      });

      // ✅ Fetch updated analysis data to reflect changes
      fetchAnalysis();

    } else {
      alert("❌ Error adding investment.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Investment Entry</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Investment Description */}
            <div>
              <label className="block text-gray-800 font-semibold">Investment Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-900 bg-white"
                required
              />
            </div>

            {/* Principal Amount */}
            <div>
              <label className="block text-gray-800 font-semibold">Principal Amount</label>
              <input
                type="number"
                name="principal_amount"
                value={formData.principal_amount}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-900 bg-white"
                required
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-gray-800 font-semibold">Interest Rate (%)</label>
              <input
                type="number"
                name="interest_rate"
                step="0.01"
                value={formData.interest_rate}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-900 bg-white"
                required
              />
            </div>

            {/* Time Period (Years) */}
            <div>
              <label className="block text-gray-800 font-semibold">Time Period (Years)</label>
              <input
                type="number"
                name="time_period"
                value={formData.time_period}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-900 bg-white"
                required
              />
            </div>

            {/* Compounded Interest Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="compounded"
                checked={formData.compounded}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-800 font-semibold">Compounded Interest</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full transition"
            >
              Submit
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
