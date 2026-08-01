"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Lightbox untuk menampilkan foto member dalam ukuran besar.
 * Bisa ditutup via tombol close, klik di luar area, atau tombol Escape.
 */
export default function PhotoLightbox({
  src,
  alt,
  open,
  onOpenChange,
}: {
  src: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-w-[90vw] border-0 bg-transparent p-0 shadow-none [&>button]:hidden sm:max-w-[90vw]">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] w-auto max-w-[90vw] rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Tutup foto"
            className="absolute right-2 top-2 z-10 rounded-full bg-slate-900/60 p-2 text-white backdrop-blur transition-colors hover:bg-slate-900/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
