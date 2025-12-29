import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collectionGroup, getDocs, query, where } from "firebase/firestore";
import { Loader2, Printer, Filter, ShieldAlert } from "lucide-react";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyChVyvbgj61JDzB9Pk1O0zrE-HoP07uHWs",
  authDomain: "leadwise-platform.firebaseapp.com",
  projectId: "leadwise-platform",
  storageBucket: "leadwise-platform.firebasestorage.app",
  messagingSenderId: "423460758070",
  appId: "1:423460758070:web:6ff12a230fc1e65b44ee97",
  measurementId: "G-W5SVR52646"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- TYPES ---
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
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [incomeFilter, setIncomeFilter] = useState("All");

  // --- 1. LOGIN LOGIC (Simple Protection) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password for simplicity. 
    // In a real production app with sensitive data, you'd want proper Auth accounts.
    if (password === "LeadWise2024") { 
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect Access Code");
    }
  };

  // --- 2. DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // We use a Collection Group Query to find ALL "intake" documents 
      // regardless of which user they belong to.
      // This is powerful: it searches specifically for the sub-collection named "profile"
      const q = query(collectionGroup(db, "profile"));
      const querySnapshot = await getDocs(q);
      
      const fetchedStudents: StudentRecord[] = [];
      querySnapshot.forEach((doc) => {
        // We only want the "intake" documents
        if (doc.id === 'intake') {
            const data = doc.data();
            fetchedStudents.push({
            id: doc.ref.parent.parent?.id || "unknown", // Getting the Parent User ID
            firstName: data.firstName || "N/A",
            lastName: data.lastName || "N/A",
            email: data.email || "N/A",
            zipCode: data.zipCode || "N/A",
            householdIncome: data.householdIncome || "N/A",
            employmentStatus: data.employmentStatus || "N/A",
            enrolledAt: data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString() : "N/A",
            });
        }
      });
      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FILTER LOGIC ---
  const filteredStudents = incomeFilter === "All" 
    ? students 
    : students.filter(s => s.householdIncome === incomeFilter);

  // --- 4. PRINT LOGIC ---
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
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 font-bold">
              Unlock Dashboard
            </button>
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
