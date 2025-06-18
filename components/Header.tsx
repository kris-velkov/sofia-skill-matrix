"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            alt="Jakala Logo"
            src="/jakala-logo.webp"
            width={150}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Sofia Skills Matrix Dashboard
          </h1>
        </div>
      </div>
    </header>
  );
}
