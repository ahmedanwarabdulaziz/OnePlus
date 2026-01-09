"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { adminUser } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[#0f1b4b]">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the admin dashboard. We will build features step by step.
      </p>
      
      {adminUser && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-[#0f1b4b] mb-4">Your Account</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {adminUser.email}</p>
            <p><span className="font-medium">Role:</span> <span className="capitalize">{adminUser.role}</span></p>
            <p><span className="font-medium">Display Name:</span> {adminUser.displayName || "Not set"}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${adminUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {adminUser.isActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
