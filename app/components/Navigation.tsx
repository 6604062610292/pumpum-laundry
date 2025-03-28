"use client";

import { Home, User } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-around py-3">
        <button
          onClick={() => setCurrentPage("home")}
          className={`flex flex-col items-center ${
            currentPage === "home" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Home />
          <span className="text-xs">หน้าหลัก</span>
        </button>

        <button
          onClick={() => setCurrentPage("profile")}
          className={`flex flex-col items-center ${
            currentPage === "profile" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <User />
          <span className="text-xs">ข้อมูลส่วนตัว</span>
        </button>
      </div>
    </div>
  );
}
