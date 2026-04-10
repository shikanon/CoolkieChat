import React from 'react';
import { useNavigate } from 'react-router-dom';
import MosaicView from '../components/MosaicView';

const MosaicPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterMain = () => {
    navigate('/birthday/home');
  };

  return <MosaicView onEnter={handleEnterMain} />;
};

export default MosaicPage;
