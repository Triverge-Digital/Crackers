// modules/products/components/thumbnail/index.tsx
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden card-gradient soft-glow group-hover:shadow-xl transition-all duration-300",
        className,
        {
          "aspect-[4/3]": isFeatured,
          "aspect-[3/4]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "h-48": size === "small",
          "h-64": size === "medium",
          "h-80": size === "large",
          "h-96": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(124,58,237,0.04)] to-[rgba(251,107,43,0.03)] pointer-events-none" />
      <ImageOrPlaceholder image={initialImage} size={size} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-300"
      draggable={false}
      quality={80}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-brand-pink-500/6 to-brand-orange-500/6">
      <div className="text-center">
        <PlaceholderImage size={size === "small" ? 24 : 32} color="#6b7280" />
        <p className="text-gray-300 text-sm mt-2">Firework Image</p>
      </div>
    </div>
  )
}

export default Thumbnail