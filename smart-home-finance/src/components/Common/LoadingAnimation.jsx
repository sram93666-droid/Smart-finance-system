import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      <div className="robot-animation">🤖</div>
      <div className="loading-dots">
        <span>.</span><span>.</span><span>.</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;