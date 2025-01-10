import React, { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  id?: string;
  placeholder?: string; // Placeholder image source
  lazyLoad?: boolean; // Enable or disable lazy loading
};

function Image({ src, alt, className, id, placeholder, lazyLoad = true }: Props) {
  const [loaded, setLoaded] = useState(false); // Track if the image is loaded

  return (
    <div className={`relative overflow-hidden ${className || ""}`} id={id}>
      {/* Placeholder image (visible only if lazyLoad and placeholder are enabled) */}
      {lazyLoad && placeholder && !loaded && (
        <img
          src={placeholder}
          alt="placeholder"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded || !lazyLoad ? "opacity-100" : "opacity-0"
        }`}
        loading={lazyLoad ? "lazy" : undefined} // Use lazy loading if enabled
        onLoad={() => setLoaded(true)} // Set loaded state to true on image load
      />
    </div>
  );
}

export default Image;
