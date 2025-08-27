import React, { useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

const SafeImage = ({ 
  src, 
  alt, 
  width = 100, 
  height = 100, 
  className = '', 
  placeholderText = 'No Image',
  fallbackComponent = null 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If no src or error occurred, show placeholder
  if (!src || hasError) {
    return fallbackComponent || (
      <ImagePlaceholder 
        width={width} 
        height={height} 
        text={placeholderText} 
        className={className}
      />
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default SafeImage;
