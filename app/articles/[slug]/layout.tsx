import { supabase } from "@/lib/supabase";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: article } = await supabase
    .from("articles")
    .select("*, seo:article_seo(*)")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!article) return { title: "Article Not Found" };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.seo?.meta_title || article.title,
    description: article.seo?.meta_description || article.description,
    openGraph: {
      title: article.seo?.og_title || article.title,
      description: article.seo?.og_description || article.description,
      images: [article.seo?.og_image || article.banner_image || "", ...previousImages],
      type: "article",
      publishedTime: article.published_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.twitter_title || article.title,
      description: article.seo?.twitter_description || article.description,
      images: [article.seo?.twitter_image || article.banner_image || ""],
    },
  };
}

export default function ArticleDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
