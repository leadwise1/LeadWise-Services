import { useState } from "react";
import { Loader2, Printer, Filter, ShieldAlert } from "lucide-react";

// --- TYPES ---
// This interface remains as it defines the shape of the data we expect.
interface StudentRecord {
  id: string; // The doc ID or User ID
  firstName: string;
  lastName: string;
  email: string;
  zipCode: string;
  householdIncome: string;
  employmentStatus: string;
  enrolledAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [incomeFilter, setIncomeFilter] = useState("All");

  // --- 1. LOGIN & DATA FETCHING ---
  // This function now securely authenticates and fetches data from our backend API.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data: StudentRecord[] = await response.json();
      setStudents(data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FILTER LOGIC ---
  const filteredStudents = incomeFilter === "All" 
    ? students 
    : students.filter(s => s.householdIncome === incomeFilter);

  // --- 3. PRINT LOGIC ---
  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter code..."
                disabled={loading}
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 font-bold flex items-center justify-center" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock Dashboard'}
            </button>
            {error && <p className="text-xs text-center text-red-500 mt-2">{error}</p>}
            <p className="text-xs text-center text-gray-400 mt-4">Authorized Personnel Only</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER (Hidden on Print if you prefer, currently shown for context) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LMI Compliance Report</h1>
            <p className="text-gray-500">LeadWise Foundation • Confidential Beneficiary Data</p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Printer className="w-4 h-4" /> Print Report
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 print:hidden flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Filter by Income:</span>
            <select 
                className="p-2 border rounded bg-gray-50"
                value={incomeFilter}
                onChange={(e) => setIncomeFilter(e.target.value)}
            >
                <option value="All">Show All Ranges</option>
                <option value="0-25k">$0 - $25,000 (Very Low Income)</option>
                <option value="25-50k">$25,001 - $50,000 (Low Income)</option>
                <option value="50-75k">$50,001 - $75,000 (Moderate Income)</option>
                <option value="75k+">$75,001+ (Above Moderate)</option>
            </select>
            <div className="ml-auto text-sm text-gray-500">
                Showing {filteredStudents.length} records
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            {loading ? (
                <div className="p-12 flex justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 print:bg-gray-200">
                            <tr>
                                <th className="p-4 border-b font-semibold text-gray-700">Enrollment Date</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Name</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Email</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Zip Code</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Income Range</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 border-b last:border-b-0 print:border-gray-300">
                                        <td className="p-4 text-sm text-gray-600">{student.enrolledAt}</td>
                                        <td className="p-4 font-medium text-gray-900">{student.firstName} {student.lastName}</td>
                                        <td className="p-4 text-sm text-gray-600">{student.email}</td>
                                        <td className="p-4 text-sm font-mono text-gray-600">{student.zipCode}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${student.householdIncome === '0-25k' ? 'bg-green-100 text-green-800' : 
                                                  student.householdIncome === '25-50k' ? 'bg-blue-100 text-blue-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {student.householdIncome}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 capitalize">{student.employmentStatus}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No students found matching this criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* PRINT FOOTER */}
        <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
            Generated by LeadWise Foundation Admin Portal • {new Date().toLocaleDateString()}
        </div>

      </div>
    </div>
  );
}
