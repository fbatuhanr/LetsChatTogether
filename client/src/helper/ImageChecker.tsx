import { useEffect, useState } from 'react';

const ImageChecker = ({ imageUrl }: {imageUrl: string}) => {
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

    checkImage(imageUrl).then(setIsValid);
  }, [imageUrl]);

  if (isValid === null) {
    return (<div>Checking image...</div>);
  }

  return (
    <div>
      {isValid ? (
        <img src={imageUrl} alt="Valid" />
      ) : (
        <div>Image URL is broken or invalid</div>
      )}
    </div>
  );
};

export default ImageChecker;