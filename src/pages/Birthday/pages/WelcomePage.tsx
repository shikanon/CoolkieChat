import React from 'react';
import { useNavigate } from 'react-router-dom';
import OpeningAnimation from '../components/OpeningAnimation';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    navigate('/birthday/mosaic');
  };

  return <OpeningAnimation onComplete={handleAnimationComplete} />;
};

export default WelcomePage;
