'use client';

import { motion } from 'framer-motion';
import { Lock, Users, Share2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const USPS = [
  {
    Icon: Lock,
    title: 'Privacy-First',
    description: 'Your data stays safe, never stored permanently'
  },
  {
    Icon: Users,
    title: 'Family-Approved',
    description: 'Traditional formats elders trust'
  },
  {
    Icon: Share2,
    title: 'WhatsApp-Ready',
    description: 'Instantly share via WhatsApp, email, QR'
  },
  {
    Icon: Zap,
    title: 'Instant PDF',
    description: 'Download in seconds, no signup needed'
  }
];

export default function UspSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {USPS.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center h-full hover:shadow-[0_8px_30px_rgba(224,123,57,0.15)] transition-all duration-300 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E07B39] to-[#F4A261] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <usp.Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#1F2937]">
                    {usp.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {usp.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
