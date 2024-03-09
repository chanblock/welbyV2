import React, { useState } from 'react';

function Slider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const length = children.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? length - 1 : prevIndex - 1));
  };

  return (
    <div className="slider">
      <button onClick={prevSlide}>Previous</button>
      {children.map((child, index) => (
        <div key={index} className={index === currentIndex ? 'slide active' : 'slide'}>
          {child}
        </div>
      ))}
      <button onClick={nextSlide}>Next</button>
    </div>
  );
}

export default Slider;
