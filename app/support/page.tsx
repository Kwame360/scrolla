import React from "react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-48 flex items-center justify-center text-center bg-gradient-to-r from-orange-100 to-orange-300">
        <div className="relative z-10">
          <h1 className="font-kavoon text-4xl md:text-5xl text-orange-600 mb-2 drop-shadow-lg">Support & FAQs</h1>
          <p className="font-montserrat text-lg text-orange-900 max-w-2xl mx-auto drop-shadow">Find answers to common questions about using Scrolla.</p>
        </div>
      </section>
      {/* FAQ Content */}
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h2 className="font-kavoon text-2xl text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="mb-8">
          <h3 className="font-montserrat font-semibold text-lg mb-2 text-orange-600">How do I download a book from Scrolla?</h3>
          <ol className="list-decimal pl-6 font-montserrat text-gray-700 space-y-1">
            <li>Use the search bar to find the book you want.</li>
            <li>Click the <span className="font-semibold">View Details</span> button on the book card.</li>
            <li>In the details popup, click the <span className="font-semibold">Download</span> button.</li>
            <li>Your download will start automatically, or you will be redirected to the download page.</li>
          </ol>
        </div>
        <div className="mb-8">
          <h3 className="font-montserrat font-semibold text-lg mb-2 text-orange-600">What should I do if the download link leads to archive.org?</h3>
          <ol className="list-decimal pl-6 font-montserrat text-gray-700 space-y-1">
            <li>Some books are hosted on <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">Internet Archive</a> for free access.</li>
            <li>On the archive.org page, look for the <span className="font-semibold">Download Options</span> section (usually on the right).</li>
            <li>Choose your preferred format (PDF, ePub, etc.) and click to download.</li>
            <li>If you want to read online, use the <span className="font-semibold">Read</span> button on archive.org.</li>
          </ol>
        </div>
        <div className="mb-8">
          <h3 className="font-montserrat font-semibold text-lg mb-2 text-orange-600">Still need help?</h3>
          <p className="font-montserrat text-gray-700">Contact us via the <a href="/contact" className="text-orange-500 underline">Contact Us</a> page and our team will assist you as soon as possible.</p>
        </div>
      </main>
    </div>
  );
} 