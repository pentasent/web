"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import Link from "next/link";

/* ================= ARTICLE DATA ================= */

const articles = [
  {
    title: "Why Your Mind Won’t Stop Thinking at Night (And 7 Ways to Fix It)",
    subtitle:
      "Your brain has a hard time switching off at night. Here’s how to quiet the noise and drift off peacefully.",
    slug: "why-your-mind-wont-stop-thinking-at-night",
    read_time: "6 min read",
    banner_url:
      "/images/articles/1.svg",
    tag: "Mind",
  },
  {
    title: "The 4-7-8 Breathing Technique: The Fastest Way to Calm Your Mind",
    subtitle:
      "A simple breathing exercise that can help you fall asleep in under 60 seconds.",
    slug: "4-7-8-breathing-technique",
    read_time: "5 min read",
    banner_url:
      "/images/articles/2.svg",
    tag: "Meditation",
  },
  {
    title: "How to Fall Asleep in 5 Minutes: Science-Backed Methods That Work",
    subtitle:
      "Tried everything? These science-backed techniques can help you fall asleep faster than you ever thought possible.",
    slug: "fall-asleep-fast-science",
    read_time: "5 min read",
    banner_url:
      "/images/articles/4.svg",
    tag: "Sleep",
  },
  {
    title: "Why Meditation Feels Hard at First (And How to Make It Effortless)",
    subtitle:
      "If meditation feels frustrating, you’re not alone. Learn how to make the practice natural and calming.",
    slug: "why-meditation-feels-hard",
    read_time: "7 min read",
    banner_url:
      "/images/articles/3.svg",
    tag: "Meditation",
  },
  {
    title: "The Hidden Connection Between Anxiety and Poor Sleep",
    subtitle:
      "Understanding the anxiety-sleep cycle and how to break it gently.",
    slug: "anxiety-and-sleep-connection",
    read_time: "6 min read",
    banner_url:
      "/images/articles/5.svg",
    tag: "Mind",
  },
  {
    title: "Morning Yoga for Mental Clarity",
    subtitle: "Simple morning yoga flows that reset your nervous system.",
    slug: "morning-yoga-clarity",
    read_time: "4 min read",
    banner_url:
      "/images/articles/6.svg",
    tag: "Yoga",
  },
  {
    title: "The Science of Deep Sleep",
    subtitle:
      "Why deep sleep matters more than you think and how to get more of it.",
    slug: "science-of-deep-sleep",
    read_time: "6 min read",
    banner_url:
      "/images/articles/7.svg",
    tag: "Sleep",
  },
  {
    title: "5 Minute Evening Ritual to Reset Your Mind",
    subtitle: "A calming evening ritual to reduce stress before bed.",
    slug: "evening-ritual-reset-mind",
    read_time: "5 min read",
    banner_url:
      "/images/articles/8.svg",
    tag: "Mind",
  },
  {
    title: "Breathwork for Instant Calm",
    subtitle:
      "Use breathwork to regulate your nervous system within minutes.",
    slug: "breathwork-instant-calm",
    read_time: "4 min read",
    banner_url:
      "/images/articles/9.svg",
    tag: "Meditation",
  },
];

/* ================= DATA SPLIT ================= */

const featured = articles[0];
const sideArticles = articles.slice(1, 4);
const largeArticle = articles[4];
const moreArticles = articles.slice(5, 9);

/* ================= PAGE ================= */

