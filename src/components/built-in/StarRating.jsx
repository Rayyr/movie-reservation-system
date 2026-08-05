'use client';

import { Star } from "lucide-react";
import React, { useState, useCallback, memo } from "react";

// ID generator
let nextId = 0;
const generateStarIds = (count) =>
  Array.from({ length: count }, () => `star-${nextId++}`);

// ⭐ Star Icon Component
const StarIcon = memo(
  ({ index, style, iconSize, onClick, onMouseMove, isInteractive }) => (
    <Star
      key={index}
      size={iconSize}
      fill={style.fill}
      color={style.color}
      onClick={onClick}
      onMouseMove={onMouseMove}
      className={`transition-colors duration-200 ${
        isInteractive ? "cursor-pointer" : ""
      }`}
      style={style}
    />
  )
);

StarIcon.displayName = "StarIcon";

// ⭐ Main Component
const StarRating = ({
  value,
  onChange,
  className = "",
  iconSize = 24,
  maxStars = 5,
  readOnly = false,
  color = "#e4c616",
}) => {
  const [hoverRating, setHoverRating] = useState(null);
  const [starIds] = useState(() => generateStarIds(maxStars));

  const calculateRating = useCallback((index, event) => {
    const star = event.currentTarget;
    const rect = star.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const clickPosition = x / width;

    let fraction = 1;
    if (clickPosition <= 0.25) fraction = 0.25;
    else if (clickPosition <= 0.5) fraction = 0.5;
    else if (clickPosition <= 0.75) fraction = 0.75;

    return index + fraction;
  }, []);

  const handleStarClick = useCallback(
    (index, event) => {
      if (readOnly || !onChange) return;
      const newRating = calculateRating(index, event);
      onChange(newRating);
    },
    [readOnly, onChange, calculateRating]
  );

  const handleStarHover = useCallback(
    (index, event) => {
      if (!readOnly) {
        const previewRating = calculateRating(index, event);
        setHoverRating(previewRating);
      }
    },
    [readOnly, calculateRating]
  );

  const handleMouseLeave = useCallback(() => {
    if (!readOnly) {
      setHoverRating(null);
    }
  }, [readOnly]);

  const getStarStyle = useCallback(
    (index) => {
      const ratingToUse =
        !readOnly && hoverRating !== null ? hoverRating : value;

      const difference = ratingToUse - index;

      if (difference <= 0) return { color: "gray", fill: "transparent" };
      if (difference >= 1) return { color: color, fill: color };

      return {
        color: color,
        fill: `url(#${starIds[index]})`,
      };
    },
    [readOnly, hoverRating, value, color, starIds]
  );

  const renderGradientDefs = () => {
    const ratingToUse =
      !readOnly && hoverRating !== null ? hoverRating : value;

    const partialStarIndex = Math.floor(ratingToUse);
    const partialFill = (ratingToUse % 1) * 100;

    if (partialFill > 0) {
      return (
        <linearGradient
          id={starIds[partialStarIndex]}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset={`${partialFill}%`} stopColor={color} />
          <stop offset={`${partialFill}%`} stopColor="transparent" />
        </linearGradient>
      );
    }
    return null;
  };

  const renderStars = () => {
    return Array.from({ length: maxStars }).map((_, index) => {
      const style = getStarStyle(index);
      return (
        <StarIcon
          key={starIds[index]}
          index={index}
          style={style}
          iconSize={iconSize}
          onClick={(e) => handleStarClick(index, e)}
          onMouseMove={(e) => handleStarHover(index, e)}
          isInteractive={!readOnly}
        />
      );
    });
  };

  return (
    <div
      className={`relative flex items-center gap-x-0.5 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>{renderGradientDefs()}</defs>
      </svg>

      {renderStars()}
    </div>
  );
};

export default StarRating;