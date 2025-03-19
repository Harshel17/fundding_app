import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Funding Dashboard</h1>
      <nav className="space-y-4">
        <Link href="/dashboard" className="block p-2 rounded bg-gray-700 hover:bg-gray-600">
          Dashboard
        </Link>
        <Link href="/reports" className="block p-2 rounded bg-gray-700 hover:bg-gray-600">
          Reports
        </Link>
        <Link href="/analysis" className="block p-2 rounded bg-blue-600 hover:bg-blue-500">
          Analysis
        </Link>
        <Link href="/entry" className="block p-2 rounded bg-green-600 hover:bg-green-500">
          + Entry
        </Link>
      </nav>
    </div>
  );
}
