"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import PhotoLightbox from "@/components/members/photo-lightbox";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

const zoomIconSize: Record<AvatarSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

export default function MemberAvatar({
  nama,
  fotoUrl,
  size = "md",
  expandable = false,
  className,
}: {
  nama: string;
  fotoUrl?: string | null;
  size?: AvatarSize;
  expandable?: boolean;
  className?: string;
}) {
  const initials = getInitials(nama);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasPhoto = Boolean(fotoUrl);
  const canExpand = expandable && hasPhoto;

  return (
    <>
      <div
        role={canExpand ? "button" : undefined}
        tabIndex={canExpand ? 0 : undefined}
        aria-label={canExpand ? `Perbesar foto ${nama}` : undefined}
        onClick={canExpand ? () => setLightboxOpen(true) : undefined}
        onKeyDown={
          canExpand
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxOpen(true);
                }
              }
            : undefined
        }
        className={cn(
          "group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary",
          sizeMap[size],
          canExpand && "cursor-pointer",
          className,
        )}
      >
        {fotoUrl ? (
          <>
            <Image
              src={fotoUrl}
              alt={nama}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
            {canExpand && (
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-white opacity-0 transition-all duration-200 group-hover:bg-slate-900/40 group-hover:opacity-100 group-focus-visible:bg-slate-900/40 group-focus-visible:opacity-100">
                <ZoomIn className={zoomIconSize[size]} />
              </span>
            )}
          </>
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {canExpand && (
        <PhotoLightbox
          src={fotoUrl!}
          alt={nama}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      )}
    </>
  );
}
