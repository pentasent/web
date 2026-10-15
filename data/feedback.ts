import type {
  FeedbackReview,
  FeedbackPhoto,
  FeedbackItem,
  FeedbackSectionData,
} from '@/types/landing';

export type {
  FeedbackReview,
  FeedbackPhoto,
  FeedbackItem,
  FeedbackSectionData,
};

export const USER_FEEDBACK_DATA: FeedbackSectionData = {
  tagline: 'THOSE WHO CHOSE PENTASENT',
  titleBefore: "There's a reason people ",
  titleHighlight: 'love Pentasent',
  titleAfter: '',
  subtitle:
    'Join the multitude of people who have trusted Pentasent to help navigate their health journey, achieving significant, lasting care and wellbeing.',
row1: [
  {
    id: 'photo-1',
    type: 'photo',
    image: '/assets/images/pages/landing/feedback_woman_one.jpg',
    alt: 'Pentasent community member exploring healthcare resources',
  },
  {
    id: 'jacqueline',
    type: 'review',
    author: 'Jacqueline',
    role: 'Pentasent Community Member',
    rating: 5,
    content:
      '“I love having so many parts of healthcare connected in one place. Pentasent makes it easier to discover people, resources, and ideas that are actually relevant to my health journey.”',
    bg: 'bg-[#faf7f4]',
  },
  {
    id: 'diana',
    type: 'review',
    author: 'Diana',
    role: 'Healthcare Explorer',
    rating: 5,
    content:
      '“Pentasent feels different from the usual healthcare platforms. I can explore communities, discover useful tools, learn from healthcare professionals, and keep everything in one connected space.”',
    bg: 'bg-[#faf7f4]',
  },
  {
    id: 'photo-3',
    type: 'photo',
    image: '/assets/images/pages/landing/feedback_man_active.jpg',
    alt: 'Pentasent member exploring health and wellness resources',
  },
  {
    id: 'donna',
    type: 'review',
    author: 'Donna',
    role: 'Health & Wellness Explorer',
    rating: 5,
    content:
      '“There is so much happening across healthcare, but finding the right information can be overwhelming. Pentasent gives me one place to discover tools, products, communities, and resources without jumping between different platforms.”',
    bg: 'bg-[#faf7f4]',
  },
  {
    id: 'michael',
    type: 'review',
    author: 'Michael R.',
    role: 'Healthcare Community Member',
    rating: 5,
    content:
      '“What stood out to me about Pentasent is how connected everything feels. People, organizations, products, events, and research all have a place, making healthcare feel much easier to explore.”',
    bg: 'bg-[#faf7f4]',
  },
],

row2: [
  {
    id: 'photo-2',
    type: 'photo',
    image: '/assets/images/pages/landing/feedback_woman_two.jpg',
    alt: 'Pentasent member discovering wellness resources',
  },
  {
    id: 'sarah',
    type: 'review',
    author: 'Sarah M.',
    role: 'Wellness Explorer',
    rating: 5,
    content:
      '“I came to Pentasent looking for simple health and wellness tools, but ended up discovering communities, challenges, and resources I would never have found on my own.”',
    bg: 'bg-[#f4efe9]',
  },
  {
    id: 'alexandra',
    type: 'review',
    author: 'Alexandra',
    role: 'Pentasent Member',
    rating: 5,
    content:
      '“I like that Pentasent is not just another place to read about healthcare. It brings discovery, people, organizations, tools, and opportunities together in a way that feels genuinely useful.”',
    bg: 'bg-[#f4efe9]',
  },
  {
    id: 'photo-4',
    type: 'photo',
    image: '/assets/images/pages/landing/feedback_man_mature.jpg',
    alt: 'Pentasent member exploring healthcare and wellness',
  },
  {
    id: 'greg',
    type: 'review',
    author: 'Greg',
    role: 'Healthcare Explorer',
    rating: 5,
    content:
      '“Healthcare can feel fragmented when everything lives somewhere different. Pentasent brings the pieces together and gives you a much simpler way to explore what is out there.”',
    bg: 'bg-[#f4efe9]',
  },
  {
    id: 'elena',
    type: 'review',
    author: 'Elena K.',
    role: 'Community Member',
    rating: 5,
    content:
      '“I enjoy discovering new people, communities, events, and health resources through Pentasent. It feels like a growing ecosystem rather than just another healthcare website.”',
    bg: 'bg-[#f4efe9]',
  },
],
};
