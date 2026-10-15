import { LifeHeroData, LifeHighlightsData, PentasentLeadershipData, LifeGrowthOnMapData, LifeCelebrationsData, LifeMissionWorkLifeData, LifePrinciplesData, LifeBottomCtaData } from '@/types/life';

export const LIFE_HERO_DATA: LifeHeroData = {
  badge: 'Life at Pentasent',
  headlineStart: 'Building the future of',
  highlightedWord: 'healthcare',
  headlineEnd: 'together',
  subtitle:
    'Join a collaborative, mission-driven team dedicated to simplifying healthcare for doctors, clinical practices, and millions of patients worldwide.',
  ctaText: 'Explore open roles',
  ctaHref: '/company/careers/open-roles',
};

export const LIFE_HIGHLIGHTS_DATA: LifeHighlightsData = {
  badge: 'Life at Pentasent',
  title: 'Life at Pentasent',
  subtitle:
    'We do more than just work — we learn together, celebrate milestones, and create lasting memories. From team outings to office moments, every day at Pentasent is full of energy, connection, and collaboration.',
  row1: [
    {
      type: 'quote',
      id: 'quote-1',
      quote: 'More than a job — I learned and grew every day.',
      authorName: 'Saurabh',
      authorRole: 'Heald of Sales',
      authorAvatar: '/assets/images/team/saurabh.png',
    },
    {
      type: 'photo',
      id: 'photo-1',
      image: '/assets/images/pages/life/life_3.png',
      alt: 'Pentasent team collaboration and connection',
    },
    {
      type: 'photo',
      id: 'photo-2',
      image: '/assets/images/pages/life/life_4.png',
      alt: 'Team collaborative meeting and brainstorm',
    },
  ],
  row2: [
    {
      type: 'photo',
      id: 'photo-3',
      image: '/assets/images/pages/life/life_1.png',
      alt: 'Engineers building high-impact healthcare technology',
    },
    {
      type: 'photo',
      id: 'photo-4',
      image: '/assets/images/pages/life/life_2.png',
      alt: 'Strategic discussion and team alignment',
    },
    {
      type: 'quote',
      id: 'quote-2',
      quote: 'Every day at Pentasent has been a journey of learning and personal growth.',
      authorName: 'Ankit Kumar',
      authorRole: 'VP of Product',
      authorAvatar: '/assets/images/team/ankit.png',
    },
  ],
  row3: [
    {
      type: 'quote',
      id: 'quote-3',
      quote: 'Every day at Pentasent has been an opportunity for growth and learning.',
      authorName: 'Rakesh Dangi',
      authorRole: 'VP of Marketing',
      authorAvatar: '/assets/images/team/rakesh.png',
    },
    {
      type: 'photo',
      id: 'photo-5',
      image: '/assets/images/pages/life/life_5.png',
      alt: 'Deep dive problem solving and clinical system research',
    },
    {
      type: 'photo',
      id: 'photo-6',
      image: '/assets/images/pages/life/life_6.png',
      alt: 'Team coffee break and community moments',
    },
  ],
  row4: [
    {
      type: 'photo',
      id: 'photo-7',
      image: '/assets/images/pages/life/life_7.png',
      alt: 'Cross-functional workshop and planning',
    },
    {
      type: 'photo',
      id: 'photo-8',
      image: '/assets/images/pages/life/life_8.png',
      alt: 'Team members presenting and celebrating milestones',
    },
    {
      type: 'quote',
      id: 'quote-4',
      quote: 'At Pentasent, I discover something new and valuable each day.',
      authorName: 'Akesh Yadav',
      authorRole: 'VP of Engineering',
      authorAvatar: '/assets/images/team/akesh.png',
    },
  ],
};

