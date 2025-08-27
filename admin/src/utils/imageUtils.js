// Generate a data URL for a placeholder image
export const generatePlaceholderDataURL = (width = 100, height = 100, text = 'No Image') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#pattern)"/>
      <defs>
        <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#f3f4f6"/>
          <circle cx="10" cy="10" r="1" fill="#d1d5db"/>
        </pattern>
      </defs>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-size="12" font-family="system-ui, -apple-system, sans-serif">${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Get image URL with fallback
export const getImageUrl = (imageUrl, fallbackText = 'No Image') => {
  if (!imageUrl) {
    return generatePlaceholderDataURL(100, 100, fallbackText);
  }
  return imageUrl;
};

// Handle image load error
export const handleImageError = (event, fallbackText = 'No Image') => {
  event.target.src = generatePlaceholderDataURL(100, 100, fallbackText);
};
