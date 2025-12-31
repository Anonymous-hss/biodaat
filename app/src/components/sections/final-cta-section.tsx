'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function FinalCtaSection() {
  const scrollToBuilder = () => {
    document.getElementById('biodata-builder')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-[#0D5C63] via-[#14919B] to-[#0D5C63] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">💝</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">🎯</div>
        <div className="absolute top-1/3 right-1/4 text-4xl">📱</div>
      </div>

      <div className="max-w-[900px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Ready to Create Your Perfect Biodata?
          </h2>

          {/* Sub-text */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of families who found their match. 
            <br className="hidden md:block" />
            Start in just 2 minutes. Completely free.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToBuilder}
              size="xl"
              className="text-2xl px-12 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)] bg-white text-[#0D5C63] hover:bg-white hover:text-[#0D5C63] font-bold"
            >
              Create My Biodata Now →
            </Button>
          </motion.div>

          {/* Reassurance */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-white/80 text-sm"
          >
            🔒 100% Free • No Credit Card • No Registration Required
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
