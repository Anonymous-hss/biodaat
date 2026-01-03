'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBuilder = () => {
    document.getElementById('biodata-builder')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_8px_rgba(13,92,99,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
              ✦
            </span>
            <span className="text-2xl font-bold text-[#0D5C63] tracking-tight">
              Biodaat
            </span>
          </a>

          {/* CTA Button */}
          <Button onClick={scrollToBuilder} size="default">
            Create My Biodata →
          </Button>
        </div>
      </div>
    </header>
  );
}
