import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Download, ArrowLeft, Share2 } from "lucide-react";
import { MascotActions } from "./mascot-actions";
import { getGalleryItemById, isItemPurchased } from "@/lib/db";
import { auth } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getGalleryItemById(parseInt(id));
  if (!item) return { title: "Mascot Not Found" };

  const absoluteImageUrl = `https://mascotmaker.io/api/mascot/${id}/preview`;

  return {
    title: `${item.name} | Mascot Maker AI`,
    description: item.description || `Check out this consistent ${item.subject_type} generated with Mascot Maker AI. No character drift.`,
    openGraph: {
      title: `${item.name} - Character Identity Studio`,
      description: item.description || "Generated with Identity Lock technology.",
      images: [{ url: absoluteImageUrl }],
    },
    alternates: {
      canonical: `https://mascotmaker.io/mascot/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      images: [absoluteImageUrl],
    },
  };
}

export default async function MascotPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const item = await getGalleryItemById(parseInt(id));

  if (!item) notFound();
  // Guard: unpublished items must not be visible to Google or unauthenticated users
  if (!item.published && item.user_id !== userId) notFound();


  const isOwner = userId ? item.user_id === userId : false;
  const isPurchased = !isOwner && userId
    ? await isItemPurchased(userId, item.id)
    : false;

  return (
    <main className="min-h-screen bg-[#0c0a09] px-6 py-32 overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-candy-pink/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <Link 
          href="/gallery" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest mb-12 bg-white/5 py-2 px-4 rounded-full border border-white/5 backdrop-blur-md"
        >
          <ArrowLeft size={14} />
          Back to Studio
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Mascot Preview */}
          <div className="relative aspect-square rounded-[3rem] border border-white/10 bg-[#1c1916] glass-dark shadow-2xl overflow-hidden group">
            {/* Checkerboard subtle background for alpha */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
            
            <img 
              src={`/api/mascot/${item.id}/preview?v=${Date.now()}`} 
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-2xl p-8 relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {item.subject_type === "Sticker" && (
                <div className="absolute top-6 right-6 bg-[#0c0a09]/80 backdrop-blur-md rounded-full px-4 py-1.5 text-[9px] font-black uppercase text-white tracking-widest border border-white/10 shadow-lg z-20">
                    Sticker Pack
                </div>
            )}
          </div>

          {/* Details & Viral Actions */}
          <div className="space-y-10 lg:pl-6">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="inline-flex gap-2 rounded-full glass-dark px-4 py-1.5 border border-white/10 whitespace-nowrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">
                    {item.subject_type || "Mascot"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20 self-center" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    #{item.id}
                  </span>
                </div>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-white uppercase tracking-tight leading-[0.9] drop-shadow-sm">
                {item.name}
              </h1>
              <p className="mt-6 text-lg text-white/50 font-medium leading-relaxed max-w-md">
                {item.description || "A consistent character generated with Mascot Maker Studio."}
              </p>
            </div>

            <MascotActions item={item} isOwner={isOwner} isPurchased={isPurchased} />
          </div>
        </div>
      </div>
    </main>
  );
}
