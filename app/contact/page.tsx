import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-48 flex items-center justify-center text-center bg-gradient-to-r from-orange-100 to-orange-300">
        <div className="relative z-10">
          <h1 className="font-kavoon text-4xl md:text-5xl text-orange-600 mb-2 drop-shadow-lg">Contact Us</h1>
          <p className="font-montserrat text-lg text-orange-900 max-w-2xl mx-auto drop-shadow">Have a question or need help? Reach out to the Scrolla team below.</p>
        </div>
      </section>
      {/* Contact Form */}
      <main className="max-w-xl mx-auto py-12 px-4">
        <form className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block font-montserrat font-medium mb-1 text-gray-700">Name</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Your Name" />
          </div>
          <div>
            <label className="block font-montserrat font-medium mb-1 text-gray-700">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block font-montserrat font-medium mb-1 text-gray-700">Message</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-orange-300" rows={5} placeholder="How can we help you?" />
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-montserrat font-medium py-3 rounded transition-colors">Send Message</button>
        </form>
        <div className="mt-8 text-center text-green-600 font-montserrat hidden">Thank you for contacting us! We'll get back to you soon.</div>
      </main>
    </div>
  );
} 