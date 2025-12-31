'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { TEMPLATES } from '@/lib/constants';

interface TemplatesCarouselProps {
  selectedTemplate: number;
  onSelectTemplate: (id: number) => void;
}

export default function TemplatesCarousel({ selectedTemplate, onSelectTemplate }: TemplatesCarouselProps) {
  const handleTemplateSelect = (id: number) => {
    onSelectTemplate(id);
    // Scroll to builder
    setTimeout(() => {
      document.getElementById('biodata-builder')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  };

  return (
    <section id="templates" className="py-24 px-6 bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1F2937]">
            Choose Your Template
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            Select a design that matches your style and personality
          </p>
        </motion.div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {TEMPLATES.map((template) => (
            <SwiperSlide key={template.id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTemplateSelect(template.id)}
                className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                  selectedTemplate === template.id
                    ? `border-4 border-[${template.color}] shadow-[0_8px_30px_rgba(224,123,57,0.3)]`
                    : 'border-4 border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
                }`}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="text-6xl mb-4">{template.icon}</div>
                  
                  {/* Name */}
                  <h3 
                    className="text-xl font-bold mb-2" 
                    style={{ color: template.color }}
                  >
                    {template.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-[#6B7280] mb-4">
                    {template.desc}
                  </p>

                  {/* Selected Badge */}
                  {selectedTemplate === template.id && (
                    <div 
                      className="inline-block text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                      style={{ backgroundColor: template.color }}
                    >
                      ✓ Selected
                    </div>
                  )}

                  {/* Hover CTA */}
                  {selectedTemplate !== template.id && (
                    <div className="text-sm font-medium text-[#0D5C63] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Use This Template →
                    </div>
                  )}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
