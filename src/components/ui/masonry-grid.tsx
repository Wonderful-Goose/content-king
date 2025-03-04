'use client';

import React from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: React.ReactNode;
  breakpointCols?: {
    default: number;
    [key: number]: number;
  };
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  children,
  breakpointCols = {
    default: 3,
    1100: 2,
    700: 1
  }
}) => {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid; 