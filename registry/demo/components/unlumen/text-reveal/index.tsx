"use client";

import { TextReveal } from "@/registry/components/unlumen/text-reveal";

interface TextRevealDemoProps {
  splitBy?: "words" | "characters";
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
}

export const TextRevealDemo = ({
  splitBy = "words",
  staggerDelay = 0.05,
  duration = 0.5,
  once = true,
}: TextRevealDemoProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-24 space-y-24">
      {/* Hero Section */}
      <div className="space-y-6">
        <TextReveal
          text="Blur-Driven Text Animation"
          as="h1"
          splitBy={splitBy}
          staggerDelay={staggerDelay}
          duration={duration}
          once={once}
          className="text-5xl md:text-6xl font-bold tracking-tight text-foreground"
        />

        <TextReveal
          text="Every word appears exactly when you need it — viewport-triggered, blur-based, zero configuration required."
          as="p"
          splitBy={splitBy}
          staggerDelay={staggerDelay}
          duration={duration}
          once={once}
          className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed"
        />
      </div>

      {/* Word by Word Section */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Word by Word
        </h2>

        <TextReveal
          text="Elegant animations that reveal your message progressively. Each word fades in with a subtle blur-to-sharp transition as it enters the viewport. Perfect for engaging storytelling and creating compelling visual narratives."
          as="p"
          splitBy={splitBy}
          staggerDelay={staggerDelay}
          duration={duration}
          once={once}
          className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed"
        />
      </div>

      {/* Character by Character Section */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Character by Character
        </h2>

        <TextReveal
          text="For maximum precision, animate character by character."
          as="p"
          splitBy={splitBy}
          staggerDelay={staggerDelay}
          duration={duration}
          once={once}
          className="text-xl md:text-2xl font-medium text-foreground leading-relaxed"
        />
      </div>

      {/* Large Quote */}
      <div className="space-y-6 pt-12 border-t border-border">
        <TextReveal
          text="The viewport-triggered animation feels natural and immersive, adapting perfectly to different screen sizes."
          as="h3"
          splitBy={splitBy}
          staggerDelay={staggerDelay}
          duration={duration}
          once={once}
          className="text-3xl md:text-4xl font-bold text-foreground leading-relaxed italic"
        />

        <p className="text-muted-foreground">— Design System Documentation</p>
      </div>
    </div>
  );
};

export default TextRevealDemo;
