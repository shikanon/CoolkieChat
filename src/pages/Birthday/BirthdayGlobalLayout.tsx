import React from 'react';
import { Outlet } from 'react-router-dom';
import MusicPlayer from './components/MusicPlayer';

const BirthdayGlobalLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <MusicPlayer />
    </>
  );
};

export default BirthdayGlobalLayout;
