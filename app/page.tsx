import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Your personal workspace
          <br />
          for <span className="text-blue-600">better productivity</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12">
          Organize your projects, tasks, and goals in one place. Stay focused
          and achieve more with your personal command center.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <Link
            href="/start-free"
            className="bg-white text-black px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </section>
    </main>
  );
}
