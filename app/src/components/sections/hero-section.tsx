'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const scrollToBuilder = () => {
    document.getElementById('biodata-builder')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-gradient-to-br from-[#FFF8F0] via-[#FFE4CC] to-[#FFF8F0] relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-[rgba(224,123,57,0.1)] blur-[60px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] rounded-full bg-[rgba(13,92,99,0.1)] blur-[60px] opacity-40 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div className="text-center lg:text-left">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[rgba(224,123,57,0.1)] text-[#E07B39] px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <span>✨</span>
            100% Free • No Sign-up Required
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#1F2937]"
          >
            Create a Biodata{' '}
            <span className="bg-gradient-to-r from-[#E07B39] to-[#F4A261] bg-clip-text text-transparent">
              Your Family Will Be Proud Of
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            Beautiful, traditional formats that elders trust. Ready in 2 minutes. 
            Share instantly on WhatsApp with family and relatives.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <Button onClick={scrollToBuilder} size="lg">
              Create My Biodata →
            </Button>
            <Button onClick={scrollToTemplates} variant="secondary" size="lg">
              View Templates
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center gap-6 flex-wrap justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <span className="text-sm text-[#6B7280]">10,000+ Families Trust Us</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <span className="text-sm text-[#6B7280]">100% Secure & Private</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Biodata Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white rounded-3xl p-10 shadow-[0_8px_40px_rgba(13,92,99,0.16)] border border-[rgba(13,92,99,0.08)] max-w-md mx-auto"
          >
            {/* Om Symbol Header */}
            <div className="text-center mb-6 pb-5 border-b-2 border-[#FFF8DC]">
              <div className="text-4xl text-[#E07B39] mb-2">🕉️</div>
              <h3 className="text-lg font-semibold text-[#0D5C63]">
                ॥ श्री गणेशाय नमः ॥
              </h3>
              <div className="w-3/5 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
              <p className="text-xs tracking-[4px] mt-2 text-[#92400E]">BIODATA</p>
            </div>

            {/* Photo Placeholder */}
            <div className="w-24 h-28 mx-auto mb-6 rounded-lg border-3 border-[#D4AF37] bg-gray-50 flex items-center justify-center overflow-hidden">
              <span className="text-5xl">👤</span>
            </div>

            {/* Sample Data */}
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name', value: 'Priya Sharma' },
                { label: 'Date of Birth', value: '15 May 1995' },
                { label: 'Height', value: '5\'4"' },
                { label: 'Education', value: 'MBA, IIM Bangalore' },
                { label: 'Occupation', value: 'Marketing Manager' },
                { label: 'City', value: 'Mumbai, Maharashtra' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#FFF8DC] rounded-lg px-4 py-2.5">
                  <span className="font-semibold text-[#92400E] min-w-[90px]">{item.label}</span>
                  <span className="text-[#78350F]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t-2 border-[#D4AF37]">
              <p className="text-xs text-[#92400E]">॥ शुभमस्तु ॥</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
