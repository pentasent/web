"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Article, ArticleBlock, ArticleTag, User, ArticleComment } from "@/types/database";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArticleDetailShimmer } from "@/components/shimmer/ArticleDetailShimmer";
import { SmartImage } from "@/components/ui/SmartImage";
import { getImageUrl } from "@/lib/get-image-url";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  User as UserIcon,
  Loader2,
  Image as ImageIcon,
  Clock,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ArrowUpRight,
  Lock,
  Reply
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { LoginRequiredPopup } from "@/components/auth/LoginRequiredPopup";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */

type ArticleFull = Article & {
  author: User | null;
  tags: ArticleTag[];
  blocks: any[];
  user_has_liked?: boolean;
};

/* ================= PAGE ================= */

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [article, setArticle] = useState<ArticleFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<ArticleTag[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [newsEmail, setNewsEmail] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);

  const viewLoggedRef = useRef<boolean>(false);

  const fetchArticle = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data: art, error: artErr } = await supabase
        .from('articles')
        .select(`
          *,
          article_tag_map(
            article_tags(*)
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (artErr) throw artErr;
      if (!art) {
        setArticle(null);
        setLoading(false);
        return;
      }

      if (!viewLoggedRef.current) {
        viewLoggedRef.current = true;
        (async () => {
          try {
            await supabase.from('article_views').insert({
              article_id: art.id,
              user_id: user?.id || null,
              ip_hash: 'anonymous'
            });
            await supabase.rpc('increment_article_view', { art_id: art.id });
          } catch (e) { }
        })();
      }

      let hasLiked = false;
      if (user) {
        const { data: like } = await supabase.from('article_likes').select('id').eq('article_id', art.id).eq('user_id', user.id).maybeSingle();
        hasLiked = !!like;
      }

      let authorData = null;
      if (art.author_id) {
        const { data: author } = await supabase.from('users').select('*').eq('id', art.author_id).maybeSingle();
        authorData = author;
      }

      // Get blocks from article_data JSON
      const processedBlocks = (art.article_data?.blocks || []).map((block: any, index: number) => {
        return {
          id: index,            // temporary id for React key
          type: block.type,
          content: block
        };
      });

      const formattedArticle = {
        ...art,
        author: authorData,
        tags: art.article_tag_map?.map((m: any) => m.article_tags).filter(Boolean) || [],
        blocks: processedBlocks,
        user_has_liked: hasLiked
      } as ArticleFull;

      setArticle(formattedArticle);

      const { data: tags } = await supabase.from('article_tags').select('*').limit(15);
      setAllTags(tags || []);

      if (formattedArticle.tags?.[0]) {
        const { data: related } = await supabase
          .from('articles')
          .select(`*, article_tag_map!inner(tag:article_tags!inner(*))`)
          .neq('id', art.id)
          .eq('article_tag_map.tag_id', formattedArticle.tags[0].id)
          .limit(3);
        setRelatedArticles(related || []);
      }
    } catch (err) {
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleLike = async () => {
    if (!user) { setShowLoginPopup(true); return; }
    if (!article || isLiking) return;
    setIsLiking(true);
    try {
      if (article.user_has_liked) {
        await supabase.from('article_likes').delete().eq('article_id', article.id).eq('user_id', user.id);
        setArticle(prev => prev ? { ...prev, user_has_liked: false, like_count: Math.max(0, (prev.like_count || 0) - 1) } : null);
      } else {
        await supabase.from('article_likes').insert({ article_id: article.id, user_id: user.id });
        setArticle(prev => prev ? { ...prev, user_has_liked: true, like_count: (prev.like_count || 0) + 1 } : null);
        toast({ title: "Success", description: "Added to favorites" });
      }
    } catch (err) { } finally { setIsLiking(false); }
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsEmail.trim()) {
      toast({ title: "Email required", description: "Please enter your email", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setNewsLoading(true);
    try {
      const { data: existing } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', newsEmail.trim())
        .maybeSingle();

      if (existing) {
        toast({ title: "Already subscribed", description: "You are already on our list!", variant: "destructive" });
        setNewsLoading(false);
        return;
      }

      const { error } = await supabase.from('newsletter').insert({
        email: newsEmail.trim(),
        source: 'article-sidebar',
        status: 'subscribed',
        user_id: user?.id || null
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: "Already subscribed", description: "You are already on our list!", variant: "destructive" });
        } else throw error;
      } else {
        toast({ title: "Success!", description: "Thank you for subscribing to our newsletter." });
        setNewsEmail("");
      }
    } catch (err) {
      toast({ title: "Error", description: "Subscription failed. Please try again.", variant: "destructive" });
    } finally {
      setNewsLoading(false);
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "Check out this article on Pentasent";

    if (platform === 'copy' || platform === 'instagram') {
      try {
        navigator.clipboard.writeText(url);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
        if (platform === 'instagram') {
          window.open('https://www.instagram.com/', '_blank');
        }
      } catch (e) {
        toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
      }
      return;
    }

    const shareLinks: any = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !commentText.trim() || isSubmitting || !article) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('article_comments').insert({ article_id: article.id, user_id: user.id, content: commentText.trim() });
      if (error) throw error;

      // Also increment article comment count
      await supabase.rpc('increment_article_comment', { art_id: article.id });

      setArticle(prev => prev ? { ...prev, comment_count: (prev.comment_count || 0) + 1 } : null);
      setCommentText("");
      window.dispatchEvent(new CustomEvent('refresh-comments'));
      toast({ title: "Success", description: "Response posted" });
    } catch (err) { } finally { setIsSubmitting(false); }
  };

  if (loading) return <ArticleDetailShimmer />;
  if (!article) return <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-[#0f0a12] via-[#1a0f1f] to-black overflow-hidden">

    {/* 🌌 Background Glow */}
    <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[140px]" />
    <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[140px]" />

    {/* 🧬 DNA-style gradient lines */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,0,150,0.2),transparent_40%)]" />

    {/* ✨ Floating particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>

    {/* 🧘 Content */}
    <div className="relative z-10 text-center px-6">

      <h1 className="text-6xl font-semibold text-white mb-6 tracking-tight">
        Lost in Space
      </h1>

      <p className="text-pink-100/70 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        This article seems to have drifted into the cosmic void.
        Let’s guide you back to something meaningful.
      </p>

      <Link
        href="/articles"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a0f1f] rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
      >
        Explore Articles →
      </Link>
    </div>
  </div>

  return (
    <div className="relative bg-gradient-to-b from-pink-50 via-pink-50/50 to-white overflow-hidden text-gray-700 min-h-screen italic-none">

      <Navbar />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-white rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl relative mx-auto px-6 xl:px-20 py-12 lg:py-20">

        <div className="flex flex-col lg:flex-row gap-16">

          <div className="flex-1 max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
              <Link href="/" className="hover:text-[#3c2a34] transition-colors">Home</Link>
              <span>•</span>
              <Link href="/articles" className="hover:text-[#3c2a34] transition-colors">Articles</Link>
              {article.tags?.[0] && (
                <>
                  <span>•</span>
                  <span className="text-[#3c2a34]">{article.tags[0].name}</span>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#3c2a34] leading-[1.15] mb-10 tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full ring-1 ring-pink-100/50">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative bg-gray-100">
                    {article.author?.avatar_url ? (
                      <SmartImage
                        src={article.author.avatar_url}
                        alt="Author"
                        className="object-cover"
                        fallbackIconSize={12}
                      />
                    ) : (
                      <UserIcon size={12} className="m-1" />
                    )}
                  </div>
                  <span className="text-[#3c2a34]">{article.author?.name || "Author"}</span>
                </div>

                {article.tags?.[0] && (
                  <span className="bg-pink-50 text-[#3c2a34]/80 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#3c2a34]/20">
                    {article.tags[0].name}
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-[#3c2a34]" />
                  <span>{article.reading_time || 0} min read</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-[#3c2a34]" />
                  <span>{article.published_at ? format(new Date(article.published_at), 'dd MMM yyyy') : "Recently"}</span>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>{article.view_count || 0} Views</span>
                </div>
              </div>

              <button
                onClick={handleLike}
                className={`p-3 rounded-full shadow-sm ring-1 transition-all ${article.user_has_liked ? 'bg-[#3c2a34] text-white ring-[#3c2a34]' : 'bg-white text-gray-400 ring-pink-100/50 hover:bg-pink-50'}`}
              >
                <Heart size={16} className={article.user_has_liked ? 'fill-current' : ''} />
              </button>
            </div>

            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-16 shadow-sm bg-gray-50 flex items-center justify-center border border-pink-100/30">
              <ImageIcon size={64} className="absolute text-pink-100/40" />
              {article.banner_image && (
                <SmartImage
                  src={article.banner_image}
                  alt={article.title}
                  className="object-cover relative z-10"
                  priority
                />
              )}
            </div>

            <div className="space-y-6">
              {article.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>

            <section className="mt-20 p-10 rounded-2xl bg-white border border-pink-100/50 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-sm">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
  {article.author?.avatar_url ? (
    <SmartImage
      src={article.author.avatar_url}
      alt="Author"
      className="object-cover"
      fallbackIconSize={40}
    />
  ) : (
    <UserIcon size={32} className="text-gray-300" />
  )}
</div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-semibold text-[#3c2a34] mb-2">{article.author?.name || "Author"}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{article.author?.bio || "Expert contributor at Pentasent."}</p>
              </div>
            </section>

            <section className="mt-24 pt-16 border-t border-[#3c2a34]/10" id="comments">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-semibold text-[#3c2a34]">Join the discussion ({article.comment_count || 0})</h3>
              </div>

              {user ? (
                <div className="relative mb-16 group">
                  <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Type your comment..." className="w-full p-6 bg-white border border-pink-100 rounded-3xl min-h-[120px] focus:ring-1 focus:ring-[#3c2a34] outline-none transition-all resize-none text-base text-[#3c2a34] placeholder:text-gray-300 shadow-sm" />
                  <button onClick={handleSubmitComment} disabled={!commentText.trim() || isSubmitting} className="absolute bottom-4 right-4 bg-[#3c2a34] text-white px-8 py-2.5 rounded-full hover:opacity-90 disabled:opacity-40 transition-all font-semibold shadow-md active:scale-95">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post response"}</button>
                </div>
              ) : (
                <div onClick={() => setShowLoginPopup(true)} className="p-12 border-2 border-dashed border-pink-200 rounded-3xl text-center cursor-pointer hover:bg-white transition-all mb-16 group">
                  <p className="text-gray-400 font-medium italic group-hover:text-[#3c2a34]">Sign in to leave a response</p>
                </div>
              )}

              <CommentList articleId={article.id} onLoginRequest={() => setShowLoginPopup(true)} />
            </section>
          </div>

          <aside className="w-full lg:w-[380px] space-y-12">

            <div className="bg-white/60 p-8 rounded-2xl border border-pink-100/50">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Share on Social Media</h4>
              <div className="flex items-center gap-5">
                {[
                  { id: 'instagram', icon: <Instagram size={20} /> },
                  { id: 'twitter', icon: <Twitter size={20} /> },
                  { id: 'facebook', icon: <Facebook size={20} /> },
                  { id: 'linkedin', icon: <Linkedin size={20} /> },
                  { id: 'copy', icon: <Share2 size={20} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => shareOnSocial(item.id)}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-pink-50/50 text-gray-500 hover:bg-[#3c2a34] hover:text-white transition-all duration-300 shadow-sm border border-white"
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/60 p-8 rounded-2xl border border-pink-100/50">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">All Tags</h4>
              <div className="flex flex-wrap gap-3">
                {allTags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/articles?tag=${tag.slug}`}
                    className="px-5 py-2.5 bg-pink-50/30 text-gray-700 text-sm font-medium rounded-full border border-pink-100/50 hover:bg-white hover:border-[#3c2a34] hover:text-[#3c2a34] transition-all"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/60 p-8 rounded-2xl border border-pink-100/50">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Related Blogs</h4>
              <div className="space-y-10">
                {relatedArticles.map((rel) => (
                  <Link href={`/articles/${rel.slug}`} key={rel.id} className="group flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-sm border border-pink-50">
                      {rel.banner_image ? (
                        <SmartImage
                          src={rel.banner_image}
                          alt="Banner"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <ImageIcon className="m-6 text-pink-100" size={32} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <Calendar size={12} className="text-pink-300" />
                        {rel.published_at ? format(new Date(rel.published_at), 'dd MMM yyyy') : "2026"}
                      </div>
                      <h5 className="text-sm font-semibold text-[#3c2a34] leading-snug line-clamp-2 decoration-pink-300 group-hover:underline underline-offset-4 decoration-2">
                        {rel.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#3c2a34] p-10 rounded-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative z-10">
                <h4 className="text-2xl font-semibold mb-3">Join Our Newsletter</h4>
                <p className="text-pink-100/70 text-sm mb-8 leading-relaxed">Stay updated with the latest wellness insights from our experts.</p>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-medium"
                    disabled={newsLoading}
                  />
                  <button
                    onClick={handleNewsletterSubscribe}
                    disabled={newsLoading}
                    className="w-full bg-white text-[#3c2a34] font-bold py-4 rounded-2xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                  >
                    {newsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe Now"}
                    {!newsLoading && <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      <Footer />
      <LoginRequiredPopup isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </div>
  );
}

/* ================= COMPONENT: RENDERER ================= */

function BlockRenderer({ block }: { block: any }) {
  const { content } = block; if (!content) return null;
  switch (block.type) {
    case 'heading':
      const level = content.level || 2;
      return level === 2 ? <h2 className="text-2xl md:text-3xl font-semibold text-[#3c2a34] pt-8 mb-2 tracking-tight">{content.text}</h2> : <h3 className="text-xl md:text-2xl font-semibold text-[#3c2a34] pt-4 mb-2 tracking-tight">{content.text}</h3>;
    case 'paragraph': return <p className="text-gray-600 leading-relaxed text-base mb-2 antialiased">{content.text}</p>;
    case 'image': return (
      <figure className="my-8 space-y-3">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/50 border border-pink-100/30 flex items-center justify-center shadow-sm ring-1 ring-black/5">
          <ImageIcon size={32} className="absolute text-pink-100" />
          {content.url && (
            <SmartImage
              src={content.url}
              alt={content.alt || ""}
              className="object-cover relative z-10"
            />
          )}
        </div>
        {content.caption && <figcaption className="text-center text-xs text-gray-400 italic font-semibold">{content.caption}</figcaption>}
      </figure>
    );
    case 'bullet_list': return (
      <ul className="space-y-3 text-gray-600 leading-relaxed text-base pl-2 my-4">
        {content.items?.map((item: string, i: number) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#3c2a34] mt-[0.6rem]" />
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
    );
    case 'numbered_list': return (
      <ol className="space-y-3 text-gray-600 leading-relaxed text-base my-4">
        {content.items?.map((item: string, i: number) => (
          <li key={i} className="flex gap-3">
            <span className="font-bold text-[#3c2a34] shrink-0">{i + 1}.</span>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ol>
    );
    case 'quote': return (
      <div className="border-l-[4px] border-[#3c2a34] pl-8 my-12 bg-white/50 p-10 rounded-r-lg italic relative overflow-hidden">
        <div className="absolute top-0 left-4 opacity-5 text-[#3c2a34] text-8xl font-serif">“</div>
        <p className="text-xl text-[#3c2a34] mb-4 leading-relaxed font-medium relative z-10">{content.text}</p>
        {content.author && <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] relative z-10">— {content.author}</p>}
      </div>
    );
    case 'divider': return <div className="flex items-center justify-center gap-2 py-10"><div className="w-1 h-1 rounded-full bg-rose-200" /><div className="w-1.5 h-1.5 rounded-full bg-rose-300" /><div className="w-1 h-1 rounded-full bg-rose-200" /></div>;
    case 'highlight': return <div className="bg-[#3c2a34] p-10 rounded-lg my-10 border border-white/5 relative overflow-hidden group shadow-xl"><div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" /><p className="text-pink-50 text-xl font-semibold italic leading-relaxed relative z-10">{content.text}</p></div>;
    case 'video': return <div className="my-10 relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-black border border-pink-100/30"><iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${content.video_id}`} title="Video" allowFullScreen /></div>;
    default: return null;
  }
}

/* ================= COMPONENT: COMMENT LIST ================= */

function CommentList({ articleId, onLoginRequest }: { articleId: string, onLoginRequest: () => void }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!articleId) return;
    setLoading(true);

    try {
      // 1. Fetch comments
      const { data: baseComments, error: commentError } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (commentError) throw commentError;
      if (!baseComments) { setComments([]); return; }

      // 2. Fetch ALL subcomments to calculate reply counts manually (since not a column)
      const { data: allReplies } = await supabase
        .from('article_comments')
        .select('id, parent_id')
        .eq('article_id', articleId)
        .not('parent_id', 'is', null);

      const replyCountMap: any = {};
      allReplies?.forEach(r => {
        if (r.parent_id) replyCountMap[r.parent_id] = (replyCountMap[r.parent_id] || 0) + 1;
      });

      // 3. Fetch user profiles
      const userIds = Array.from(new Set(baseComments.map(c => c.user_id)));
      const { data: profiles } = await supabase.from('users').select('id, name, avatar_url').in('id', userIds);

      // 4. Fetch user likes
      let userLikes: string[] = [];
      if (user) {
        const { data: likesData } = await supabase.from('article_comment_likes').select('comment_id').eq('user_id', user.id);
        userLikes = likesData?.map(l => l.comment_id) || [];
      }

      const merged = baseComments.map(comment => ({
        ...comment,
        user: profiles?.find(p => p.id === comment.user_id) || null,
        user_has_liked: userLikes.includes(comment.id),
        reply_count: replyCountMap[comment.id] || 0
      }));

      setComments(merged);
    } catch (err) {
      console.error("Comments fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [articleId, user]);

  useEffect(() => {
    fetchComments();
    const handleRefresh = () => fetchComments();
    window.addEventListener('refresh-comments', handleRefresh);
    return () => window.removeEventListener('refresh-comments', handleRefresh);
  }, [articleId, fetchComments]);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      {[1, 2].map(i => (
        <div key={i} className="flex gap-4">
          <div className="w-11 h-11 bg-pink-100 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 bg-pink-100 rounded" />
            <div className="h-16 w-full bg-pink-100 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );

  if (comments.length === 0) return (
    <div className="py-20 text-center text-gray-400 italic bg-white/20 rounded-[32px] border border-pink-100/50">
      Be the first to share your thoughts.
    </div>
  );

  return (
    <div className="space-y-12">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onLoginRequest={onLoginRequest} articleId={articleId} level={1} />
      ))}
    </div>
  );
}

function CommentItem({ comment, onLoginRequest, articleId, level = 1 }: { comment: any, onLoginRequest: () => void, articleId: string, level?: number }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  const fetchReplies = async () => {
    try {
      const { data: baseReplies, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('parent_id', localComment.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!baseReplies) return;

      const userIds = Array.from(new Set(baseReplies.map(r => r.user_id)));
      const { data: profiles } = await supabase.from('users').select('id, name, avatar_url').in('id', userIds);

      let userLikes: string[] = [];
      if (user) {
        const { data: likesData } = await supabase.from('article_comment_likes').select('comment_id').eq('user_id', user.id);
        userLikes = likesData?.map(l => l.comment_id) || [];
      }

      // Also get reply counts for sub-replies
      const replyIds = baseReplies.map(r => r.id);
      const { data: subReplies } = await supabase.from('article_comments').select('parent_id').in('parent_id', replyIds);
      const replyCountMap: any = {};
      subReplies?.forEach(sr => {
        replyCountMap[sr.parent_id] = (replyCountMap[sr.parent_id] || 0) + 1;
      });

      const merged = baseReplies.map(r => ({
        ...r,
        user: profiles?.find(p => p.id === r.user_id) || null,
        user_has_liked: userLikes.includes(r.id),
        reply_count: replyCountMap[r.id] || 0
      }));

      setReplies(merged);
      setShowReplies(true);
    } catch (err) { }
  };

  const handleLike = async () => {
    if (!user) { onLoginRequest(); return; }
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (localComment.user_has_liked) {
        await supabase.from('article_comment_likes').delete().eq('comment_id', localComment.id).eq('user_id', user.id);
        setLocalComment((prev: any) => ({ ...prev, user_has_liked: false, like_count: Math.max(0, (prev.like_count || 0) - 1) }));
      } else {
        await supabase.from('article_comment_likes').insert({ comment_id: localComment.id, user_id: user.id });
        setLocalComment((prev: any) => ({ ...prev, user_has_liked: true, like_count: (prev.like_count || 0) + 1 }));
      }
    } catch (err) { } finally { setIsLiking(false); }
  };

  const handleSubmitReply = async () => {
    if (!user || !replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      const { error } = await supabase.from('article_comments').insert({
        article_id: articleId,
        user_id: user.id,
        content: replyText.trim(),
        parent_id: localComment.id
      });

      if (error) throw error;

      setReplyText("");
      setIsReplying(false);

      setLocalComment((prev: any) => ({ ...prev, reply_count: (prev.reply_count || 0) + 1 }));
      fetchReplies();

      toast({ title: "Success", description: "Reply posted" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to post reply", variant: "destructive" });
    } finally { setIsSubmittingReply(false); }
  };

  const isReply = level > 1;
  const canReply = level < 3;

  return (
    <div className={`flex gap-4 group ${isReply ? 'ml-0' : ''}`}>
      <div className={`relative ${isReply ? 'w-10 h-10' : 'w-11 h-11'} rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-white mt-1`}>
        {localComment.user?.avatar_url ? (
          <SmartImage
            src={localComment.user.avatar_url}
            alt="User"
            className="object-cover"
            fallbackIconSize={isReply ? 16 : 18}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <UserIcon size={isReply ? 16 : 18} />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-[#3c2a34] text-sm">{localComment.user?.name || "Member"}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {formatDistanceToNow(new Date(localComment.created_at))} ago
          </span>
        </div>
        <p className={`text-gray-600 leading-relaxed text-sm bg-white p-5 rounded-2xl rounded-tl-none border border-pink-50 group-hover:shadow-sm transition-shadow`}>
          {localComment.content}
        </p>
        <div className="flex items-center gap-6 pl-1">
          <button
            onClick={handleLike}
            className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors ${localComment.user_has_liked ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
          >
            <Heart size={14} className={localComment.user_has_liked ? 'fill-current' : ''} /> {localComment.like_count || 0}
          </button>

          {canReply && (
            <button
              onClick={() => {
                if (!user) { onLoginRequest(); return; }
                setIsReplying(!isReplying);
              }}
              className={`text-[11px] font-bold text-gray-400 hover:text-[#3c2a34] flex items-center gap-1.5 transition-colors ${isReplying ? 'text-[#3c2a34]' : ''}`}
            >
              <Reply size={14} /> Reply
            </button>
          )}

          {(localComment.reply_count > 0) ? (
            <button
              onClick={() => {
                if (!showReplies) fetchReplies();
                else setShowReplies(false);
              }}
              className={`text-[11px] font-bold text-gray-400 hover:text-[#3c2a34] flex items-center gap-1.5 transition-colors ${showReplies ? 'text-[#3c2a34]' : ''}`}
            >
              <MessageCircle size={14} /> {localComment.reply_count || 0} {showReplies ? 'Hide' : 'Replies'}
            </button>
          ) : null}
        </div>

        {isReplying && (
          <div className="mt-4 relative animate-in slide-in-from-top-2 duration-300">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${localComment.user?.name || "Member"}...`}
              className="w-full p-4 bg-white border border-[#3c2a34]/80 rounded-3xl min-h-[100px] focus:ring-1 focus:ring-[#3c2a34] outline-none transition-all resize-none text-sm text-[#3c2a34] placeholder:text-gray-300 shadow-sm"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setIsReplying(false)}
                className="px-6 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-[#3c2a34] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmittingReply}
                className="bg-[#3c2a34] text-white px-8 py-2 rounded-full hover:opacity-90 disabled:opacity-40 transition-all font-bold shadow-md active:scale-95 text-xs flex items-center gap-2"
              >
                {isSubmittingReply ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Send size={12} /> Post Reply</>}
              </button>
            </div>
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="mt-6 pt-6 space-y-8 pl-8 border-l-2">
            {replies.map(r => (
              <CommentItem
                key={r.id}
                comment={r}
                onLoginRequest={onLoginRequest}
                articleId={articleId}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