export default function ArticlesPage() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-pink-50/50 to-white text-gray-700">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-t from-pink-50 via-pink-50/50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6 max-w-4xl">
            Resources to guide,
            <br />
            ground, and grow with you
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Explore articles, expert insights, personal stories, and tools
            to help you understand your mind, sleep better, and navigate
            life with calm clarity.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section>
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="text-2xl font-medium text-[#3c2a34] mb-8">
            Featured blog posts
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* FEATURED ARTICLE */}
            <Link href="#" className="group space-y-6">
              <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-md">
                <Image
                  src={featured.banner_url}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                    {featured.tag}
                  </span>
                  <span>{featured.read_time}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-3">
                  {featured.title}
                </h3>

                <p className="text-gray-600">{featured.subtitle}</p>
              </div>
            </Link>

            {/* SIDE ARTICLES */}
            <div className="lg:space-y-10">
              {sideArticles.map((article, i) => (
                <HorizontalMiniCard key={i} article={article} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* LARGE ARTICLE */}
      <section className="lg:py-16 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <BlogHorizontalCard article={largeArticle} />
        </div>
      </section>

      {/* MORE ARTICLES */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">

          <h2 className="text-2xl font-medium text-[#3c2a34] mb-10">
            More articles for you
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {moreArticles.map((article, i) => (
              <GridArticleCard key={i} article={article} />
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================= SIDE CARD ================= */

function HorizontalMiniCard({ article }: any) {
  return (
    <Link href="#" className="flex gap-6 items-start group flex-wrap lg:flex-nowrap">

      <div className="relative lg:w-[160px] lg:h-[140px] w-full h-[200px] md:h-[320px] rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
        <Image
          src={article.banner_url}
          alt={article.title}
          fill
          loading="lazy"
          sizes="160px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col justify-between h-[140px]">

        <div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
              {article.tag}
            </span>
            <span>{article.read_time}</span>
          </div>

          <h4 className="text-lg md:text-xl font-medium text-[#3c2a34] leading-snug">
            {article.title}
          </h4>
        </div>

      </div>
    </Link>
  );
}

/* ================= LARGE CARD ================= */

function BlogHorizontalCard({ article }: any) {
  return (
    <Link href="#" className="group block">
      <div className="bg-white rounded-3xl hover:shadow-sm transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">

        <div className="relative w-full md:w-[340px] h-[170px] rounded-2xl overflow-hidden flex-shrink-0">
          <Image
            src={article.banner_url}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width:768px) 100vw, 340px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1">

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
              {article.tag}
            </span>
            <span>{article.read_time}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-4">
            {article.title}
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {article.subtitle}
          </p>

        </div>

      </div>
    </Link>
  );
}

/* ================= GRID CARD ================= */

function GridArticleCard({ article }: any) {
  return (
    <Link href="#" className="group block">

      <div className="space-y-4">

        <div className="relative w-full h-[180px] rounded-2xl overflow-hidden">
          <Image
            src={article.banner_url}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
              {article.tag}
            </span>
            <span>{article.read_time}</span>
          </div>

          <h4 className="text-lg font-medium text-[#3c2a34] leading-snug">
            {article.title}
          </h4>

        </div>

      </div>

    </Link>
  );
}

// "use client";

// import Footer from "@/components/layout/footer";
// import Navbar from "@/components/layout/navbar";
// import Image from "next/image";
// import Link from "next/link";

// export default function articlesPage() {
//     return (
//         <div className="bg-gradient-to-b from-pink-50 via-pink-50/50 to-white text-gray-700">
//             <Navbar />
//             {/* ================= HERO ================= */}
//             <section className="bg-gradient-to-t from-pink-50 via-pink-50/50 to-white py-20 lg:py-28">
//             {/* <section className="bg-gradient-to-t from-pink-50 via-pink-50/50 to-white py-20 lg:py-28"> */}
//                 <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
//                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6 max-w-4xl">
//                         Resources to guide,
//                         <br />
//                         ground, and grow with you
//                     </h1>

//                     <p className="text-base md:text-lg text-gray-600 max-w-2xl">
//                         Explore articles, expert insights, personal stories, and tools
//                         to help you understand your body, support your mind, and navigate
//                         change with confidence.
//                     </p>
//                 </div>
//             </section>

//             {/* ================= FEATURED SECTION ================= */}
//             <section className="">
//                 <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">

//                     <h2 className="text-2xl font-medium text-[#3c2a34] mb-8">
//                         Featured blog posts
//                     </h2>

//                     <div className="grid lg:grid-cols-2 gap-10">

//                         {/* Large Left Post */}
//                         <div className="space-y-6">
//                             <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-md">
//                                 <Image
//                                     src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg"
//                                     alt="Blog"
//                                     fill
//                                     className="object-cover"
//                                 />
//                             </div>

//                             <div>
//                                 <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
//                                     <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
//                                         Sleep
//                                     </span>
//                                     <span>5 min read</span>
//                                 </div>

//                                 <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-3">
//                                     Why You Wake Up at 3AM (and What to Do)
//                                 </h3>

//                                 <p className="text-gray-600">
//                                     Understanding nighttime wake-ups and how subtle rituals
//                                     can restore your natural rhythm.
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Right Side Posts */}
//                         <div className="space-y-10">

//                             <HorizontalMiniCard
//                                 image="https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg"
//                                 category="Nutrition"
//                                 title="Fasting, Fueling & Food Freedom"
//                                 authorImage="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
//                                 authorName="Simone Johanson"
//                                 date="11 Jan 2022"
//                             />

//                             <HorizontalMiniCard
//                                 image="https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg"
//                                 category="Sleep"
//                                 title="From Fog to Focus: Managing Mood Changes"
//                                 authorImage="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
//                                 authorName="Simone Johanson"
//                                 date="11 Jan 2022"
//                             />

//                         </div>

//                     </div>
//                 </div>
//             </section>

//             {/* ================= BLOG LIST SECTION ================= */}
//             <section className="py-16">
//                 <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 space-y-12">

//                     <BlogHorizontalCard
//                         image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"
//                         category="Mind"
//                         title="The Power of Stillness in a Noisy World"
//                         description="In a world of constant notifications, expectations, and noise, stillness becomes a radical act of self-care. Learn how grounding rituals, breathwork, and intentional pauses can restore emotional clarity, reduce stress, and reconnect you with your inner rhythm."
//                         authorImage="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
//                         authorName="Simone Johanson"
//                         date="11 Jan 2022"
//                     />

//                 </div>
//             </section>
// <Footer />
//         </div>
//     );
// }

// /* ================= MINI SIDE CARD ================= */

// function HorizontalMiniCard({
//     image,
//     category,
//     title,
//     authorImage,
//     authorName,
//     date,
// }: {
//     image: string;
//     category: string;
//     title: string;
//     authorImage: string;
//     authorName: string;
//     date: string;
// }) {
//     return (
//         <div className="flex gap-6 items-start">

//             {/* Image */}
//             <div className="relative w-[160px] h-[140px] rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
//                 <Image src={image} alt={title} fill className="object-cover" />
//             </div>

//             {/* Content */}
//             <div className="flex flex-col justify-between h-[140px]">

//                 {/* Top Meta */}
//                 <div>
//                     <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
//                         <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
//                             {category}
//                         </span>
//                         <span>5 min read</span>
//                     </div>

//                     <h4 className="text-lg md:text-xl font-medium text-[#3c2a34] leading-snug">
//                         {title}
//                     </h4>
//                 </div>

//                 {/* Author Row */}
//                 <div className="flex items-center gap-3 mt-4">
//                     <div className="relative w-9 h-9 rounded-full overflow-hidden">
//                         <Image src={authorImage} alt={authorName} fill className="object-cover" />
//                     </div>

//                     <div className="text-sm text-gray-600">
//                         <p className="font-medium text-[#3c2a34] leading-none">
//                             {authorName}
//                         </p>
//                         <p className="text-gray-500 text-xs">
//                             {date} · 5 min read
//                         </p>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

// /* ================= FULL WIDTH BLOG CARD ================= */

// function BlogHorizontalCard({
//     image,
//     category,
//     title,
//     description,
//     authorImage,
//     authorName,
//     date,
// }: {
//     image: string;
//     category: string;
//     title: string;
//     description: string;
//     authorImage: string;
//     authorName: string;
//     date: string;
// }) {
//     return (
//         <Link href="#" className="group block">
//             <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">

//                 {/* Image */}
//                 <div className="relative w-full md:w-[340px] h-[240px] rounded-2xl overflow-hidden flex-shrink-0">
//                     <Image
//                         src={image}
//                         alt={title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 flex flex-col justify-between">

//                     <div>
//                         {/* Category + Read Time */}
//                         <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
//                             <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
//                                 {category}
//                             </span>
//                             <span>5 min read</span>
//                         </div>

//                         {/* Title */}
//                         <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-4 leading-snug">
//                             {title}
//                         </h3>

//                         {/* Description */}
//                         <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
//                             {description}
//                         </p>
//                     </div>

//                     {/* Author Row */}
//                     <div className="flex items-center gap-3">
//                         <div className="relative w-10 h-10 rounded-full overflow-hidden">
//                             <Image
//                                 src={authorImage}
//                                 alt={authorName}
//                                 fill
//                                 className="object-cover"
//                             />
//                         </div>

//                         <div className="text-sm text-gray-600">
//                             <p className="font-medium text-[#3c2a34] leading-none">
//                                 {authorName}
//                             </p>
//                             <p className="text-gray-500 text-xs">
//                                 {date} · 5 min read
//                             </p>
//                         </div>
//                     </div>

//                 </div>

//             </div>
//         </Link>
//     );
// }