export const PENTASENT_LEADERSHIP_DATA: PentasentLeadershipData = {
  badge: 'How We Work',
  title: 'Pentasent in action',
  subtitle:
    'We work close to the problems we are trying to solve, take ownership, and move with purpose. These are the principles that shape how we build, collaborate, and create better healthcare experiences.',

  principles: [
    {
      id: 'principle-1',
      step: '01',
      title: 'Start with real problem',
      description:
        'We begin with people, not assumptions. We spend time understanding patients, healthcare professionals, organizations, and the systems around them. The closer we get to the real problem, the better we can build for it.',
      image: '/assets/images/pages/life/pentasent_action_one.png',
    },

    {
      id: 'principle-2',
      step: '02',
      title: 'Think beyond what exists',
      description:
        'Healthcare has many problems that have existed for too long. We question the way things have always been done, explore new possibilities, and think boldly about what healthcare could become.',
      image: '/assets/images/pages/life/pentasent_action_two.png',
    },

    {
      id: 'principle-3',
      step: '03',
      title: 'Own the outcome',
      description:
        'We take responsibility from problem to outcome. We do not wait for someone else to fix what is in front of us. When something matters, we step in, figure it out, and see it through.',
      image: '/assets/images/pages/life/pentasent_action_three.png',
    },

    {
      id: 'principle-4',
      step: '04',
      title: 'Build together',
      description:
        'Better healthcare is not built by one discipline alone. We bring together people across product, technology, medicine, research, design, and operations, and give each other the space to do our best work.',
      image: '/assets/images/pages/life/pentasent_action_four.png',
    },

    {
      id: 'principle-5',
      step: '05',
      title: 'Challenge with care',
      description:
        'We care more about getting to the right answer than being right ourselves. We question ideas openly, give honest feedback, listen carefully, and challenge each other with respect.',
      image: '/assets/images/pages/life/pentasent_action_five.png',
    },

    {
      id: 'principle-6',
      step: '06',
      title: 'Learn, decide, move',
      description:
        'We do not wait for perfect certainty. We learn from evidence, make thoughtful decisions, act, and improve along the way. Progress comes from turning good thinking into meaningful action.',
      image: '/assets/images/pages/life/pentasent_action_six.png',
    },
  ],
};

export const LIFE_GROWTH_ON_MAP_DATA: LifeGrowthOnMapData = {
  title: 'One mission. Many places.',
  subtitle:
    'Pentasent is growing through the people, ideas, and communities that believe healthcare can work better. From our home base to people and partners across different parts of the world, every place brings a new perspective to what we are building. We celebrate the cultures, backgrounds, and experiences that make Pentasent what it is—and as we grow, there will always be room for more people to join the journey.',
  image: '/assets/images/pages/life/life_on_map.png',
  alt: 'Pentasent team and global community',
};

export const LIFE_CELEBRATIONS_DATA: LifeCelebrationsData = {
  badge: 'Global Celebrations',

  title: 'Different places. Shared moments.',

  subtitle:
    'Pentasent brings together people, cultures, and perspectives from around the world. From everyday moments to big celebrations, we make space to experience, learn from, and celebrate what makes each community unique.',

  cards: [
    {
      id: 'celebration-1',
      image: '/assets/images/pages/life/country_one.png',
      country: 'United Kingdom',
      title: 'London, Together',
      description:
        'A city shaped by different cultures, ideas, and people—much like the community we are building at Pentasent.',
    },

    {
      id: 'celebration-2',
      image: '/assets/images/pages/life/country_two.png',
      country: 'France',
      title: 'Moments in Paris',
      description:
        'Celebrating the people, places, and experiences that remind us to slow down, connect, and enjoy the journey.',
    },

    {
      id: 'celebration-3',
      image: '/assets/images/pages/life/country_three.png',
      country: 'Japan',
      title: 'Finding Wonder in Japan',
      description:
        'A glimpse into a culture where tradition, craft, curiosity, and attention to detail come together.',
    },

    {
      id: 'celebration-4',
      image: '/assets/images/pages/life/country_four.png',
      country: 'Italy',
      title: 'La Dolce Vita',
      description:
        'Celebrating connection, shared experiences, and the simple moments that make working and growing together meaningful.',
    },
  ],
};

