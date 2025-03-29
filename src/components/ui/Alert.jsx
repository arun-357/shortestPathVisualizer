import React from 'react';

const Alert = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-lg shadow-lg z-50 transition-opacity duration-500 opacity-100 bg-red-600'>
      {message}
    </div>
  );
};

export default Alert;
