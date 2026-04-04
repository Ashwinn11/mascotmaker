import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Download, ArrowLeft, Share2 } from "lucide-react";
import { getGalleryItemById } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

import { MascotActions } from "./mascot-actions";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getGalleryItemById(parseInt(id));
  if (!item) return { title: "Mascot Not Found" };

  const absoluteImageUrl = item.image_url.startsWith("http") 
    ? item.image_url 
    : `https://mascotmaker.io${item.image_url}`;

  return {
    title: `${item.name} | Mascot Maker AI`,
    description: item.description || `Check out this consistent ${item.subject_type} generated with Mascot Maker AI. No character drift.`,
    openGraph: {
      title: `${item.name} - Character Identity Studio`,
      description: item.description || "Generated with Identity Lock technology.",
      images: [{ url: absoluteImageUrl }],
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
  const item = await getGalleryItemById(parseInt(id));

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-cream px-6 py-20 pb-32">
      <div className="mx-auto max-w-4xl">
        <Link 
          href="/gallery" 
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-candy-pink transition-colors font-black uppercase text-[10px] tracking-widest mb-12"
        >
          <ArrowLeft size={14} />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Mascot Preview */}
          <div className="relative aspect-square rounded-[3rem] border-4 border-foreground bg-white p-8 shadow-premium overflow-hidden group">
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-contain"
            />
            {item.subject_type === "Sticker" && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-[9px] font-black uppercase text-white tracking-widest border border-white/20">
                    Sticker Pack
                </div>
            )}
          </div>

          {/* Details & Viral Actions */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex gap-2 rounded-full bg-candy-pink/10 px-4 py-1.5 border-2 border-candy-pink/20 mb-4 whitespace-nowrap">
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink">
                  {item.subject_type || "Mascot"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-candy-pink/40 translate-y-2 translate-x-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                  #{item.id}
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-[0.9] italic">
                {item.name}
              </h1>
              <p className="mt-8 text-xl text-foreground/60 font-medium leading-relaxed">
                {item.description || "A consistent character generated with Mascot Maker Studio."}
              </p>
            </div>

            <MascotActions item={item} />
          </div>
        </div>
      </div>
    </main>
  );
}
