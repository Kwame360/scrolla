"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Home, Menu, X } from "lucide-react";

const categories = ["Mathematics", "Computer Science", "Physics", "Biology", "History"];
const collections = ["Bestsellers", "New Arrivals", "Recommended", "Open Access", "Staff Picks"];

export default function Navbar({
  onSelectCategory,
  onSelectCollection,
  selectedCategory,
  selectedCollection,
}: {
  onSelectCategory?: (cat: string | null) => void;
  onSelectCollection?: (col: string | null) => void;
  selectedCategory?: string | null;
  selectedCollection?: string | null;
}) {
  const [openDropdown, setOpenDropdown] = useState<null | 'categories' | 'collections'>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [openDropdown]);

  // Close mobile menu on route change
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [mobileMenuOpen]);

  // Desktop dropdown handlers (hover)
  const handleMouseEnter = (dropdown: 'categories' | 'collections') => {
    if (window.innerWidth >= 768) setOpenDropdown(dropdown);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) setOpenDropdown(null);
  };

  // Mobile dropdown handlers (tap)
  const handleDropdownClick = (dropdown: 'categories' | 'collections') => {
    if (window.innerWidth < 768) setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav ref={navRef} className="sticky top-0 relative z-20 w-full bg-white/90 shadow-sm">
      <div className="flex items-center justify-between px-16 py-4">
        <Link href="/" className="text-orange-500 font-kavoon text-2xl font-bold">Scrolla</Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-gray-800"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/support" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors">
            Support
          </Link>
          <Link href="/about" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-30 animate-fade-in-down px-16">
          <div className="flex flex-col items-center py-4 space-y-2">
            <Link href="/" className="text-orange-500 font-montserrat font-medium flex items-center gap-2 text-lg" onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link href="/support" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors text-lg" onClick={() => setMobileMenuOpen(false)}>
              Support
            </Link>
            <Link href="/about" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors text-lg" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" className="text-gray-800 font-montserrat font-medium hover:text-orange-500 transition-colors text-lg" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 