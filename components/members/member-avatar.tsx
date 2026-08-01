import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export default function MemberAvatar({
  nama,
  fotoUrl,
  size = "md",
  className,
}: {
  nama: string;
  fotoUrl?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const initials = getInitials(nama);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary",
        sizeMap[size],
        className,
      )}
    >
      {fotoUrl ? (
        <Image
          src={fotoUrl}
          alt={nama}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
