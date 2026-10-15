import { NextResponse } from 'next/server';

export interface ChatAction {
  label: string;
  href: string;
}

export interface ChatResponsePayload {
  messages: string[];
  suggestions: string[];
  action?: ChatAction;
  response: string; // for backwards compatibility
}

// =========================================================
// SMART INTENT CLASSIFIER & MULTI-MESSAGE GENERATOR
// =========================================================
function processChatQuery(rawInput: string): ChatResponsePayload {
  const query = rawInput.trim().toLowerCase();

  // 1. Safety & Crisis Protocol (Highest Priority)
  if (
    query.includes('suicide') ||
    query.includes('kill myself') ||
    query.includes('hurt myself') ||
    query.includes('die') ||
    query.includes('end my life') ||
    query.includes('emergency') ||
    query.includes('crisis')
  ) {
    const messages = [
      "I hear how much pain you're in, and your safety is the most important thing right now. Please know that you are not alone.",
      'If you are in immediate danger or need urgent help, please reach out right now:\n\n• Call or text 988 for the 988 Suicide & Crisis Lifeline (Free, confidential, 24/7)\n• Text HOME to 741741 to connect with Crisis Text Line\n• Call 911 or visit your nearest emergency room',
      'Pentasent is an informational platform and cannot replace professional emergency care. Please connect with someone who can support you right now.',
    ];
    return {
      messages,
      suggestions: [
        '988 Crisis Lifeline Information',
        'Grounding exercises',
        'Pentasent Support',
      ],
      action: {
        label: 'Emergency & Safety Resources',
        href: '/legal/terms',
      },
      response: messages.join('\n\n'),
    };
  }

  // 2. Greetings & Maya Persona
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.startsWith('hey ') ||
    query === 'good morning' ||
    query === 'good evening' ||
    query === 'good afternoon'
  ) {
    const messages = [
      "Hello! 👋 It's wonderful to connect with you.",
      "I'm MAYA, your Pentasent guide. I can help you calculate health metrics (BMI, BMR, Calories), learn about our platform, or navigate our clinical research.",
      'What would you like to explore today?',
    ];
    return {
      messages,
      suggestions: [
        'Calculate my BMI',
        'Explore Health Calculators',
        'What is Pentasent?',
        'Pricing & Plans',
      ],
      response: messages.join('\n\n'),
    };
  }

  // 3. Who is Maya / What is Maya
  if (
    query.includes('who is maya') ||
    query.includes('what is maya') ||
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('tell me about yourself')
  ) {
    const messages = [
      "I'm MAYA, the intelligent assistant for the Pentasent healthcare platform.",
      'I am trained on Pentasent’s evidence-based health tools, clinical guidelines, research initiatives, and platform services.',
      'I can guide you through health metrics, answer questions about medical clinics and hospital integrations, or help you find the right resources.',
    ];
    return {
      messages,
      suggestions: [
        'What is Pentasent?',
        'Evidence-Based Tools',
        'Talk to Sales & Support',
        'Careers at Pentasent',
      ],
      response: messages.join('\n\n'),
    };
  }

  // 4. BMI Calculator
  if (
    query.includes('bmi') ||
    query.includes('body mass index') ||
    query.includes('calculate weight') ||
    query.includes('am i overweight') ||
    query.includes('underweight') ||
    query.includes('healthy weight')
  ) {
    const messages = [
      'Our BMI Calculator allows you to quickly assess your Body Mass Index using the World Health Organization (WHO) standard classification.',
      'You can switch easily between Metric (kg/cm) and US Imperial (lbs/ft-in) units. It also calculates your healthy weight range and BMI prime index.',
    ];
    return {
      messages,
      suggestions: [
        'Calculate BMR instead',
        'Calorie Calculator',
        'Unit Measurement Converter',
        'What is Pentasent?',
      ],
      action: {
        label: 'Open BMI Calculator',
        href: '/tools/bmi-calculator',
      },
      response: messages.join('\n\n'),
    };
  }

  // 5. BMR Calculator
  if (
    query.includes('bmr') ||
    query.includes('basal metabolic') ||
    query.includes('metabolism') ||
    query.includes('calories at rest') ||
    query.includes('mifflin')
  ) {
    const messages = [
      'Our BMR (Basal Metabolic Rate) Calculator uses the clinically recognized Mifflin-St Jeor equation to calculate how many calories your body expends at rest.',
      'It takes into account your biological sex, age, height, and weight to establish your baseline caloric burn for vital bodily functions.',
    ];
    return {
      messages,
      suggestions: [
        'Calorie & TDEE Calculator',
        'BMI Calculator',
        'All Health Tools',
      ],
      action: {
        label: 'Open BMR Calculator',
        href: '/tools/bmr-calculator',
      },
      response: messages.join('\n\n'),
    };
  }

  // 6. Calorie / TDEE / Diet / Weight Loss Calculator
  if (
    query.includes('calorie') ||
    query.includes('calories') ||
    query.includes('tdee') ||
    query.includes('deficit') ||
    query.includes('surplus') ||
    query.includes('lose weight') ||
    query.includes('gain weight') ||
    query.includes('macro')
  ) {
    const messages = [
      'Our Calorie Calculator computes your Total Daily Energy Expenditure (TDEE) based on your activity level and baseline metabolic rate.',
      'It generates tailored caloric recommendations depending on whether your goal is weight maintenance, mild or intense fat loss (deficit), or lean muscle gain (surplus).',
    ];
    return {
      messages,
      suggestions: [
        'BMR Calculator',
        'BMI Calculator',
        'Health Converter',
      ],
      action: {
        label: 'Open Calorie Calculator',
        href: '/tools/calorie-calculator',
      },
      response: messages.join('\n\n'),
    };
  }

  // 7. Measurement Converter (Glucose, Cholesterol, Units)
  if (
    query.includes('converter') ||
    query.includes('glucose') ||
    query.includes('blood sugar') ||
    query.includes('cholesterol') ||
    query.includes('mg/dl') ||
    query.includes('mmol/l') ||
    query.includes('convert') ||
    query.includes('units')
  ) {
    const messages = [
      'Our Health Measurement Converter lets you accurately translate laboratory and clinical numbers across international standards.',
      'Supported metrics include Blood Glucose (mg/dL to mmol/L), Total Cholesterol, Body Weight (kg to lbs), Height (cm to ft/in), and Body Temperature (°C to °F).',
    ];
    return {
      messages,
      suggestions: [
        'Calculate BMI',
        'Explore All Tools',
        'Evidence-Based Guidance',
      ],
      action: {
        label: 'Open Health Converter',
        href: '/tools/health-converter',
      },
      response: messages.join('\n\n'),
    };
  }

  // 8. General Health Tools / Calculators
  if (
    query.includes('tool') ||
    query.includes('tools') ||
    query.includes('calculator') ||
    query.includes('calculators')
  ) {
    const messages = [
      'Pentasent features a suite of 4 evidence-based health calculators built with modern medical formulas and clear educational guidance.',
      'You can explore the BMI Calculator, BMR Calculator, Calorie Calculator, or Health Measurement Converter anytime.',
    ];
    return {
      messages,
      suggestions: [
        'BMI Calculator',
        'BMR Calculator',
        'Calorie Calculator',
        'Health Measurement Converter',
      ],
      action: {
        label: 'Browse Health Tools',
        href: '/tools',
      },
      response: messages.join('\n\n'),
    };
  }

  // 9. What is Pentasent / About
  if (
    query.includes('what is pentasent') ||
    query.includes('about pentasent') ||
    query.includes('pentasent platform') ||
    query.includes('company') ||
    query.includes('mission') ||
    query.includes('vision')
  ) {
    const messages = [
      'Pentasent is a comprehensive digital health platform designed to bridge clinical evidence, practitioner networks, and proactive personal wellness.',
      'We connect individuals with verified healthcare providers, clinical research publications, and free evidence-based tools, while helping medical organizations manage digital connectivity.',
    ];
    return {
      messages,
      suggestions: [
        'Explore Health Tools',
        'Pricing & Plans',
        'Research & Articles',
        'Meet the Team',
      ],
      action: {
        label: 'About Pentasent',
        href: '/company/about',
      },
      response: messages.join('\n\n'),
    };
  }

  // 10. Pricing, Cost, Plans & Request Quote
  if (
    query.includes('price') ||
    query.includes('pricing') ||
    query.includes('cost') ||
    query.includes('plan') ||
    query.includes('plans') ||
    query.includes('quote') ||
    query.includes('free') ||
    query.includes('subscription') ||
    query.includes('fee')
  ) {
    const messages = [
      'Pentasent provides transparent, ecosystem-aligned pricing tailored for healthcare organizations, private clinics, and enterprise hospitals.',
      'All our health calculators (BMI, BMR, Calorie, and Converter) are 100% free and open to everyone. For clinic onboarding and organization integration, you can submit a quote request on our Pricing page.',
    ];
    return {
      messages,
      suggestions: [
        'Request a Quote',
        'Clinic Plans',
        'Hospital Enterprise',
        'Talk to Sales',
      ],
      action: {
        label: 'View Pricing & Plans',
        href: '/pricing',
      },
      response: messages.join('\n\n'),
    };
  }

  // 11. Doctors, Practitioners, Clinics & Hospitals
  if (
    query.includes('doctor') ||
    query.includes('doctors') ||
    query.includes('physician') ||
    query.includes('specialist') ||
    query.includes('clinic') ||
    query.includes('clinics') ||
    query.includes('hospital') ||
    query.includes('hospitals') ||
    query.includes('practitioner') ||
    query.includes('therapist') ||
    query.includes('claim profile')
  ) {
    const messages = [
      'Pentasent partners with verified healthcare practitioners, medical clinics, and hospital networks.',
      'Healthcare professionals can claim their verified directory profile, showcase clinical specializations, and integrate patient scheduling. Organizations can connect via our Provider Help Center.',
    ];
    return {
      messages,
      suggestions: [
        'Provider Help Center',
        'Request Clinic Quote',
        'Contact Partnership Team',
      ],
      action: {
        label: 'Contact Provider Support',
        href: '/company/contact',
      },
      response: messages.join('\n\n'),
    };
  }

  // 12. Blog, News, Articles & Research
  if (
    query.includes('blog') ||
    query.includes('article') ||
    query.includes('articles') ||
    query.includes('news') ||
    query.includes('research') ||
    query.includes('clinical study') ||
    query.includes('press') ||
    query.includes('paper')
  ) {
    const messages = [
      'Pentasent regularly publishes peer-reviewed clinical insights, digital health breakthroughs, and wellness perspectives on our News & Blog platform.',
      'You can filter articles by categories like Healthcare, Clinical Research, News, and Company Updates, or submit press releases.',
    ];
    return {
      messages,
      suggestions: [
        'Browse Latest Articles',
        'Clinical Research Team',
        'Submit Press Release',
      ],
      action: {
        label: 'Explore Pentasent Blog',
        href: '/blog',
      },
      response: messages.join('\n\n'),
    };
  }

  // 13. Careers, Jobs, Hiring & Culture
  if (
    query.includes('career') ||
    query.includes('careers') ||
    query.includes('job') ||
    query.includes('jobs') ||
    query.includes('hiring') ||
    query.includes('open role') ||
    query.includes('work at') ||
    query.includes('intern') ||
    query.includes('engineer') ||
    query.includes('culture')
  ) {
    const messages = [
      'We are actively expanding the Pentasent team! We are looking for talented software engineers, clinical researchers, product designers, and healthcare strategists.',
      'You can view all current open roles, review our employee benefits, and learn about our team culture on our Careers portal.',
    ];
    return {
      messages,
      suggestions: [
        'View Open Roles',
        'Research Careers',
        'Life at Pentasent',
        'Phishing Scam Warning',
      ],
      action: {
        label: 'View Open Roles',
        href: '/company/careers',
      },
      response: messages.join('\n\n'),
    };
  }

  // 14. Contact, Sales, Support & Help
  if (
    query.includes('contact') ||
    query.includes('support') ||
    query.includes('sales') ||
    query.includes('help') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('reach out') ||
    query.includes('talk to')
  ) {
    const messages = [
      'Our team is here to assist you! Whether you need support with your account, have questions about clinic onboarding, or want to discuss enterprise partnerships.',
      'You can reach us through our contact form, email support@pentasent.com, or request a callback for institutional queries.',
    ];
    return {
      messages,
      suggestions: [
        'Open Contact Form',
        'Request a Quote',
        'Provider Help Center',
      ],
      action: {
        label: 'Go to Contact Page',
        href: '/company/contact',
      },
      response: messages.join('\n\n'),
    };
  }

  // 15. Stress, Anxiety, Mental Wellbeing & Grounding
  if (
    query.includes('stress') ||
    query.includes('stressed') ||
    query.includes('anxiety') ||
    query.includes('anxious') ||
    query.includes('overwhelmed') ||
    query.includes('tired') ||
    query.includes('lonely') ||
    query.includes('sad') ||
    query.includes('breathe') ||
    query.includes('relax') ||
    query.includes('burnout')
  ) {
    const messages = [
      'It sounds like you are carrying a lot right now. Taking a moment to acknowledge that is an important first step.',
      'Try taking one slow, deep breath with me: Inhale through your nose for 4 counts, hold gently for 4, and release through your mouth for 4.',
      'Would you like to explore stress reduction techniques, check out our wellbeing articles, or talk through what is on your mind?',
    ];
    return {
      messages,
      suggestions: [
        'Quick breathing exercise',
        'Articles on stress management',
        'Talk to a professional',
        'Explore Health Calculators',
      ],
      action: {
        label: 'Read Wellbeing Articles',
        href: '/blog',
      },
      response: messages.join('\n\n'),
    };
  }

  // 15.5 Investors, Pre-Seed Round, Pitch Deck & Funding
  if (
    query.includes('investor') ||
    query.includes('investors') ||
    query.includes('investment') ||
    query.includes('funding') ||
    query.includes('pitch deck') ||
    query.includes('pre-seed') ||
    query.includes('preseed') ||
    query.includes('raise') ||
    query.includes('dilution') ||
    query.includes('valuation') ||
    query.includes('shareholder') ||
    query.includes('annual meeting') ||
    query.includes('founders letter')
  ) {
    const messages = [
      'Pentasent is building the operating layer for connected healthcare and is currently raising our €750k Pre-Seed round.',
      'Our round is planned with ~10–12% target dilution and ~24 months of runway, focused on density across practitioner networks, evidence tools, and graph connectivity.',
      'You can explore our official 17-slide Pre-Seed Pitch Deck, download the PDF/PPTX, or review our Founders’ Letter on our dedicated Investor Relations portal.',
    ];
    return {
      messages,
      suggestions: [
        'View Pitch Deck (2026)',
        'Pre-Seed Round Details',
        "Read Founders' Letter",
        'Contact Investor Relations',
      ],
      action: {
        label: 'Open Investor Relations',
        href: '/company/investors',
      },
      response: messages.join('\n\n'),
    };
  }

  // 16. Coming Soon & In-Development Features
  if (
    query.includes('coming soon') ||
    query.includes('new features') ||
    query.includes('roadmap') ||
    query.includes('waitlist') ||
    query.includes('stay tuned')
  ) {
    const messages = [
      'We have exciting new modules currently in active development, including community circles, clinician directory booking, and digital product listings.',
      'You can visit our Coming Soon page to sign up for priority notifications the moment new features launch!',
    ];
    return {
      messages,
      suggestions: [
        'Visit Coming Soon page',
        'Explore Active Calculators',
        'Read Latest News',
      ],
      action: {
        label: 'Visit Coming Soon',
        href: '/coming-soon',
      },
      response: messages.join('\n\n'),
    };
  }

  // =========================================================
  // 17. DYNAMIC SMART FALLBACK FOR UNRECOGNIZED QUESTIONS
  // =========================================================
  // Intelligently scans query for partial keywords to offer high-relevance suggestions
  const contextualSuggestions: string[] = [];

  if (query.includes('health') || query.includes('body') || query.includes('fit')) {
    contextualSuggestions.push('BMI & BMR Calculators', 'Calorie Needs (TDEE)');
  }
  if (query.includes('work') || query.includes('company') || query.includes('team')) {
    contextualSuggestions.push('About Pentasent', 'Careers & Open Roles');
  }
  if (query.includes('doctor') || query.includes('clinic') || query.includes('hospital')) {
    contextualSuggestions.push('Healthcare Provider Network', 'Request Organization Quote');
  }

  // Ensure 3-4 high quality suggestions
  const defaultSuggestions = [
    'Evidence-Based Health Calculators',
    'What is Pentasent?',
    'Pricing & Organization Plans',
    'Talk to Sales & Support',
  ];

  for (const s of defaultSuggestions) {
    if (contextualSuggestions.length < 4 && !contextualSuggestions.includes(s)) {
      contextualSuggestions.push(s);
    }
  }

  const messages = [
    "I'm not quite sure I have the exact answer for that yet, but I'm continuously expanding my healthcare knowledge!",
    "Here are some of the most popular topics I can assist you with right now. Select an option below or type what you're looking for:",
  ];

  return {
    messages,
    suggestions: contextualSuggestions,
    response: messages.join('\n\n'),
  };
}

// =========================================================
// POST ROUTE HANDLER
// =========================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    // Brief realistic thinking delay for the server response
    await new Promise((resolve) => setTimeout(resolve, 400));

    const result = processChatQuery(message);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pentasent Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}