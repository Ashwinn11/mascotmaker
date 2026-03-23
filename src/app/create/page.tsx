import type { Metadata } from "next";
import { MascotCreator } from "@/components/mascot-creator";

export const metadata: Metadata = {
  title: "Create Your Mascot",
  description:
    "Design a custom mascot character from a text description or image upload. Refine with AI chat and animate with one click — professional AI design system.",
  alternates: {
    canonical: "https://mascotmaker.io/create",
  },
};

export default function CreatePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dotted">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-pink/5 via-candy-orange/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-4 animate-slide-up">
            Design Your Professional <span className="text-gradient">Mascot Character</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-2">
            The world's most advanced AI mascot creator. Create custom characters, build entire asset packs, and bring your designs to life with professional animations.
          </p>
        </div>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl opacity-50" />
        <div className="absolute -top-10 -right-20 h-48 w-48 rounded-full bg-candy-blue/10 blur-3xl opacity-50" />
      </div>

      <MascotCreator />

      {/* Substantial SEO Content Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 border-t border-border/20">
        <div className="prose prose-lg prose-pink max-w-none space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-foreground">How to Create your Custom AI Mascot</h2>
            <p className="text-muted-foreground leading-relaxed">
              Creating a custom mascot for your brand or project has never been easier than with Mascot Maker. Our advanced AI-driven design studio at mascotmaker.io allows anyone—from independent streamers to professional marketing teams—to generate high-fidelity, consistent character sets in seconds. By leveraging the latest in generative design and the Nano Banana 2 methodology, we ensure your mascots aren't just one-off images, but vibrant, expressive personalities with full commercial rights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-candy-pink/10 flex items-center justify-center text-candy-pink text-sm">1</span>
                Step 1: Define Your Vision
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start by entering a detailed description of the character you want to create. Whether you need a "tech-savvy shiba inu in a hoodie" or a "menacing steampunk owl," our engine understands complex artistic styles and character archetypes. You can also upload a reference image or photo to use as a template for your mascot's appearance and pose.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-candy-blue/10 flex items-center justify-center text-candy-blue text-sm">2</span>
                Step 2: Choose Your Style
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select from our curated list of professional art styles. From the cinematic 3D realism of modern animated films to flat vector minimalist logos, we have a style for every branding need. Our styles are specifically tuned to produce clean, high-resolution results that look great on any platform, from mobile apps to physical merchandise.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-candy-orange/10 flex items-center justify-center text-candy-orange text-sm">3</span>
                Step 3: Refine with AI Chat
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once the initial design is generated, use our integrated AI Chat Refiner to make precise adjustments. You can ask the mascot to "change the eye color to green" or "add a developer hat." This iterative process ensures that you get the exact design you had in mind, without having to start over or wait for manual revisions from a designer.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-candy-green/10 flex items-center justify-center text-candy-green text-sm">4</span>
                Step 4: Animate and Deploy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bring your character to life with our seamless animation engine. With one click, you can generate animated GIFs of your mascot performing various actions, from waving to dancing. Once you're happy with the results, download your high-resolution assets and use them anywhere. You retain full commercial rights to all outputs generated at mascotmaker.io.
              </p>
            </div>
          </div>

          <div className="pt-12 space-y-6">
            <h2 className="font-display text-3xl text-foreground">Why Consistent Character Design Matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              In modern digital marketing, consistency is king. If your mascot looks different in every post, you lose the opportunity to build brand recognition and trust. Mascot Maker is specifically designed to solve the "identity drift" problem common in most AI generators. We ensure that your mascot's colors, facial features, and body structure remain identical across different poses, asset types (like stickers or logos), and animations. This allows you to build a cohesive visual universe for your brand without the time and cost barrier of traditional character illustration studios.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
