"use client";

import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { Article } from "@/types/database";
import { SmartImage } from "../ui/SmartImage";

/* ================= TYPES ================= */

export type ArticleWithDetails = Article & {
  tags: { name: string; slug: string }[];
};

/* ================= SIDE CARD ================= */

export function HorizontalMiniCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="flex gap-6 items-start group flex-wrap lg:flex-nowrap">
      <div className="relative lg:w-[160px] lg:h-[140px] w-full h-[200px] md:h-[320px] rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-100 flex items-center justify-center">
        <ImageIcon className="text-gray-300 absolute" size={24} />
        <SmartImage
          src={article.banner_image || ""}
          alt={article.title}
          className="object-cover relative z-10"
          priority
        />
        {/* <Image
          src={article.banner_image || ""}
          alt={article.title}
          fill
          loading="lazy"
          sizes="160px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
        /> */}
      </div>

      <div className="flex flex-col justify-between h-[140px]">
        <div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            {article.tags?.[0] && (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                {article.tags[0].name}
              </span>
            )}
            <span>{article.reading_time || 0} min read</span>
          </div>

          <h4 className="text-lg md:text-xl font-medium text-[#3c2a34] leading-snug line-clamp-2">
            {article.title}
          </h4>
          <p className="text-gray-600 leading-relaxed line-clamp-1 mt-1">
            {article.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ================= LARGE CARD ================= */

export function BlogHorizontalCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="bg-white rounded-3xl hover:shadow-sm transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-full md:w-[340px] h-[170px] rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="text-gray-300 absolute" size={32} />
          <SmartImage
          src={article.banner_image || ""}
          alt={article.title}
          className="object-cover relative z-10"
          priority
        />
          {/* <Image
            src={article.banner_image || ""}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width:768px) 100vw, 340px"
            className="object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
          /> */}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            {article.tags?.[0] && (
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
                {article.tags[0].name}
              </span>
            )}
            <span>{article.reading_time || 0} min read</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-4">
            {article.title}
          </h3>

          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {article.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ================= GRID CARD ================= */

export function GridArticleCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="space-y-4">
        <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-pink-50">
          <ImageIcon className="text-gray-300 absolute" size={32} />
          {article.banner_image && (
            <SmartImage
              src={article.banner_image || ""}
              alt={article.title}
              className="object-cover relative z-10"
              priority
            />
            // <Image
            //   src={article.banner_image}
            //   alt={article.title}
            //   fill
            //   loading="lazy"
            //   sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
            //   className="object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
            // />
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            {article.tags?.[0] && (
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
                {article.tags[0].name}
              </span>
            )}
            <span>{article.reading_time || 0} min read</span>
          </div>

          <h4 className="text-lg font-medium text-[#3c2a34] leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
            {article.title}
          </h4>
        </div>
      </div>
    </Link>
  );
}
