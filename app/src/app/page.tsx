'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import UspSection from '@/components/sections/usp-section';
import TemplatesCarousel from '@/components/sections/templates-carousel';
import BiodataBuilder from '@/components/sections/biodata-builder';
import WhyChooseUsSection from '@/components/sections/why-choose-us-section';
import TestimonialsSection from '@/components/sections/testimonials-section';
import FormatGuideSection from '@/components/sections/format-guide-section';
import FaqSection from '@/components/sections/faq-section';
import FinalCtaSection from '@/components/sections/final-cta-section';

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <UspSection />
        <TemplatesCarousel 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
        <BiodataBuilder selectedTemplate={selectedTemplate} />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FormatGuideSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
