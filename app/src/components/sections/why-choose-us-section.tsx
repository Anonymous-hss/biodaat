'use client';

import { motion } from 'framer-motion';
import { Sparkles, Rocket, Heart, Target } from 'lucide-react';

const WHY_CHOOSE_US = [
  { Icon: Sparkles, text: 'No design skills needed - Beautiful formats ready' },
  { Icon: Rocket, text: '10,000+ families have trusted us' },
  { Icon: Heart, text: 'Made in India, for Indian families' },
  { Icon: Target, text: 'Gets results - Designed for matrimonial sharing' }
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF8F0] to-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-[#0D5C63] to-[#14919B] rounded-3xl p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-7xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold mb-3">Trusted Choice</h3>
                <p className="text-lg opacity-90">
                  For Indian Families
                </p>
                <div className="mt-8 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold">
                  ✨ 10,000+ Families & Counting
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Benefits */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1F2937]">
                Why Choose Biodaat?
              </h2>
              <p className="text-xl text-[#6B7280] mb-10">
                We understand what Indian families need. Simple, beautiful, and trusted.
              </p>
            </motion.div>

            <div className="space-y-6">
              {WHY_CHOOSE_US.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E07B39] to-[#F4A261] flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg text-[#2D3436] mt-2">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 inline-block bg-green-50 text-green-700 px-6 py-3 rounded-full text-sm font-semibold"
            >
              ✓ Trusted by thousands of Indian families
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
