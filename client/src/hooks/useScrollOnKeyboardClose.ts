import { useEffect, useRef, useState } from "react";

const useScrollOnKeyboardClose = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    console.log("use effect calisti");

    const handleResize = () => {
      console.log("handle resize calisti");
      if (window.innerHeight > viewportHeight) {
        console.log("o ondan buyuk calisti");
        if (elementRef.current) {
          elementRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [viewportHeight]);

  return elementRef;
};

export default useScrollOnKeyboardClose;
