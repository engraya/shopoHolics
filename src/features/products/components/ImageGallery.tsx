"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [bigImage, setBigImage] = useState(images[0]);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        {images.map((image, idx) => (
          <div
            key={idx}
            onClick={() => { setBigImage(image); setActiveIdx(idx); }}
            className={cn(
              "overflow-hidden rounded-lg bg-muted cursor-pointer ring-offset-background transition-all",
              activeIdx === idx
                ? "ring-2 ring-primary ring-offset-1"
                : "opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={image}
              width={200}
              height={200}
              alt={`Product thumbnail ${idx + 1}`}
              className="h-full w-full object-cover object-center"
              sizes="(max-width: 1024px) 25vw, 10vw"
            />
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-lg bg-muted lg:col-span-3">
        <Image
          src={bigImage}
          alt="Product main image"
          width={500}
          height={500}
          className="h-auto w-full object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
        <div className="absolute left-2 top-2">
          <Badge>Sale</Badge>
        </div>
      </div>
    </div>
  );
}
