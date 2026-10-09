'use client';
import React from 'react';

// Helper component to render mathematical fractions, exponents, and formatted multiline text cleanly
export const MathRenderer = ({ text, className = "" }) => {
  if (!text) return null;

  // Render fraction with stacked numerator and denominator
  const renderFormattedText = (str) => {
    // Split by spaces or punctuation while matching fractions like "3/4" or "15/25"
    const parts = str.split(/(\b\d+\/\d+\b)/g);

    return parts.map((part, index) => {
      // Check if this part is a fraction (e.g. 3/4, 15/25)
      const fractionMatch = part.match(/^(\d+)\/(\d+)$/);
      if (fractionMatch) {
        const num = fractionMatch[1];
        const den = fractionMatch[2];
        return (
          <span key={index} className="inline-flex flex-col items-center justify-center align-middle mx-1 font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            <span className="border-b border-blue-500 leading-tight px-1 text-[0.9em]">{num}</span>
            <span className="leading-tight px-1 text-[0.9em]">{den}</span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <span className={`inline leading-relaxed whitespace-pre-line ${className}`}>
      {renderFormattedText(text)}
    </span>
  );
};
