'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { BIODATA_FORMAT } from '@/lib/constants';

export default function FormatGuideSection() {
  return (
    <section id="format-guide" className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1F2937]">
            Standard Indian Marriage Biodata Format
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            A complete guide to creating a traditional biodata that families appreciate
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Format Guide */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-[#0D5C63]/20">
              <div className="space-y-6">
                {BIODATA_FORMAT.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-[#0D5C63] mb-3 font-serif">
                      {index + 1}. {section.title}
                    </h3>
                    <ul className="space-y-2 text-[#636E72] font-serif">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm leading-relaxed">
                          <span className="text-[#E07B39] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right: Sample Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-2xl p-8 border-4 border-[#D4AF37] shadow-lg">
              <div className="text-center mb-6">
                <div className="text-3xl text-[#D4AF37] mb-2">🕉️</div>
                <h4 className="text-lg font-bold text-[#92400E] font-serif">
                  Sample Format
                </h4>
                <div className="w-3/5 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
              </div>

              <div className="space-y-3 text-sm font-serif">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>Name:</strong> Rahul Kumar Sharma
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>DOB:</strong> 15th May, 1995 | 10:30 AM
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>Education:</strong> B.Tech (Computer Science)
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>Profession:</strong> Software Engineer at Google
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>Father:</strong> Mr. Vijay Sharma (Businessman)
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-[#92400E]">
                    <strong>Contact:</strong> Mumbai, Maharashtra
                  </p>
                </div>
              </div>

              <div className="text-center mt-6 pt-4 border-t-2 border-[#D4AF37]">
                <p className="text-xs text-[#92400E] font-serif">
                  ॥ शुभमस्तु ॥
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
