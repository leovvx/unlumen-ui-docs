"use client";

import { ClippedCircle } from "@/registry/components/unlumen/clipped-circle";
import { Button } from "@workspace/ui/components/ui/button";
import Image from "next/image";

interface ClippedCircleDemoProps {
  circleSize: number;
}

export default function ClippedCircleDemo({
  circleSize = 400,
}: ClippedCircleDemoProps) {
  return (
    <div className="flex flex-wrap gap-8 items-center justify-center p-8">
      {/* Button */}
      <Button variant="outline" className="overflow-hidden relative group">
        Get Started
        <ClippedCircle circleSize={300} circleClassName="bg-white" />
      </Button>

      {/* Card */}
      <div className="relative text-background border aspect-square overflow-hidden rounded-xl bg-primary p-6 w-64 cursor-default">
        <h3 className="font-medium text-3xl mb-1">Fast & Lightweight</h3>
        <p className="text-background/50 text-xs leading-relaxed">
          Built with performance in mind, keeping your bundle size minimal.
        </p>
        <ClippedCircle circleSize={circleSize} circleClassName="bg-white" />
      </div>

      {/* Image */}
      <div className="relative border-5 overflow-hidden rounded-xl cursor-default">
        <Image
          src="/web-app-manifest-512x512.png"
          width={200}
          height={200}
          alt="Clipped Circle Demo"
          className="w-full h-full object-cover"
        />
        <ClippedCircle circleSize={circleSize} circleClassName="bg-white" />
      </div>
    </div>
  );
}
