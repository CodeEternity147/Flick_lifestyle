import React from 'react';

const ImagePlaceholder = ({ width = 100, height = 100, text = 'No Image', className = '' }) => {
  const style = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={style} className={className}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #d1d5db 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #d1d5db 2px, transparent 2px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
    </div>
  );
};

export default ImagePlaceholder;
