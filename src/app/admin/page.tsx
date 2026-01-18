"use client";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, collectionGroup } from "firebase/firestore";
import { Loader2, Printer, Filter, ShieldAlert, Lock, AlertTriangle } from "lucide-react";

// --- CONFIGURATION ---
// ✅ Real Firebase Config (Hardcoded)
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
let db: any;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Admin Page: Firebase init failed", e);
}

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
  const [debugLog, setDebugLog] = useState<string[]>([]); // New On-Screen Log

  const addLog = (msg: string) => setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "LeadWise2024") { 
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect Access Code");
    }
  };

  const fetchData = async () => {
    if (!db) {
        addLog("Error: Database not initialized.");
        return;
    }
    
    setLoading(true);
    setDebugLog([]); // Clear logs
    addLog("Starting Data Fetch...");

    try {
      // 1. Try Collection Group Query (Best way)
      addLog("Attempting Collection Group Query for 'profile'...");
      const q = query(collectionGroup(db, "profile"));
      const querySnapshot = await getDocs(q);
      
      addLog(`Query Complete. Found ${querySnapshot.size} documents.`);

      const fetchedStudents: StudentRecord[] = [];
      querySnapshot.forEach((doc) => {
        addLog(`- Found Doc ID: ${doc.id} at path: ${doc.ref.path}`);
        
        if (doc.id === 'intake') {
            const data = doc.data();
            const userId = doc.ref.parent.parent?.id || "unknown";
            
            fetchedStudents.push({
              id: `user_${userId.substring(0, 6)}...`, 
              zipCode: data.zipCode || "N/A",
              householdIncome: data.householdIncome || "Unknown",
              employmentStatus: data.employmentStatus || "Unknown",
              status: "Active", 
              enrolledAt: data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString() : "N/A",
            });
        }
      });
      setStudents(fetchedStudents);

    } catch (error: any) {
      console.error("Error:", error);
      addLog(`CRITICAL ERROR: ${error.message}`);
      if (error.message.includes("requires an index")) {
        addLog("HINT: You might need to create an index in Firebase Console.");
      }
      if (error.message.includes("permission")) {
         addLog("HINT: Database Rules are blocking this. Did you publish 'allow read: if true;'?");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = incomeFilter === "All" 
    ? students 
    : students.filter(s => s.householdIncome === incomeFilter);

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-slate-900">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-gray-200">
          <div className="flex justify-center mb-4"><Lock className="w-12 h-12 text-blue-600" /></div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Compliance Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="access-code" className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
              <input id="access-code" type="password" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter code..." />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-opacity-90 font-bold transition-colors">Access Reports</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:mb-6 border-b print:border-none pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <ShieldAlert className="w-6 h-6 text-blue-600" />
               <h1 className="text-2xl font-bold text-gray-900">LMI & Workforce Compliance Report</h1>
            </div>
            <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()} • LeadWise Foundation</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 print:hidden">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm">
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>

        {/* DEBUG LOG - VISIBLE ONLY TO ADMIN */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-xs font-mono text-yellow-800 print:hidden">
            <h3 className="font-bold flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4"/> System Logs</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
                {debugLog.length === 0 ? "Waiting for action..." : debugLog.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 print:hidden flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              <label htmlFor="income-filter" className="font-semibold text-gray-700">Filter by Income:</label>
            </div>
            <select id="income-filter" className="p-2 border rounded bg-gray-50 text-sm" value={incomeFilter} onChange={(e) => setIncomeFilter(e.target.value)}>
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

        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:border-2 print:border-gray-900">
            {loading ? (
                <div className="p-12 flex justify-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
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
                                    <td colSpan={5} className="p-12 text-center text-gray-500 italic">No student records found matching this criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
