import React from "react";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-[#232136] sticky top-0 z-40 shadow-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/leadwise-logo.svg" alt="LeadWise" className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl">LeadWise Foundation</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/#templates" className="text-gray-300 hover:text-white transition">Templates</Link>
            <a href="https://services.letsleadwise.org/courses" className="text-white font-semibold">Courses</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#232136] mb-6">Our Courses</h1>
        <p className="text-xl text-gray-700">Coming soon...</p>
      </div>
    </div>
  );
}
