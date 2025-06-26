import React from "react";

export function LoadingBlock({ message }: { readonly message: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-500">{message}</p>
      </main>
    </div>
  );
}

export function ErrorBlock({ error }: { readonly error: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    </div>
  );
}

export function NotFoundBlock({ message }: { readonly message: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-400">{message}</p>
      </main>
    </div>
  );
}
