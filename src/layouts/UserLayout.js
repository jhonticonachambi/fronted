// layouts/UserLayout.js
import React from 'react';
import Header from '../components/Header';
import AppContent from '../components/AppContent';
import '../assets/styles/Platform.css';
import '../assets/styles/Header.css';

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Header />
      <AppContent />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
