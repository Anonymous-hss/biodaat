// =============================================
// Content Constants for Biodata Maker
// =============================================

export const USPS = [
  {
    icon: 'Lock',
    title: 'Privacy-First',
    description: 'Your data stays safe, never stored permanently'
  },
  {
    icon: 'Users',
    title: 'Family-Approved',
    description: 'Traditional formats elders trust'
  },
  {
    icon: 'Share2',
    title: 'WhatsApp-Ready',
    description: 'Instantly share via WhatsApp, email, QR'
  },
  {
    icon: 'Zap',
    title: 'Instant PDF',
    description: 'Download in seconds, no signup needed'
  }
] as const;

export const TESTIMONIALS = [
  {
    quote: "Finally found a biodata maker my mother approved of. The traditional template was perfect!",
    name: "Priya K.",
    location: "Mumbai, Maharashtra",
    rating: 5
  },
  {
    quote: "So easy to share on our family WhatsApp group. Got amazing responses within days!",
    name: "Rahul S.",
    location: "Delhi, NCR",
    rating: 5
  },
  {
    quote: "The professional look really helped. Families appreciated the clean, respectful format.",
    name: "Anjali M.",
    location: "Bangalore, Karnataka",
    rating: 5
  }
] as const;

export const FAQS = [
  {
    question: 'Is my data safe and private?',
    answer: 'Yes, we process your data securely. We don\'t store personal information permanently on our servers.'
  },
  {
    question: 'Do I need to pay or sign up?',
    answer: 'No! It\'s completely free with no registration required. Just fill and download.'
  },
  {
    question: 'Can I edit my biodata after downloading?',
    answer: 'Absolutely! Just fill the form again with updated details and regenerate a new PDF.'
  },
  {
    question: 'How do I share on WhatsApp?',
    answer: 'Download the PDF and share directly, or use the shareable link we generate for you.'
  },
  {
    question: 'Will my family approve of these formats?',
    answer: 'Our templates are designed with traditional Indian aesthetics that elders trust and appreciate.'
  },
  {
    question: 'Can I customize the template?',
    answer: 'Yes! Choose from 8+ professional templates that match your style and personality.'
  }
] as const;

export const WHY_CHOOSE_US = [
  {
    icon: 'Sparkles',
    text: 'No design skills needed - Beautiful formats ready'
  },
  {
    icon: 'Rocket',
    text: '10,000+ families have trusted us'
  },
  {
    icon: 'Heart',
    text: 'Made in India, for Indian families'
  },
  {
    icon: 'Target',
    text: 'Gets results - Designed for matrimonial sharing'
  }
] as const;

export const BIODATA_FORMAT = [
  {
    title: 'Personal Details',
    items: [
      'Full name, date of birth, time & place of birth',
      'Height, complexion, blood group',
      'Marital status'
    ]
  },
  {
    title: 'Education & Profession',
    items: [
      'Educational qualifications',
      'Current occupation & company',
      'Annual income'
    ]
  },
  {
    title: 'Family Background',
    items: [
      'Father\'s & mother\'s name & occupation',
      'Number of siblings (married/unmarried)',
      'Family type (joint/nuclear)'
    ]
  },
  {
    title: 'Horoscope Details (Optional)',
    items: [
      'Rashi, nakshatra',
      'Gotra',
      'Manglik status'
    ]
  },
  {
    title: 'Contact Information',
    items: [
      'Permanent address',
      'City, State',
      'Phone number, Email'
    ]
  },
  {
    title: 'Partner Expectations (Optional)',
    items: [
      'Preferred age range',
      'Educational qualifications',
      'Profession preferences'
    ]
  }
] as const;

export const TEMPLATES = [
  { id: 1, name: 'Traditional', icon: '🕉️', color: '#D4AF37', desc: 'Classic with religious motifs' },
  { id: 2, name: 'Modern Minimal', icon: '✨', color: '#0D5C63', desc: 'Clean and elegant' },
  { id: 3, name: 'Professional', icon: '💼', color: '#2C3E50', desc: 'Career-focused layout' },
  { id: 4, name: 'Elegant Floral', icon: '🌸', color: '#E91E63', desc: 'Soft floral borders' },
  { id: 5, name: 'Royal Gold', icon: '👑', color: '#B8860B', desc: 'Premium golden accents' },
  { id: 6, name: 'Simple Classic', icon: '📄', color: '#6B7280', desc: 'No-frills format' },
  { id: 7, name: 'Contemporary', icon: '🎨', color: '#6366F1', desc: 'Modern geometric patterns' },
  { id: 8, name: 'Spiritual', icon: '🙏', color: '#F59E0B', desc: 'Peaceful religious theme' },
] as const;
