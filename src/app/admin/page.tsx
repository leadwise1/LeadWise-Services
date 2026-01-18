"use client";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collectionGroup, getDocs, query } from "firebase/firestore";
import { Loader2, Printer, Filter, ShieldAlert, Lock } from "lucide-react";

// --- CONFIGURATION ---
// In Next.js, use environment variables starting with NEXT_PUBLIC_
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let db: any;
try {
  // Only initialize if config is present
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Admin Page: Firebase init failed", e);
}

// --- TYPES ---
interface StudentRecord {
  id: string; 
  zipCode: string;
  householdIncome: string;
  employmentStatus: string;
  status: string;
  enrolledAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [incomeFilter, setIncomeFilter] = useState("All");

  // --- 1. LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "LeadWise2024") { 
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect Access Code");
    }
  };

  // --- 2. DATA FETCHING ---
  const fetchData = async () => {
    if (!db) return alert("Database not connected. Check API Keys in .env or Vercel Settings.");
    
    setLoading(true);
    try {
      // Query ALL "profile" subcollections to find intake forms
      const q = query(collectionGroup(db, "profile"));
      const querySnapshot = await getDocs(q);
      
      const fetchedStudents: StudentRecord[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.id === 'intake') {
            const data = doc.data();
            // We get the User ID from the parent document path
            // path: artifacts/leadwise-default/users/{USER_ID}/profile/intake
            const userId = doc.ref.parent.parent?.id || "unknown";
            
            fetchedStudents.push({
              id: `user_${userId.substring(0, 6)}...`, // Anonymize ID for display
              zipCode: data.zipCode || "N/A",
              householdIncome: data.householdIncome || "Unknown",
              employmentStatus: data.employmentStatus || "Unknown",
              status: "Active", // Default status for enrolled students
              enrolledAt: data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString() : "N/A",
            });
        }
      });
      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Ensure Firestore Rules allow read access.");
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

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-slate-900">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Compliance Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter code..."
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-opacity-90 font-bold transition-colors">
              Access Reports
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:mb-6 border-b print:border-none pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <ShieldAlert className="w-6 h-6 text-blue-600" />
               <h1 className="text-2xl font-bold text-gray-900">LMI & Workforce Compliance Report</h1>
            </div>
            <p className="text-sm text-gray-500">
              Generated: {new Date().toLocaleDateString()} • LeadWise Foundation
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>

        {/* FILTERS (Hidden on Print) */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 print:hidden flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              Filter Data:
            </div>
            <select 
                className="p-2 border rounded bg-gray-50 text-sm"
                value={incomeFilter}
                onChange={(e) => setIncomeFilter(e.target.value)}
            >
                <option value="All">All Income Ranges</option>
                <option value="0-25k">$0 - $25,000 (Very Low)</option>
                <option value="25-50k">$25,001 - $50,000 (Low)</option>
                <option value="50-75k">$50,001 - $75,000 (Moderate)</option>
                <option value="75k+">$75,001+ (Above Moderate)</option>
            </select>
            <div className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total Records: <strong>{filteredStudents.length}</strong>
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:border-2 print:border-gray-900">
            {loading ? (
                <div className="p-12 flex justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 print:bg-gray-200 text-gray-900 border-b-2 border-gray-300">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider">Student ID (Anonymized)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider">Zip Code</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider">Income Bracket (LMI)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider">Employment</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 print:hover:bg-transparent">
                                        <td className="p-4 text-sm font-mono text-gray-600">{student.id}</td>
                                        <td className="p-4 text-sm font-bold text-gray-900">{student.zipCode}</td>
                                        <td className="p-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${student.householdIncome === '0-25k' ? 'bg-green-100 text-green-800 border-green-200' : 
                                                  student.householdIncome === '25-50k' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                                                  'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {student.householdIncome}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 capitalize">{student.employmentStatus}</td>
                                        <td className="p-4 text-sm">
                                            <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse print:hidden"></div>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                                        No student records found matching this criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* PRINT FOOTER */}
        <div className="hidden print:block mt-8 border-t pt-4">
            <div className="flex justify-between text-xs text-gray-500">
                <span>Confidential: For Grant & Audit Use Only</span>
                <span>Verified by LeadWise Foundation Data Systems</span>
            </div>
        </div>

      </div>
    </div>
  );
}
