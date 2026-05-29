"use client";

import Link from "next/link";

export default function DashboardPage() {

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-2">
        Dashboard
      </h1>

      <p className="text-zinc-400 mb-10">
        Welcome to your AI Interview Platform
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-semibold mb-3">
            Resume Analysis
          </h2>

          <p className="text-zinc-400 mb-4">
            Upload and analyze your resume with AI.
          </p>

          <Link href="/upload">

  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
    Upload Resume
  </button>

</Link>

        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-semibold mb-3">
            Mock Interview
          </h2>

          <p className="text-zinc-400 mb-4">
            Practice technical and HR interviews.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Start Interview
          </button>

        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-semibold mb-3">
            Analytics
          </h2>

          <p className="text-zinc-400 mb-4">
            Track your interview performance.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            View Analytics
          </button>

        </div>

      </div>

    </div>
  );
}