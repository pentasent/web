"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/database";
import { Search } from "lucide-react";
import { ArticlesPageShimmer, GridArticleCardShimmer } from "@/components/shimmer/ArticleShimmer";

/* ================= TYPES ================= */

type ArticleWithDetails = Article & {
  tags: { name: string; slug: string }[];
};

const PAGE_SIZE = 20;

/* ================= PAGE ================= */

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchArticles = useCallback(async (pageNum: number, query: string, append: boolean = true) => {
    setLoading(true);
    try {
      // Basic fetch focusing on articles. We'll try to get tags via the mapping table.
      // If the join fails, it usually returns an error we catch below.
      let queryBuilder = supabase
        .from('articles')
        .select(`
          *,
          article_tag_map(
            article_tags(name, slug)
          )
        `)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Supabase Error:", error.message);
        // Fallback: If the tag join failed, try fetching just articles
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })
          .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
        
        if (fallbackError) throw fallbackError;
        
        const formatted = (fallbackData || []).map((art: any) => ({
          ...art,
          tags: []
        })) as ArticleWithDetails[];
        
        if (append) {
          setArticles((prev) => [...prev, ...formatted]);
        } else {
          setArticles(formatted);
        }
        setHasMore(formatted.length === PAGE_SIZE);
        return;
      }

      const formattedArticles = (data || []).map((article: any) => ({
        ...article,
        tags: article.article_tag_map?.map((m: any) => m.article_tags).filter(Boolean) || []
      })) as ArticleWithDetails[];

      if (append) {
        setArticles((prev) => [...prev, ...formattedArticles]);
      } else {
        setArticles(formattedArticles);
      }

      setHasMore(formattedArticles.length === PAGE_SIZE);
    } catch (err) {
      console.error("Critical Fetch Error:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Initial fetch and search reset
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchArticles(0, searchQuery, false);
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, fetchArticles]);

  // Load more
  useEffect(() => {
    if (page > 0) {
      fetchArticles(page, searchQuery, true);
    }
  }, [page, searchQuery, fetchArticles]);

  /* ================= DATA SPLIT ================= */
  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);
  const largeArticle = articles[4];
  const moreArticles = articles.slice(5);

  return (
    <div className="bg-gradient-to-b from-pink-50 via-pink-50/50 to-white text-gray-700 min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-t from-pink-50 via-pink-50/50 to-white pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
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
          </div>
            <div className="w-full md:w-[540px] relative group py-10">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-warm-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full bg-white/80 backdrop-blur-sm border border-warm-300/50 rounded-2xl py-4 px-8 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-warm-300/50 focus:border-warm-300 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>
      </section>

      {initialLoading ? (
        <ArticlesPageShimmer />
      ) : articles.length > 0 ? (
        <>
          {/* FEATURED */}
          <section>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
              <h2 className="text-2xl font-medium text-[#3c2a34] mb-8">
                {searchQuery ? `Search results for "${searchQuery}"` : "Featured blog posts"}
              </h2>

              <div className="grid lg:grid-cols-2 gap-10">

                {/* FEATURED ARTICLE */}
                {featured && (
                  <Link href={`/articles/${featured.slug}`} className="group space-y-6">
                    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-md bg-gray-100">
                      <Image
                        src={featured.banner_image || ""}
                        alt={featured.title}
                        fill
                        priority
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        {featured.tags?.[0] && (
                          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                            {featured.tags[0].name}
                          </span>
                        )}
                        <span>{featured.reading_time || 0} min read</span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium text-[#3c2a34] mb-3">
                        {featured.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-2">{featured.description}</p>
                    </div>
                  </Link>
                )}

                {/* SIDE ARTICLES */}
                <div className="lg:space-y-10">
                  {sideArticles.map((article, i) => (
                    <HorizontalMiniCard key={article.id || i} article={article} />
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* LARGE ARTICLE */}
          {largeArticle && (
            <section className="lg:py-16 py-12">
              <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
                <BlogHorizontalCard article={largeArticle} />
              </div>
            </section>
          )}

          {/* MORE ARTICLES */}
          <section className="pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">

              <h2 className="text-2xl font-medium text-[#3c2a34] mb-10">
                More articles for you
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {moreArticles.map((article, i) => (
                  <GridArticleCard key={article.id || i} article={article} />
                ))}
              </div>

              {/* LOADING STATE & OBSERVER */}
              <div ref={lastArticleElementRef} className="mt-12 text-center">
                {loading && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    {[1, 2, 3, 4].map((i) => (
                      <GridArticleCardShimmer key={i} />
                    ))}
                  </div>
                )}
                {!hasMore && articles.length > 5 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-[1px] bg-pink-100 mx-auto opacity-50" />
                    <p className="text-gray-500 font-medium italic">Reached the end.</p>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                      Stay updated! We keep adding latest articles for you.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </section>
        </>
      ) : (
        <div className="py-32 text-center space-y-4">
          <div className="w-16 h-[1px] bg-pink-200 mx-auto opacity-50" />
          <p className="text-xl text-[#3c2a34] font-light">
            {searchQuery 
              ? `No articles found matching "${searchQuery}"` 
              : "We're preparing something special for you."}
          </p>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or stay tuned for new updates." 
              : "Check back soon for latest insights and stories."}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ================= SIDE CARD ================= */

function HorizontalMiniCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="flex gap-6 items-start group flex-wrap lg:flex-nowrap">

      <div className="relative lg:w-[160px] lg:h-[140px] w-full h-[200px] md:h-[320px] rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-100">
        <Image
          src={article.banner_image || ""}
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
        </div>

      </div>
    </Link>
  );
}

/* ================= LARGE CARD ================= */

function BlogHorizontalCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="bg-white rounded-3xl hover:shadow-sm transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">

        <div className="relative w-full md:w-[340px] h-[170px] rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={article.banner_image || ""}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width:768px) 100vw, 340px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
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

function GridArticleCard({ article }: { article: ArticleWithDetails }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">

      <div className="space-y-4">

        <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={article.banner_image || ""}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            {article.tags?.[0] && (
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                {article.tags[0].name}
              </span>
            )}
            <span>{article.reading_time || 0} min read</span>
          </div>

          <h4 className="text-lg font-medium text-[#3c2a34] leading-snug line-clamp-2">
            {article.title}
          </h4>

        </div>

      </div>

    </Link>
  );
}