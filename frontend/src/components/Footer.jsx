import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-emerald-600 text-white text-center py-4 mt-10">
      <p>&copy; {new Date().getFullYear()} Household Services. All rights reserved.</p>
    </footer>
  );
};

export default Footer;