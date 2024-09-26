import React, { useEffect, useState } from "react";
import userAvatar from "../../assets/user-avatar.jpg"; // Yedek avatar

interface ImgProps {
  src?: string | FileList | File | null | undefined;
  alt?: string;
  width?: string;
  height?: string;
  className?: string;
}

const Img: React.FC<ImgProps> = ({
  src,
  alt = "Image",
  width = "256px",
  height = "256px",
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(typeof src === 'string' ? src : '');

  useEffect(() => {
    if (typeof src === "string") {
      setImgSrc(src);
    } else if (src instanceof FileList && src.length > 0) {
      setImgSrc(URL.createObjectURL(src[0]));
    }
  }, [src]);

  return (
    <div
      className={`relative ${className} overflow-hidden`}
      style={{ width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%]"></div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setImgSrc(userAvatar)}
      />
    </div>
  );
};

export default Img;
