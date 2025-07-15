import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <h1 className="font-kavoon text-4xl md:text-5xl text-white mb-2 drop-shadow-lg">About Us</h1>
          <p className="font-montserrat text-lg text-white max-w-2xl mx-auto drop-shadow">Learn more about Scrolla and our mission to make academic resources accessible to all.</p>
        </div>
      </section>
      {/* About Content */}
      <main className="max-w-4xl mx-auto py-16 px-4">
        <section className="mb-12">
          <h2 className="font-kavoon text-2xl text-gray-800 mb-2">Our Mission</h2>
          <p className="font-montserrat text-gray-700">
            To provide a comprehensive collection of academic books, journals, and resources from various disciplines. We aim to make research and learning accessible to everyone, regardless of their location or background.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="font-kavoon text-2xl text-gray-800 mb-2">Features</h2>
          <ul className="list-disc pl-6 font-montserrat text-gray-700 space-y-2">
            <li>Search and discover millions of free academic books</li>
            <li>Read books online or download them for offline use</li>
            <li>Filter by title, author, subject, or collection</li>
            <li>Weekly featured books and curated collections</li>
            <li>Responsive, accessible, and modern design</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="font-kavoon text-2xl text-gray-800 mb-2">Our Vision</h2>
          <p className="font-montserrat text-gray-700">
            We envision a world where every student and researcher has free and easy access to the academic resources they need to succeed. Scrolla is committed to breaking down barriers to knowledge and empowering learners everywhere.
          </p>
        </section>
        <section>
          <h2 className="font-kavoon text-2xl text-gray-800 mb-2">Meet the Team</h2>
          <p className="font-montserrat text-gray-700 mb-4">
            Scrolla is built by a passionate team of developers, designers, and educators who believe in open access to knowledge. We are always looking for feedback and ways to improve the platform.
          </p>
          <ul className="font-montserrat text-gray-700">
            <li><span className="font-semibold">Jane Doe</span> – Founder & Product Lead</li>
            <li><span className="font-semibold">John Smith</span> – Lead Developer</li>
            <li><span className="font-semibold">Aisha Patel</span> – UX/UI Designer</li>
            <li><span className="font-semibold">Carlos Ruiz</span> – Community Manager</li>
          </ul>
        </section>
      </main>
    </div>
  );
} 