export const LIFE_MISSION_WORKLIFE_DATA: LifeMissionWorkLifeData = {
  items: [
    {
      id: 'mission',
      title: 'On a mission',
      description:
        'We are building Pentasent because healthcare can work better. Our mission is to bring people, knowledge, products, and ideas together to make healthcare more connected, accessible, and human. Everyone here contributes to that mission in their own way—from building products and technology to researching problems, supporting communities, and creating better experiences. The work is ambitious, but the reason behind it is simple: build something that matters.',
      image: '/assets/images/pages/life/one_mission.png',
      alt: 'Pentasent team working together on a shared mission',
      imagePosition: 'right',
    },

    {
      id: 'growth',
      title: 'Grow with the journey',
      description:
        'Pentasent is still growing, and so are the people building it. We believe growth comes from doing meaningful work, taking on challenges, learning from mistakes, and staying curious. You will have room to explore new ideas, take ownership, work across disciplines, and develop skills that go beyond your role. As the company evolves, there will always be something new to learn—and new opportunities to grow with it.',
      image: '/assets/images/pages/life/grwo_with_journey.png',
      alt: 'People learning and growing at Pentasent',
      imagePosition: 'left',
    },

    {
      id: 'culture',
      title: 'A culture built around people',
      description:
        'Great work starts with an environment where people feel trusted, respected, and comfortable being themselves. We value openness, thoughtful disagreement, collaboration, and the willingness to help each other. We celebrate progress, share what we learn, and make space for different perspectives. Whether we are working together in the same room or connecting from different parts of the world, we want Pentasent to feel like a place where people can do meaningful work and enjoy the people they do it with.',
      image: '/assets/images/pages/life/culture_and_people.png',
      alt: 'People and culture at Pentasent',
      imagePosition: 'right',
    },
  ],
};

export const LIFE_PRINCIPLES_DATA: LifePrinciplesData = {
  badge: 'OUR PRINCIPLES',
  title: 'What we believe in',
  subtitle:
    'Pentasent is built around a simple belief: healthcare works better when people, knowledge, and ideas can connect. These principles guide how we build, collaborate, and contribute to that future.',

  items: [
    {
      id: 'dream-team',
      icon: 'dream-team',
      title: 'Put people first',
      description:
        'Everything we build starts with people. We listen to patients, healthcare professionals, researchers, and communities, and let their needs and experiences shape what we do.',
    },

    {
      id: 'up-to-speed',
      icon: 'up-to-speed',
      title: 'Connect what matters',
      description:
        'Healthcare is an ecosystem, not a collection of isolated pieces. We bring people, organizations, products, and communities closer together to create meaningful connections.',
    },

    {
      id: 'stealthy-star',
      icon: 'stealthy-star',
      title: 'Build with purpose',
      description:
        'We focus our energy on problems worth solving. We aim to create products, experiences, and ideas that are useful, thoughtful, and capable of making a real difference in healthcare.',
    },

    {
      id: 'cultural-captain',
      icon: 'cultural-captain',
      title: 'Grow together',
      description:
        'The best work happens when different perspectives come together. We learn from each other, challenge ideas, celebrate progress, & help one another become better at what we do.',
    },
  ],
};

export const LIFE_BOTTOM_CTA_DATA: LifeBottomCtaData = {
  title: 'Build what comes next with us.',
  subtitle:
    'We are building more than a healthcare ecosystem. We are building a place where curious people can do meaningful work, grow together, and help shape what healthcare becomes next.',

  primaryButton: {
    text: 'Explore opportunities',
    href: '/company/careers/open-roles',
  },

  secondaryButton: {
    text: 'Discover Pentasent',
    href: '/company/about',
  },

  backgroundImage: '/assets/images/pages/life/life_bottom_banner.png',
};




