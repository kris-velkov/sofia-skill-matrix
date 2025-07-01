import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-200 max-w-lg w-full">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
