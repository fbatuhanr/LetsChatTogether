import { useEffect, useState } from "react";
import userAvatar from "../../assets/user-avatar.jpg";
import LoadingSpinner from "../LoadingSpinner";

interface ImgProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  className?: string;
}
const Img: React.FC<ImgProps> = ({ src, alt, width, height, className }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkImage = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    };

    checkImage(src).then(setIsValid);
  }, [src]);

  if (isValid === null) 
    return <LoadingSpinner />
  
  return (
    <img src={isValid ? src : userAvatar} alt={alt} width={width} height={height} className={className} />
  );
};

export default Img;
